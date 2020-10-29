import React, { Component, Fragment } from "react";
import {
    Container,
    Dimmer,
    Header,
    Icon,
    Image,
    Label,
    Loader,
    Table,
    Button,
    Message,
    Segment,
    Confirm,
} from "semantic-ui-react";
import { Link, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
    removCartItem,
    AddRemoveItemQuantity,
    fetchCarts
} from '../../actions/cartActions';

import { confirmAlert } from 'react-confirm-alert'; // Import



class OrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            error: null,
            loading: false,
        };
    }

    componentDidMount() {
        this.props.fetchCarts()
    }

    static propTypes = {
        cartsdata: PropTypes.object.isRequired,
    }

    ConfirmPopup = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.props.removCartItem(id)
                },
                {
                    label: 'No',
                }
            ]
        })
    }


    toggle() {
        const currentState = this.state.visible;
        this.setState({ visible: !currentState });
        this.props.cartsdata.message = null;
    }

    getTotalPrice = data => {
        var total = 0;
        data.forEach(d => {
            if (d.ordered === false) { total += d.final_price; }
        });
        return total
    }


    handelAddRemoveItemQuantity = (id, action) => {
        this.props.AddRemoveItemQuantity(id, action).then(result => {
            if (result === 'removed') {
                this.props.cartsdata.data.forEach(cart => {
                    if (cart.id === id) {
                        cart.quantity -= 1;
                        cart.final_price = cart.final_price - cart.item.price + cart.item.discount_price
                        this.setState({ quantity: cart.quantity, final_price: cart.final_price })
                    }
                })
            }
            else if (result === 'added') {
                this.props.cartsdata.data.forEach(cart => {
                    if (cart.id === id) {
                        cart.quantity += 1;
                        cart.final_price = (cart.final_price + (cart.item.price - cart.item.discount_price))
                        this.setState({ quantity: cart.quantity, final_price: cart.final_price })
                    }
                })
            }
            this.getTotalPrice(this.props.cartsdata.data)
        })
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
        const { data, loading } = this.props.cartsdata;
        const checkPaymentAvailability = this.handleCheckoutShowButton(data);

        return (
            <>
                <Header style={{ textAlign: 'center', color: 'white', border: '2px solid purple', background: 'purple', fontSize: '30px' }}>Order Summary</Header>
                {loading && (
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>

                        <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
                    </Segment>
                )}
                <Table color='purple' celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>S.N.</Table.HeaderCell>
                            <Table.HeaderCell>Item name</Table.HeaderCell>
                            <Table.HeaderCell>Color</Table.HeaderCell>
                            <Table.HeaderCell>Size</Table.HeaderCell>
                            <Table.HeaderCell>Item price</Table.HeaderCell>
                            <Table.HeaderCell>Item quantity</Table.HeaderCell>
                            <Table.HeaderCell>Total item price</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.length > 0 ? data.map((cart, i) => (
                            <Fragment key={cart.id}>
                                < Table.Row>
                                    <Table.Cell>{i + 1}</Table.Cell>
                                    <Table.Cell>{cart.item.title}
                                    </Table.Cell>
                                    <Table.Cell>{cart.color.toUpperCase()}</Table.Cell>
                                    <Table.Cell>{cart.size.toUpperCase()}</Table.Cell>
                                    <Table.Cell><i className="rupee sign icon"></i>{cart.item.price}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Icon
                                            name="minus"
                                            style={{ float: "left", cursor: "pointer" }}
                                            onClick={() => this.handelAddRemoveItemQuantity(cart.id, 'remove')}
                                        />
                                        <span>{cart.quantity}</span>
                                        <Icon
                                            name="plus"
                                            style={{ float: "right", cursor: "pointer" }}
                                            onClick={() => this.handelAddRemoveItemQuantity(cart.id, 'add')}
                                        />
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">{cart.final_price}</Table.Cell>
                                    <Table.Cell>
                                        {cart.item.discount_price ?
                                            <Fragment>
                                                <Label color="green" ribbon>
                                                    ON DISCOUNT
                                            </Label>
                                                <span ><i className="rupee sign icon">
                                                    {cart.item.discount_price}</i>
                                                </span>
                                            </Fragment> : <Label color="red" ribbon>
                                                NO DISCOUNT
                                        </Label>}
                                        {cart.ordered === false ?
                                            <Icon
                                                name="trash"
                                                color="red"
                                                style={{ float: "right", cursor: "pointer", }}
                                                onClick={() => this.ConfirmPopup(cart.id)}
                                            />
                                            : <>
                                                <Icon
                                                    name="check circle outline"
                                                    color="green"
                                                    style={{ float: "right", cursor: "pointer", }}
                                                />
                                                <Icon
                                                    name="trash"
                                                    color="red"
                                                    style={{ float: "right", cursor: "pointer", }}
                                                    onClick={() => this.ConfirmPopup(cart.id)}
                                                />
                                            </>}
                                        <Link to={`/home/product-detail/${cart.item.id}`}><Icon
                                            name="eye"
                                            style={{ float: "right", cursor: "pointer" }}
                                        /></Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Fragment>
                        )
                        )
                            :
                            <Table.Row>
                                <Table.Cell />
                                <Table.Cell textAlign="center">
                                    <h3>No Order Summery!</h3>
                                </Table.Cell>
                            </Table.Row>}
                        {data &&
                            <Table.Row>
                                <Table.Cell colSpan={6} />
                                <Table.Cell textAlign="right" colSpan="2">
                                    Order Total:{this.getTotalPrice(data)}
                                </Table.Cell>
                            </Table.Row>}
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan={9}>
                                {checkPaymentAvailability > 0 ?
                                    <Button floated="right" color="yellow" as={Link} to="/home/checkout">
                                        Checkout
                                        </Button> :
                                    <Button as={Link} to='/home/profile' floated="right" color="green">
                                        Check your profile
                                        </Button>
                                }
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </>
        )
    }
}
const mapstateToProps = state => ({
    cartsdata: state.all_carts,
})
export default connect(mapstateToProps, {
    removCartItem,
    AddRemoveItemQuantity, fetchCarts
})(OrderList);