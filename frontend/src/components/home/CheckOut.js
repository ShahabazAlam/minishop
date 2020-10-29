import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {
    Container,
    Grid,
    Image,
    Header,
    Divider,
    Segment,
    Item,
    Label,
    Button,
    Modal,
    Form,
    Select,
    Message,
    Dimmer,
    Loader,
    Icon,
} from 'semantic-ui-react';
import {
    CardElement,
    injectStripe,
    Elements,
    StripeProvider
} from "react-stripe-elements";
import { fetchCarts } from '../../actions/cartActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { handleAddCoupon, handlefetchCoupon } from '../../actions/Coupon';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { fetchAddresses } from '../../actions/Address';
import { tokenConfig } from '../../actions/Auth';
import axios from 'axios';

class Products extends Component {

    constructor() {
        super()
        this.state = {
            visible: false,
            code: "",
        }
    }


    handleCouponChange = e => {
        this.setState({
            code: e.target.value
        });
    };

    handleCouponSubmit = e => {
        e.preventDefault()
        this.props.handleAddCoupon(code)
        this.setState({ code: "", visible: false });
    };

    getTotalPrice = data => {
        var total = 0;
        const { coupon_amount } = this.props.coupon_data
        data.forEach(d => {
            if (d.ordered === false)
                total += d.final_price;
        });
        return (total - coupon_amount)
    }

    onModalClose = () => {
        this.setState({ visible: false })
    }

    onModalOpen = () => {
        this.setState({ visible: true })
    }


    render() {
        const { coupon_amount, loading, message } = this.props.coupon_data;
        const { data } = this.props;

        return (
            <Fragment>
                <Segment>
                    <Grid columns='3' >
                        <Grid.Row style={{
                            marginLeft: '40px'
                        }}>
                            {data.map((orderItem, i) => (
                                orderItem.ordered === false &&
                                <Grid.Column key={i} reversed='mobile vertically'>
                                    <Item >
                                        <Item.Image
                                            size="tiny"
                                            src={orderItem.item.image}
                                        />
                                        <Item.Content verticalAlign="middle">
                                            <Item.Header as="a">
                                                {orderItem.quantity} x {orderItem.item.title}
                                            </Item.Header>
                                            <Item.Extra>
                                                <Label>${orderItem.final_price}</Label>
                                            </Item.Extra>
                                        </Item.Content>
                                    </Item>
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                    </Grid>
                    <Divider />
                    <Segment style={{ textAlign: 'center' }}><strong>Total:{this.getTotalPrice(data)}</strong></Segment>
                </Segment>
                <Divider />
                {coupon_amount === 0 ?
                    <Button fluid color='brown' onClick={this.onModalOpen}>Have a coupen?</Button>
                    :
                    <Button fluid color='green' disabled>Coupon Applied for {coupon_amount}</Button>
                }


                {/* Modal start */}
                <Modal
                    size='mini'
                    open={this.state.visible}
                    onClose={this.onModalClose}
                    className='text-primary text-center'
                    closeOnEscape={false}
                    closeOnDimmerClick={false}
                >
                    <Modal.Header>
                        Coupon
                        <a onClick={this.onModalClose} style={{ color: 'red', cursor: "pointer", float: 'right' }}>x</a>
                    </Modal.Header>
                    <Modal.Content>
                        <React.Fragment>
                            <Form onSubmit={this.handleCouponSubmit}>
                                <Form.Field>
                                    <label>Coupon code</label>
                                    <input
                                        placeholder="Enter a coupon.."
                                        value={this.state.code}
                                        onChange={this.handleCouponChange}
                                    />
                                </Form.Field>
                                <Button type="submit">Submit</Button>
                            </Form>
                        </React.Fragment>
                    </Modal.Content>
                </Modal >
                {/* Modal stop */}


            </Fragment >
        )
    }
}

const authAxios = axios.create({
    headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
    }
})


class CheckoutForm extends Component {
    state = {
        data: null,
        loading: false,
        error: null,
        success: false,
        shippingAddresses: [],
        billingAddresses: [],
        selectedBillingAddress: "",
        selectedShippingAddress: "",
        payment_processing: false,
        redirectTimeout: null,
    };


    componentDidMount() {
        this.handleBillingAddresses();
        this.handleShippingAddresses();
    }


    componentWillUnmount() {
        clearTimeout(this.redirectTimeout);
    }


    handleGetDefaultAddress = addresses => {
        const filteredAddresses = addresses.filter(el => el.default === true);
        if (filteredAddresses.length > 0) {
            return filteredAddresses[0].id;
        }
        return "";
    };

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };


    handleBillingAddresses = () => {
        const addressType = 'B';
        this.setState({ loading: true });
        authAxios.get(`/fetch-address/?address_type=${addressType}`).then(res => {
            this.setState({
                billingAddresses: res.data.map(a => {
                    return {
                        key: a.id,
                        text: `${a.street_address}, ${a.apartment_address}, ${a.country}`,
                        value: a.id
                    };
                }),
                selectedBillingAddress: this.handleGetDefaultAddress(res.data),
                loading: false
            })
        }).catch(err => {
            this.setState({ error: err, loading: false });
        });
    }


    handleShippingAddresses = () => {
        const addressType = 'S';
        this.setState({ loading: true });
        authAxios.get(`/fetch-address/?address_type=${addressType}`).then(res => {
            this.setState({
                shippingAddresses: res.data.map(a => {
                    return {
                        key: a.id,
                        text: `${a.street_address}, ${a.apartment_address}, ${a.country}`,
                        value: a.id
                    };
                }),
                selectedShippingAddress: this.handleGetDefaultAddress(res.data),
                loading: false
            });
        }).catch(err => {
            this.setState({ error: err, loading: false });
        });
    }



    handlePayment = event => {
        event.preventDefault();
        const { stripe } = this.props;
        const { selectedBillingAddress, selectedShippingAddress } = this.state;

        this.setState({ payment_processing: true });
        if (selectedBillingAddress !== '' && selectedShippingAddress !== '') {
            const token = stripe.createToken().then(res => {
                if (res.error) {
                    this.setState({ error: res.error.message, payment_processing: false })
                }
                else {
                    authAxios.post('/make-payment/',
                        {
                            s_token: res.token.id,
                            selectedBillingAddress,
                            selectedShippingAddress
                        }).then(res => {

                            this.setState({ payment_processing: false, success: true });
                            this.redirectTimeout = setTimeout(() => {
                                this.props.history.push('/home/profile/')
                            }, 5000)
                        })
                        .catch(err => {
                            this.setState({ payment_processing: false, error: err });
                        });
                }
            })
        } else {
            if (selectedBillingAddress === '') {
                this.setState({ payment_processing: false, error: 'Please provide Billing Address' })
            }
            else if (selectedShippingAddress === '') {
                this.setState({ payment_processing: false, error: 'Please provide Shipping Address' })
            }
        }
    };


    render() {
        const { error, loading, success, billingAddresses, payment_processing,
            shippingAddresses, selectedBillingAddress, selectedShippingAddress, } = this.state;


        return (

            <Fragment>
                <Segment>
                    {error && (
                        <Message
                            error
                            header="Something went wrong."
                            content={JSON.stringify(error)}
                        />
                    )}
                    {success && (
                        <Message icon>
                            <Icon name='circle notched' loading />
                            <Message.Content>
                                <Message.Header>Redirecting to profile...</Message.Header>
                                    Your payment was successfull please wait.
                                    </Message.Content>
                        </Message>

                    )}
                    {loading && (
                        <Segment>
                            <Dimmer active inverted>
                                <Loader inverted>Loading</Loader>
                            </Dimmer>
                            <Image src="/images/wireframe/short-paragraph.png" />
                        </Segment>
                    )}
                    <Header>Select Billing Address</Header>
                    {billingAddresses.length > 0 ?
                        <Select
                            placeholder='Select Billing Address'
                            name="selectedBillingAddress"
                            value={selectedBillingAddress}
                            clearable
                            options={billingAddresses}
                            selection
                            fluid
                            onChange={this.handleSelectChange}
                        /> :
                        <Segment><Button as={Link} to='profile' fluid color='orange'>Add a Billing Assress</Button></Segment>
                    }

                    <Divider />
                    <Header>Select Shipping Address</Header>
                    {shippingAddresses.length > 0 ?
                        <Select
                            placeholder='Select Shipping Address'
                            name="selectedShippingAddress"
                            value={selectedShippingAddress}
                            clearable
                            options={shippingAddresses}
                            selection
                            fluid
                            onChange={this.handleSelectChange}
                        /> :
                        <Segment><Button as={Link} to='profile' fluid color='orange'>Add a Shipping Address</Button></Segment>
                    }
                    <Divider />
                    <Header>Would you like to complete the purchase?</Header>
                    <Divider />
                    <Segment>
                        <CardElement />
                        <Divider />
                        {success && (
                            <Message positive>
                                <Message.Header>Your payment was successful</Message.Header>
                                <p>
                                    Go to your <b>profile</b> to see the order delivery status.
                                </p>
                            </Message>
                        )}
                        <Button
                            disabled={payment_processing}
                            primary
                            fluid
                            onClick={this.handlePayment}
                            style={{ marginTop: "10px" }}
                        >
                            {payment_processing ?
                                <i
                                    className="fa fa-refresh fa-spin"
                                    style={{ marginRight: "5px" }}
                                /> : 'Submit'}
                        </Button>
                    </Segment>
                </Segment>
            </Fragment >
        );
    }
}


const InjectedCheckoutForm = withRouter(injectStripe(CheckoutForm))



class WrappedForm extends Component {
    static propTypes = {
        cartsdata: PropTypes.object.isRequired,
        coupon: PropTypes.object.isRequired,

    }

    componentDidMount() {
        this.props.fetchCarts()
        this.props.handlefetchCoupon()
    }


    handleCheckoutShowButton = (data) => {
        const checkArray = []
        data.forEach(res => {
            if (res.ordered == false) {
                checkArray.push(res.id)
            }
        })
        return checkArray.length;
    }
    render() {
        const { data } = this.props.cartsdata;
        const checkPaymentAvailability = this.handleCheckoutShowButton(data);

        return (
            <Fragment>
                {checkPaymentAvailability > 0 ?
                    <Container>
                        <Grid columns={2} padded>
                            <Grid.Column width={9}>
                                <Header>Products</Header>
                                <Divider />
                                <Products data={data}
                                    handleAddCoupon={this.props.handleAddCoupon}
                                    coupon_data={this.props.coupon} />
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header>Payment</Header>
                                <Divider />
                                <StripeProvider apiKey='Your Api Key'>
                                    <Elements>
                                        <InjectedCheckoutForm />
                                    </Elements>
                                </StripeProvider>
                            </Grid.Column>
                        </Grid>
                    </Container>
                    :
                    <Grid columns={10} padded>
                        <Grid.Column width={15}>
                            <Header>Payment</Header>
                            <Divider />
                            <h4> No Payment Available</h4>
                            <Button as={Link} to='/home' color='pink'>Go back to home</Button>
                        </Grid.Column>
                    </Grid>
                }
            </Fragment>
        )
    }

}

const mapstateToProps = state => ({
    cartsdata: state.all_carts,
    coupon: state.coupon,
})

export default connect(mapstateToProps, {
    fetchCarts,
    handleAddCoupon,
    handlefetchCoupon,
    fetchAddresses
})(WrappedForm)