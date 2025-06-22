import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
    saveAddress, fetchAddresses,
    deleteAddresses, makeDefaultAddresses
} from '../../actions/Address';
import {
    Grid, Image, Container, Header,
    Menu, Divider, Form, Message,
    Select, Card, Label,
    Button, Segment, Loader, Dimmer,
    Table,
    Icon
} from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate, Routes, Route, NavLink } from 'react-router-dom';

const authAxios = axios.create({
    headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
    }
})

const AddressForm = ({ activeItem, saving, success }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({
        address_type: "",
        apartment_address: "",
        country: "",
        default: false,
        street_address: "",
        user: user?.id || "",
        zip: ""
    });

    useEffect(() => {
        handleFetchCountries();
    }, []);

    const handleToggleDefault = () => {
        setFormData(prev => ({
            ...prev,
            default: !prev.default
        }));
    };

    const handleChange = (e, { name, value }) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormatCountries = (countries) => {
        const keys = Object.keys(countries);
        return keys.map(k => {
            return {
                key: k,
                text: countries[k],
                value: k
            };
        });
    };

    const handleSelectChange = (e, { name, value }) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFetchCountries = () => {
        axios.get(`/fetch-countries/`).then(res => {
            setCountries(handleFormatCountries(res.data));
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const addressType = activeItem === 'Billing Address' ? 'B' : 'S';
        const updatedFormData = {
            ...formData,
            user: user.id,
            address_type: addressType
        };
        
        dispatch(saveAddress(updatedFormData)).then(res => {
            if (res === 'success') {
                dispatch(fetchAddresses(addressType));
                setFormData({
                    address_type: "",
                    apartment_address: "",
                    country: "",
                    default: false,
                    street_address: "",
                    user: user.id,
                    zip: ""
                });
            }
        });
    };

    return (
        <Form onSubmit={handleSave}>
            <Form.Input
                required
                name="street_address"
                placeholder="Street address"
                onChange={handleChange}
                value={formData.street_address}
            />
            <Form.Input
                required
                name="apartment_address"
                placeholder="Apartment address"
                onChange={handleChange}
                value={formData.apartment_address}
            />
            <Form.Field required>
                <Select
                    fluid
                    clearable
                    search
                    required
                    options={countries}
                    name="country"
                    placeholder="Select Country"
                    value={formData.country}
                    onChange={handleSelectChange}
                />
            </Form.Field>
            <Form.Input
                required
                name="zip"
                placeholder="Zip code"
                onChange={handleChange}
                value={formData.zip}
            />
            <Form.Checkbox
                name="default"
                label="Make this the default address?"
                onChange={handleToggleDefault}
                checked={formData.default}
            />
            <Form.Button primary>
                {saving ?
                    <i
                        className="fa fa-refresh fa-spin"
                        style={{ marginRight: "5px" }}
                    /> : 'Save'}
            </Form.Button>
        </Form>
    );
};

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingButtonId, setDeletingButtonId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        handleFetchPayments();
    }, []);

    const handleFetchPayments = () => {
        setLoading(true);
        authAxios
            .get('/fetch-payments/')
            .then(res => {
                setLoading(false);
                setPayments(res.data);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    const confirmPopup = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setDeletingButtonId(id);
                        authAxios.delete(`/delete-payment/${id}`)
                            .then(res => {
                                setDeletingButtonId(null);
                                setSuccess(true);
                                handleFetchPayments();
                            })
                            .catch(err => {
                                setError(err);
                                setDeletingButtonId(null);
                            });
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    return (
        <Fragment>
            {success &&
                <Message positive>
                    <Message.Header>Success</Message.Header>
                    <p>Deleted Successfully</p>
                </Message>}
            {error &&
                <Message negative>
                    <Message.Header>Something went wrong</Message.Header>
                    <p>{error.message}</p>
                </Message>}
            {loading &&
                <Segment>
                    <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>
                    <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
                </Segment>
            }

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {payments.map(p => (
                        <Table.Row key={p.id}>
                            <Table.Cell>{p.id}</Table.Cell>
                            <Table.Cell><Icon name='rupee' />{p.amount}</Table.Cell>
                            <Table.Cell>{new Date(p.timestamp).toUTCString()}</Table.Cell>
                            <Table.Cell>
                                {deletingButtonId === p.id && loading ?
                                    <i className="fa fa-refresh fa-spin" style={{ marginRight: "5px" }} />
                                    : <Icon
                                        name="trash"
                                        color="red"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => confirmPopup(p.id)} />
                                }
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Fragment>
    );
};

const AddressList = ({ activeItem, activeId, setActiveId }) => {
    const dispatch = useDispatch();
    const { addresses, deleting, updating, fetching } = useSelector(state => state.address);
    const addressType = activeItem === 'Billing Address' ? 'B' : 'S';

    useEffect(() => {
        dispatch(fetchAddresses(addressType));
    }, [activeItem, dispatch]);

    const handleDeleteAddress = (id) => {
        setActiveId(id);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => dispatch(deleteAddresses(id))
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const handleMakeDefault = (id) => {
        setActiveId(id);
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => dispatch(makeDefaultAddresses(id, addressType)).then(
                        res => {
                            if (res === 'success') {
                                dispatch(fetchAddresses(addressType));
                            }
                        }
                    )
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    return (
        <Fragment>
            <Header>Your Addresses</Header>
            <Divider />
            {fetching ?
                <Loader active inline='centered'>Loading</Loader>
                :
                addresses.length > 0 ?
                    addresses.map(a => (
                        <Card key={a.id}>
                            <Card.Content>
                                {a.default && (
                                    <Label as="a" size='mini' color="blue" ribbon="right">
                                        Default
                                    </Label>
                                )}
                                <Card.Header>
                                    {a.street_address}, {a.apartment_address}
                                </Card.Header>
                                <Card.Meta>{a.country.name}</Card.Meta>
                                <Card.Description>{a.zip}</Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                {!a.default &&
                                    <Button
                                        color="green"
                                        onClick={() => handleMakeDefault(a.id)}
                                        size='mini'
                                    >
                                        {activeId === a.id && updating ?
                                            <i className="fa fa-refresh fa-spin" style={{ marginRight: "5px" }} /> 
                                            : 'Default'}
                                    </Button>
                                }
                                <Button
                                    color="red"
                                    onClick={() => handleDeleteAddress(a.id)}
                                    size='mini'
                                >
                                    {activeId === a.id && deleting ?
                                        <i className="fa fa-refresh fa-spin" style={{ marginRight: "5px" }} /> 
                                        : 'Delete'}
                                </Button>
                            </Card.Content>
                        </Card>
                    ))
                    :
                    <Segment>
                        <strong>No Address Available</strong>
                    </Segment>
            }
        </Fragment>
    );
};

const Profile = () => {
    const [activeItem, setActiveItem] = useState('Billing Address');
    const [activeId, setActiveId] = useState(null);
    const { user } = useSelector(state => state.auth);
    const { error, fetching, saving, success } = useSelector(state => state.address);
    const navigate = useNavigate();

    const handleItemClick = (name) => {
        setActiveItem(name);
        navigate(`/profile/${name.toLowerCase().replace(' ', '-')}`);
    };

    const getActiveItem = () => {
        if (activeItem === "Billing Address") {
            return "Billing Address";
        } else if (activeItem === "Shipping Address") {
            return "Shipping Address";
        }
        return "Payment History";
    };

    return (
        <Fragment>
            <Container style={{ marginTop: '50px' }}>
                {error && (
                    <Message
                        error
                        header="There was some errors with your submission"
                        content={error}
                    />
                )}
                {fetching && (
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>
                        <Image src="/images/wireframe/short-paragraph.png" />
                    </Segment>
                )}
                <Fragment>
                    <Segment inverted><h2 style={{ textAlign: 'center' }}>DASHBOARD</h2></Segment>
                    <Grid>
                        <Grid.Column width={4}>
                            <Menu pointing vertical fluid>
                                <Menu.Item
                                    as={NavLink}
                                    to="/profile/billing-address"
                                    name='Billing Address'
                                    active={activeItem === 'Billing Address'}
                                    onClick={() => handleItemClick('Billing Address')}
                                />
                                <Menu.Item
                                    as={NavLink}
                                    to="/profile/shipping-address"
                                    name='Shipping Address'
                                    active={activeItem === 'Shipping Address'}
                                    onClick={() => handleItemClick('Shipping Address')}
                                />
                                <Menu.Item
                                    as={NavLink}
                                    to="/profile/payment-history"
                                    name='Payment History'
                                    active={activeItem === 'Payment History'}
                                    onClick={() => handleItemClick('Payment History')}
                                />
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={7}>
                            <Header>{getActiveItem()}</Header>
                            <Divider />
                            <Routes>
                                <Route path="billing-address" element={
                                    <AddressForm 
                                        activeItem="Billing Address" 
                                        saving={saving} 
                                        success={success} 
                                    />
                                } />
                                <Route path="shipping-address" element={
                                    <AddressForm 
                                        activeItem="Shipping Address" 
                                        saving={saving} 
                                        success={success} 
                                    />
                                } />
                                <Route path="payment-history" element={<PaymentHistory />} />
                            </Routes>
                        </Grid.Column>
                        <Grid.Column width={5} style={{ height: '425px', overflowY: 'auto' }}>
                            {activeItem !== 'Payment History' && (
                                <AddressList 
                                    activeItem={activeItem} 
                                    activeId={activeId} 
                                    setActiveId={setActiveId} 
                                />
                            )}
                        </Grid.Column>
                    </Grid>
                </Fragment>
            </Container>
        </Fragment>
    );
};

export default Profile;