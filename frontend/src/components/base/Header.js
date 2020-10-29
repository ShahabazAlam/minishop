import _ from "lodash";
import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import {
    Container,
    Icon,
    Image,
    Menu,
    Dropdown,
    Segment,
    Divider
} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { ToastNotification } from './Notification';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            quantity: 0,
        };
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    toggle() {
        const currentState = this.state.visible;
        this.setState({ visible: !currentState });
        this.props.cartsdata.message = null;
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        cartsdata: PropTypes.object.isRequired,
    }



    render() {
        const { visible } = this.state;
        const { isAuthenticated, user } = this.props.auth;
        const { data, message } = this.props.cartsdata;

        const AuthorizedLink = (
            <Fragment>
                <Menu.Menu position='right'>
                    {/* Cart Dropdown */}
                    <Dropdown
                        item
                        text={`(${data.length > 0 ? (data.length) : ''})`}
                        icon='cart'>
                        <Dropdown.Menu>
                            {data.length > 0 ?
                                data.map(cart => (
                                    <Fragment key={cart.id}>
                                        <Dropdown.Item>
                                            <img src={cart.item.image} height='40px' width='40px' className='rounded' />
                                            <span className='font-weight-bold'> {cart.item.title}</span>
                                            <span className='pull-right' style={{ paddingTop: '10px' }}>
                                                <b>Category:</b>
                                                {cart.item.category}
                                            </span>
                                            <br />
                                        </Dropdown.Item>
                                        <hr />
                                    </Fragment>
                                ))

                                : <Dropdown.Item>No items in your cart</Dropdown.Item>
                            }
                            <Divider />
                            <Dropdown.Item as={Link} to='/home/order-list' style={{ width: '250px' }}><center><i className="fa fa-sign-out fa-fw"></i>Check Out</center> </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Menu.Item name='Profile' position='right'
                        as={Link} to='/home/profile/'>
                    </Menu.Item>

                    <Dropdown item text={user && user.username} icon='user'>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.props.logout} >LogOut</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Fragment >
        );


        const UnAuthorizedLink = (
            <Menu.Item as={Link} to='/home/login'
                variant="outline-primary"
                position='right'
                name='LogIn' />
        )

        return (
            <Segment inverted style={{ textAlign: 'center', position: 'fixed', width: '100%', background: 'black', top: 0, zIndex: 20 }}>
                <Menu size='large' inverted pointing secondary >
                    <Menu.Item><strong>Mini-Shop</strong></Menu.Item>
                    <Menu.Item
                        name='Home'
                        as={Link}
                        to='/home/'
                    />
                    <Menu.Item
                        name='About Us'
                        as={Link}
                        to='/home/about/'
                    />
                    <Menu.Item
                        name='Contact Us'
                        as={Link}
                        to='/home/contact/'
                    />

                    {isAuthenticated ? AuthorizedLink : UnAuthorizedLink}
                </Menu>
                { message && ToastNotification(visible, this.toggle.bind(this), message)}
            </Segment>
        );
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    cartsdata: state.all_carts
})
export default connect(mapStateToProps, { logout })(Header);