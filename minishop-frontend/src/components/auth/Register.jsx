import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Message,
  Icon
} from 'semantic-ui-react';
import { signup } from '../../actions/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const errMsg = useSelector(state => state.auth.errorMessage);

  const { isAuthenticated, isLoading } = auth;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password1: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errMsg) {
      if (errMsg.username) {
        setErrorMessage(errMsg.username[0]);
      } else if (errMsg.email) {
        setErrorMessage(errMsg.email[0]);
      }
    }
  }, [errMsg]);

  const { username, email, password, password1 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password1) {
      setErrorMessage('Password did not match!');
    } else {
      setErrorMessage('');
      dispatch(signup(username, email, password));
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/home/" replace />;
  }

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="user" /> Sign Up
        </Header>
        <Form size="large" onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="E-mail address"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Confirm Password"
              type="password"
              name="password1"
              value={password1}
              onChange={onChange}
              required
            />

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <Button color="teal" fluid size="large" disabled={isLoading}>
              {isLoading ? (
                <i className="fa fa-refresh fa-spin" style={{ marginRight: '5px' }} />
              ) : (
                'Sign Up'
              )}
            </Button>
          </Segment>
        </Form>
        <Message>
          Already a user? <Link to="/home/login">Log In</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
