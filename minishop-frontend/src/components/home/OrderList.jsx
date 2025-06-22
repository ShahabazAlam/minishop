import React, { useEffect, useState, Fragment } from "react";
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
} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {
    removCartItem,
    AddRemoveItemQuantity,
    fetchCarts
} from '../../actions/cartActions';

import { confirmAlert } from 'react-confirm-alert';

const OrderList = ({ cartsdata }) => {
    const [quantityData, setQuantityData] = useState({});

    useEffect(() => {
        fetchCarts();
    }, [fetchCarts]);

    const ConfirmPopup = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => removCartItem(id)
                },
                {
                    label: 'No'
                }
            ]
        });
    };

    const getTotalPrice = (data) => {
        return data.reduce((total, d) => d.ordered === false ? total + d.final_price : total, 0);
    };

    const handelAddRemoveItemQuantity = (id, action) => {
        AddRemoveItemQuantity(id, action).then(result => {
            setQuantityData(prev => ({ ...prev }));
        });
    };

    const handleCheckoutShowButton = (data) => {
        return data.filter(res => res.ordered === false).length;
    };

    const { data, loading } = cartsdata;
    const checkPaymentAvailability = handleCheckoutShowButton(data);

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
                            <Table.Row>
                                <Table.Cell>{i + 1}</Table.Cell>
                                <Table.Cell>{cart.item.title}</Table.Cell>
                                <Table.Cell>{cart.color.toUpperCase()}</Table.Cell>
                                <Table.Cell>{cart.size.toUpperCase()}</Table.Cell>
                                <Table.Cell><i className="rupee sign icon"></i>{cart.item.price}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Icon
                                        name="minus"
                                        style={{ float: "left", cursor: "pointer" }}
                                        onClick={() => handelAddRemoveItemQuantity(cart.id, 'remove')}
                                    />
                                    <span>{cart.quantity}</span>
                                    <Icon
                                        name="plus"
                                        style={{ float: "right", cursor: "pointer" }}
                                        onClick={() => handelAddRemoveItemQuantity(cart.id, 'add')}
                                    />
                                </Table.Cell>
                                <Table.Cell textAlign="center">{cart.final_price}</Table.Cell>
                                <Table.Cell>
                                    {cart.item.discount_price ? (
                                        <Fragment>
                                            <Label color="green" ribbon>
                                                ON DISCOUNT
                                            </Label>
                                            <span><i className="rupee sign icon">{cart.item.discount_price}</i></span>
                                        </Fragment>
                                    ) : (
                                        <Label color="red" ribbon>
                                            NO DISCOUNT
                                        </Label>
                                    )}
                                    {cart.ordered === false ? (
                                        <Icon
                                            name="trash"
                                            color="red"
                                            style={{ float: "right", cursor: "pointer" }}
                                            onClick={() => ConfirmPopup(cart.id)}
                                        />
                                    ) : (
                                        <>
                                            <Icon
                                                name="check circle outline"
                                                color="green"
                                                style={{ float: "right", cursor: "pointer" }}
                                            />
                                            <Icon
                                                name="trash"
                                                color="red"
                                                style={{ float: "right", cursor: "pointer" }}
                                                onClick={() => ConfirmPopup(cart.id)}
                                            />
                                        </>
                                    )}
                                    <Link to={`/home/product-detail/${cart.item.id}`}>
                                        <Icon
                                            name="eye"
                                            style={{ float: "right", cursor: "pointer" }}
                                        />
                                    </Link>
                                </Table.Cell>
                            </Table.Row>
                        </Fragment>
                    )) : (
                        <Table.Row>
                            <Table.Cell colSpan={8} textAlign="center">
                                <h3>No Order Summary!</h3>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {data && (
                        <Table.Row>
                            <Table.Cell colSpan={6} />
                            <Table.Cell textAlign="right" colSpan="2">
                                Order Total: {getTotalPrice(data)}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan={9}>
                            {checkPaymentAvailability > 0 ? (
                                <Button floated="right" color="yellow" as={Link} to="/home/checkout">
                                    Checkout
                                </Button>
                            ) : (
                                <Button as={Link} to='/home/profile' floated="right" color="green">
                                    Check your profile
                                </Button>
                            )}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </>
    );
};

OrderList.propTypes = {
    cartsdata: PropTypes.object.isRequired,
    fetchCarts: PropTypes.func.isRequired,
    removCartItem: PropTypes.func.isRequired,
    AddRemoveItemQuantity: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    cartsdata: state.all_carts,
});

export default connect(mapStateToProps, {
    removCartItem,
    AddRemoveItemQuantity,
    fetchCarts
})(OrderList);
