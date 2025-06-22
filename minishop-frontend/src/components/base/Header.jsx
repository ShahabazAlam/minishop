import React, { useState, Fragment, useEffect } from 'react';
import {
  Segment,
  Menu,
  Dropdown,
  Divider
} from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/Auth';
import { ToastNotification } from './Notification';

const Header = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigation

  const auth = useSelector(state => state.auth);
  const cartsdata = useSelector(state => state.all_carts);

  const { isAuthenticated, user } = auth;
  const { data, message } = cartsdata;

  const toggle = () => {
    setVisible(prev => !prev);
    cartsdata.message = null; // You may want to clear it via Redux action
  };

  // 🔐 Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/home/login');
    }
  }, [isAuthenticated, navigate]);

  const AuthorizedLink = (
    <Fragment>
      <Menu.Menu position="right">
        <Dropdown item text={`(${data?.length > 0 ? data?.length : ''})`} icon="cart">
          <Dropdown.Menu>
            {data?.length > 0 ? (
              data.map(cart => (
                <Fragment key={cart.id}>
                  <Dropdown.Item>
                    <img
                      src={cart.item.image}
                      height="40px"
                      width="40px"
                      className="rounded"
                      alt="item"
                    />
                    <span className="font-weight-bold"> {cart.item.title}</span>
                    <span className="pull-right" style={{ paddingTop: '10px' }}>
                      <b>Category:</b> {cart.item.category}
                    </span>
                    <br />
                  </Dropdown.Item>
                  <hr />
                </Fragment>
              ))
            ) : (
              <Dropdown.Item>No items in your cart</Dropdown.Item>
            )}
            <Divider />
            <Dropdown.Item as={Link} to="/home/order-list" style={{ width: '250px' }}>
              <center>
                <i className="fa fa-sign-out fa-fw"></i>Check Out
              </center>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Item name="Profile" position="right" as={Link} to="/home/profile/" />

        <Dropdown item text={user && user.username} icon="user">
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => dispatch(logout())}>LogOut</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Fragment>
  );

  const UnAuthorizedLink = (
    <Menu.Item as={Link} to="/home/login" variant="outline-primary" position="right" name="LogIn" />
  );

  return (
    <Segment
      inverted
      style={{
        textAlign: 'center',
        position: 'fixed',
        width: '100%',
        background: 'black',
        top: 0,
        zIndex: 20
      }}
    >
      <Menu size="large" inverted pointing secondary>
        <Menu.Item>
          <strong>Mini-Shop</strong>
        </Menu.Item>
        {isAuthenticated ? <Menu.Item name="Home" as={Link} to="/home/" /> : ""}
        <Menu.Item name="About Us" as={Link} to="/home/about/" />
        <Menu.Item name="Contact Us" as={Link} to="/home/contact/" />

        {isAuthenticated ? AuthorizedLink : UnAuthorizedLink}
      </Menu>

      {message && ToastNotification(visible, toggle, message)}
    </Segment>
  );
};

export default Header;
