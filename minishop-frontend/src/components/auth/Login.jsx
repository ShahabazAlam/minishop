import React, { useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Message,
  Icon
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/Auth';
import { Navigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const errMsg = useSelector(state => state.auth.errorMessage);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;
  const { isAuthenticated, isLoading } = auth;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  if (isAuthenticated) {
    return <Navigate to="/home/" replace />;
  }

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="user" /> Log-in
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
            />

            {errMsg?.non_field_errors && (
              <div className="alert alert-danger" role="alert">
                {errMsg.non_field_errors.join(', ')}
              </div>
            )}

            <Button color="teal" fluid size="large" disabled={isLoading}>
              {isLoading ? (
                <i className="fa fa-refresh fa-spin" style={{ marginRight: '5px' }} />
              ) : (
                'Login'
              )}
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <Link to="/home/register">Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
