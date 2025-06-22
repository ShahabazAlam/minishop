// CheckOut.jsx
import React, { useEffect, useState, Fragment } from 'react';
import {
    Container, Grid, Image, Header, Divider, Segment, Item, Label,
    Button, Modal, Form, Select, Message, Dimmer, Loader, Icon
} from 'semantic-ui-react';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarts } from '../../actions/cartActions';
import { handleAddCoupon, handlefetchCoupon } from '../../actions/Coupon';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51Hf6gEBcz79DwPzsdDL2NJUrTlaEZlyIErSoOHjfzKt6PXOxvk2lZWqOYgg1gfXrPE2KlXFMWlZIhnZCra2H4Y4U00R7LdyE1F');

const authAxios = axios.create({
    headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
    }
});

const Products = ({ data, handleAddCoupon, coupon_data }) => {
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState("");

    const getTotalPrice = (data) => {
        let total = 0;
        data.forEach(d => {
            if (!d.ordered)
                total += d.final_price;
        });
        return total - coupon_data.coupon_amount;
    };

    const handleCouponSubmit = (e) => {
        e.preventDefault();
        handleAddCoupon(code);
        setCode("");
        setVisible(false);
    };

    return (
        <Fragment>
            <Segment>
                <Grid columns='3'>
                    <Grid.Row style={{ marginLeft: '40px' }}>
                        {data.map((orderItem, i) => (
                            !orderItem.ordered &&
                            <Grid.Column key={i} reversed='mobile vertically'>
                                <Item>
                                    <Item.Image size="tiny" src={orderItem.item.image} />
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
                <Segment textAlign='center'><strong>Total: {getTotalPrice(data)}</strong></Segment>
            </Segment>
            <Divider />
            {coupon_data.coupon_amount === 0 ?
                <Button fluid color='brown' onClick={() => setVisible(true)}>Have a coupon?</Button>
                :
                <Button fluid color='green' disabled>Coupon Applied for {coupon_data.coupon_amount}</Button>
            }
            <Modal size='mini' open={visible} onClose={() => setVisible(false)}>
                <Modal.Header>
                    Coupon
                    <span onClick={() => setVisible(false)} style={{ color: 'red', cursor: "pointer", float: 'right' }}>x</span>
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleCouponSubmit}>
                        <Form.Field>
                            <label>Coupon code</label>
                            <input
                                placeholder="Enter a coupon.."
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </Form.Field>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        </Fragment>
    );
};

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [billingAddresses, setBillingAddresses] = useState([]);
    const [selectedBillingAddress, setSelectedBillingAddress] = useState("");
    const [selectedShippingAddress, setSelectedShippingAddress] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        fetchAddresses('B');
        fetchAddresses('S');
    }, []);

    const fetchAddresses = (type) => {
        setLoading(true);
        authAxios.get(`/fetch-address/?address_type=${type}`).then(res => {
            const options = res.data.map(a => ({
                key: a.id,
                text: `${a.street_address}, ${a.apartment_address}, ${a.country}`,
                value: a.id
            }));
            const defaultId = res.data.find(a => a.default)?.id || "";
            if (type === 'B') {
                setBillingAddresses(options);
                setSelectedBillingAddress(defaultId);
            } else {
                setShippingAddresses(options);
                setSelectedShippingAddress(defaultId);
            }
            setLoading(false);
        }).catch(err => {
            setError(err);
            setLoading(false);
        });
    };

    const handlePayment = async () => {
        setPaymentProcessing(true);
        if (!selectedBillingAddress || !selectedShippingAddress) {
            setError("Please select both Billing and Shipping Addresses");
            setPaymentProcessing(false);
            return;
        }
        const cardElement = elements.getElement(CardElement);
        const result = await stripe.createToken(cardElement);
        if (result.error) {
            setError(result.error.message);
            setPaymentProcessing(false);
        } else {
            authAxios.post('/make-payment/', {
                s_token: result.token.id,
                selectedBillingAddress,
                selectedShippingAddress
            }).then(() => {
                setSuccess(true);
                setPaymentProcessing(false);
                setTimeout(() => navigate('/home/profile/'), 5000);
            }).catch(err => {
                setError(err);
                setPaymentProcessing(false);
            });
        }
    };

    return (
        <Segment>
            {error && <Message error header="Error" content={JSON.stringify(error)} />}
            {success && (
                <Message icon>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Redirecting to profile...</Message.Header>
                        Your payment was successful.
                    </Message.Content>
                </Message>
            )}
            {loading && <Dimmer active><Loader /></Dimmer>}

            <Header>Select Billing Address</Header>
            {billingAddresses.length > 0 ? (
                <Select
                    placeholder='Select Billing Address'
                    value={selectedBillingAddress}
                    options={billingAddresses}
                    onChange={(e, { value }) => setSelectedBillingAddress(value)}
                    fluid
                    selection
                />) : (
                <Segment><Button as={Link} to='/profile' fluid color='orange'>Add Billing Address</Button></Segment>
            )}

            <Divider />
            <Header>Select Shipping Address</Header>
            {shippingAddresses.length > 0 ? (
                <Select
                    placeholder='Select Shipping Address'
                    value={selectedShippingAddress}
                    options={shippingAddresses}
                    onChange={(e, { value }) => setSelectedShippingAddress(value)}
                    fluid
                    selection
                />) : (
                <Segment><Button as={Link} to='/profile' fluid color='orange'>Add Shipping Address</Button></Segment>
            )}

            <Divider />
            <Header>Complete the Purchase</Header>
            <Segment>
                <CardElement />
                {success && (
                    <Message positive>
                        <Message.Header>Payment Successful</Message.Header>
                        <p>Go to your <b>profile</b> to see the order delivery status.</p>
                    </Message>
                )}
                <Button
                    disabled={paymentProcessing}
                    primary
                    fluid
                    onClick={handlePayment}
                    style={{ marginTop: "10px" }}>
                    {paymentProcessing ? <Icon name='spinner' loading /> : 'Submit'}
                </Button>
            </Segment>
        </Segment>
    );
};

const WrappedForm = () => {
    const dispatch = useDispatch();
    const cartsdata = useSelector(state => state.all_carts);
    const coupon = useSelector(state => state.coupon);

    useEffect(() => {
        dispatch(fetchCarts());
        dispatch(handlefetchCoupon());
    }, [dispatch]);

    const checkPaymentAvailability = cartsdata.data.filter(res => !res.ordered).length;

    return (
        <Fragment>
            {checkPaymentAvailability > 0 ? (
                <Container>
                    <Grid columns={2} padded>
                        <Grid.Column width={9}>
                            <Header>Products</Header>
                            <Divider />
                            <Products
                                data={cartsdata.data}
                                handleAddCoupon={(code) => dispatch(handleAddCoupon(code))}
                                coupon_data={coupon}
                            />
                        </Grid.Column>
                        <Grid.Column width={7}>
                            <Header>Payment</Header>
                            <Divider />
                            <Elements stripe={stripePromise}>
                                <CheckoutForm />
                            </Elements>
                        </Grid.Column>
                    </Grid>
                </Container>
            ) : (
                <Grid columns={10} padded>
                    <Grid.Column width={15}>
                        <Header>Payment</Header>
                        <Divider />
                        <h4>No Payment Available</h4>
                        <Button as={Link} to='/home' color='pink'>Go back to home</Button>
                    </Grid.Column>
                </Grid>
            )}
        </Fragment>
    );
};

export default WrappedForm;
