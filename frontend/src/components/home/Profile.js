import React, { Component, Fragment } from 'react';
import axios from 'axios';
import {
    saveAddress, fetchAddresses,
    deleteAddresses, makeDefaultAddresses
} from '../../actions/Address';
import {
    Grid, Image, Container, Header,
    Menu, Divider, Form, Message,
    Selects, Select, Card, Label,
    Button, Segment, Loader, Dimmer,
    Table,
    Icon
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { confirmAlert } from 'react-confirm-alert'; // Import

const authAxios = axios.create({
    headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
    }
})

class AddressForm extends Component {
    state = {
        countries: [],
        formData: {
            address_type: "",
            apartment_address: "",
            country: "",
            default: false,
            street_address: "",
            user: "",
            zip: ""
        },
    }

    componentDidMount() {
        this.handlFetchCountries()
    }
    handleToggleDefault = () => {
        const { formData } = this.state;
        const updatedFormdata = {
            ...formData,
            default: !formData.default
        };
        this.setState({
            formData: updatedFormdata
        });
    }

    handleChange = (e, { name, value }) => {
        const { formData } = this.state;
        const updatedFormdata = {
            ...formData,
            [name]: value
        };
        this.setState({ formData: updatedFormdata })
    }

    handleFormatCountries = countries => {
        const keys = Object.keys(countries);
        return keys.map(k => {
            return {
                key: k,
                text: countries[k],
                value: k
            };
        });
    };


    handleSelectChange = (e, { name, value }) => {
        const { formData } = this.state;
        const updatedFormdata = {
            ...formData,
            [name]: value
        };
        this.setState({
            formData: updatedFormdata
        });
    };


    handlFetchCountries = () => {
        axios.get(`/fetch-countries/`).then(res => {
            this.setState({ countries: this.handleFormatCountries(res.data) })
        })
    }


    handleSave = e => {
        e.preventDefault()
        const { userID, activeItem, saveAddress } = this.props;
        const { formData } = this.state;
        const updatedFormdata = {
            ...formData,
            user: userID,
            address_type: activeItem === 'Billing Address' ? 'B' : 'S'
        }
        saveAddress(updatedFormdata).then(
            res => {
                if (res === 'success') {
                    this.props.fetchAddresses(activeItem === 'Billing Address' ? 'B' : 'S')
                    this.setState({
                        formData: {
                            address_type: "",
                            apartment_address: "",
                            country: "",
                            default: false,
                            street_address: "",
                            user: "",
                            zip: ""
                        }
                    })
                }
            }
        )

    }


    render() {
        const { formData, countries } = this.state;
        const { saving } = (this.props)
        return (
            <Form onSubmit={this.handleSave}>
                <Form.Input
                    required
                    name="street_address"
                    placeholder="Street address"
                    onChange={this.handleChange}
                    value={formData.street_address}
                />
                <Form.Input
                    required
                    name="apartment_address"
                    placeholder="Apartment address"
                    onChange={this.handleChange}
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
                        options={countries}
                        value={formData.country}
                        onChange={this.handleSelectChange}
                    />

                </Form.Field>
                <Form.Input
                    required
                    name="zip"
                    placeholder="Zip code"
                    onChange={this.handleChange}
                    value={formData.zip}
                />
                <Form.Checkbox
                    name="default"
                    label="Make this the default address?"
                    onChange={this.handleToggleDefault}
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
        )
    }
}


class PaymentHistory extends Component {
    state = {
        payments: [],
        loading: false,
        deleting_button_id: null,
        error: null,
        deleting: false,
        success: false,

    };

    componentDidMount() {
        this.handleFetchPayments();
    }

    handleFetchPayments = () => {
        this.setState({ loading: true });
        authAxios
            .get('/fetch-payments/')
            .then(res => {
                this.setState({
                    loading: false,
                    payments: res.data
                });
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            });
    };

    ConfirmPopup = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.setState({ deleting: true, deleting_button_id: id });
                        const { payment } = this.state;
                        authAxios.delete(`/delete-payment/${id}`)
                            .then(res => {
                                this.setState({ deleting: false, deleting_button_id: null, success: true });
                                this.handleFetchPayments()
                            })
                            .catch(err => {
                                this.setState({ error: err, loading: false, deleting_button_id: null });
                            });
                    }
                },
                {
                    label: 'No',
                }
            ]
        })
    }

    render() {
        const { payments } = this.state;
        const { deleting_button_id, success, loading, error } = this.state;
        return (
            <Fragment>
                {success &&
                    <Message positive>
                        <Message.Header>Success</Message.Header>
                        <p>
                            Deleted Successefully
                        </p>
                    </Message>}
                {error &&
                    <Message positive>
                        <Message.Header>Something went wrong</Message.Header>
                        <p>
                            {error}
                        </p>
                    </Message>}
                { loading &&
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
                        {payments.map(p => {
                            return (
                                <Table.Row key={p.id}>
                                    <Table.Cell>{p.id}</Table.Cell>
                                    <Table.Cell><Icon name='rupee' />{p.amount}</Table.Cell>
                                    <Table.Cell>{new Date(p.timestamp).toUTCString()}</Table.Cell>
                                    <Table.Cell>
                                        {deleting_button_id == p.id && loading ?
                                            <i
                                                className="fa fa-refresh fa-spin"
                                                style={{ marginRight: "5px" }}
                                            />
                                            : <Icon
                                                name="trash"
                                                color="red"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => this.ConfirmPopup(p.id)} />
                                        }

                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Fragment>
        );
    }
}

class Profile extends Component {
    state = {
        activeItem: 'Billing Address',
        addresses: [],
        countries: [],
        userID: null,
        activeId: null,

    }
    componentDidMount() {
        this.props.fetchAddresses(this.state.activeItem === 'Billing Address' ? 'B' : 'S')
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
        address: PropTypes.object.isRequired
    }


    handleDeleteAddress(id) {
        this.setState({ activeId: id })
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.props.deleteAddresses(id)
                },
                {
                    label: 'No',
                }
            ]
        })

    }

    handleMakeDefault = (id, address_type) => {
        this.setState({ activeId: id })
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.props.makeDefaultAddresses(id, address_type).then(
                        res => {
                            (res === 'success')
                            {
                                this.props.fetchAddresses(this.state.activeItem === 'Billing Address' ? 'B' : 'S')
                            }
                        }
                    )
                },
                {
                    label: 'No',
                }
            ]
        })

    };

    handleGetActiveItem = () => {
        const { activeItem } = this.state;
        if (activeItem === "Billing Address") {
            return "Billing Address";
        } else if (activeItem === "Shipping Address") {
            return "Shipping Address";
        }
        return "Payment History";
    };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name },
        () => this.props.fetchAddresses(this.state.activeItem === 'Billing Address' ? 'B' : 'S'))

    render() {
        const { user } = this.props.auth;
        const { activeItem } = this.state;
        const { addresses, deleting, error, updating, fetching, saving, success } = this.props.address
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
                                        name='Billing Address'
                                        active={activeItem === 'Billing Address'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Shipping Address'
                                        active={activeItem === 'Shipping Address'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Payment History'
                                        active={activeItem === 'Payment History'}
                                        onClick={this.handleItemClick}
                                    />
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header>{this.handleGetActiveItem()}</Header>
                                <Divider />
                                {activeItem == 'Payment History' ?
                                    <PaymentHistory />
                                    : <AddressForm
                                        saveAddress={this.props.saveAddress}
                                        activeItem={activeItem}
                                        userID={user && user.id}
                                        fetchAddresses={this.props.fetchAddresses}
                                        saving={saving}
                                        success={success}
                                    />}
                            </Grid.Column>
                            <Grid.Column width={5} style={{ height: '425px', overflowY: 'hidden', overflow: 'auto' }}>
                                <Fragment>
                                    <Header>Your Addresses</Header>
                                    <Divider />
                                    {fetching ?
                                        <Loader active inline='centered'>Loading</Loader>
                                        :
                                        addresses.length > 0 ?
                                            addresses.map(a => {
                                                return (
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
                                                            {a.default !== true &&
                                                                <Button
                                                                    color="green"
                                                                    onClick={() => this.handleMakeDefault(a.id, a.address_type)}
                                                                    size='mini'
                                                                >
                                                                    {this.state.activeId === a.id && updating ?
                                                                        <i
                                                                            className="fa fa-refresh fa-spin"
                                                                            style={{ marginRight: "5px" }}
                                                                        /> : 'Default'}
                                                                </Button>
                                                            }
                                                            <Button
                                                                color="red"
                                                                onClick={this.handleDeleteAddress.bind(this, a.id)}
                                                                size='mini'
                                                            >
                                                                {this.state.activeId === a.id && deleting ?
                                                                    <i
                                                                        className="fa fa-refresh fa-spin"
                                                                        style={{ marginRight: "5px" }}
                                                                    /> : 'Delete'}
                                                            </Button>
                                                        </Card.Content>
                                                    </Card>
                                                );
                                            }) :
                                            <Segment>
                                                <strong >No Address Available</strong>
                                            </Segment>
                                    }
                                </Fragment>
                            </Grid.Column>
                        </Grid>
                    </Fragment>
                </Container>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    address: state.address,
})

export default connect(mapStateToProps, {
    saveAddress, fetchAddresses, deleteAddresses, makeDefaultAddresses
})(Profile)