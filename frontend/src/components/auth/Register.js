import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon } from 'semantic-ui-react'
import { signup } from '../../actions/Auth'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            password1: ''
        }
    }

    static propType = {
        signup: PropTypes.func.isRequired,
        auth: PropTypes.object,
        errMsg: PropTypes.object,
    }
    componentDidUpdate(prevProps) {
        if (prevProps.errMsg !== this.props.errMsg) {
            if (this.props.errMsg !== undefined) {
                if (this.props.errMsg.username) {
                    this.setState({ errorMessage: this.props.errMsg.username[0] })
                }
                else if (this.props.errMsg.email !== undefined) {
                    this.setState({ errorMessage: this.props.errMsg.email[0] })
                }
            }
        }
    }

    onSubmit = e => {
        e.preventDefault();
        if (this.state.password === this.state.password1) {
            this.props.signup(this.state.username, this.state.email, this.state.password)
        } else {
            this.setState({ errorMessage: "Password did not matched!" })
        }
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })
    render() {
        const { username, email, password, password1 } = this.state;
        const { isAuthenticated, isLoading } = this.props.auth;
        if (isAuthenticated) {
            return <Redirect to='/home/' />;
        }

        return (
            <>
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            <Icon disabled name='user' />Log-in
                        </Header>
                        <Form size='large' onSubmit={this.onSubmit}>
                            <Segment stacked>
                                <Form.Input
                                    fluid
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='Username'
                                    type='text'
                                    name="username"
                                    onChange={this.onChange}
                                    value={username}
                                    required
                                />
                                <Form.Input fluid icon='mail'
                                    iconPosition='left'
                                    placeholder='E-mail address'
                                    type='email'
                                    name="email"
                                    onChange={this.onChange}
                                    value={email}
                                    required />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    name="password"
                                    onChange={this.onChange}
                                    value={password}
                                    required
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Confirm Password'
                                    type='password'
                                    name="password1"
                                    onChange={this.onChange}
                                    value={password1}
                                    required
                                />
                                {this.state.errorMessage &&
                                    <div className="alert alert-danger" role="alert">
                                        {this.state.errorMessage}
                                    </div>}

                                <Button color='teal' fluid size='large' disabled={isLoading}>
                                    {isLoading ? (
                                        <i
                                            className="fa fa-refresh fa-spin"
                                            style={{ marginRight: "5px" }}
                                        />
                                    ) : 'SignUp'}
                                </Button>
                            </Segment>
                        </Form>
                        <Message>
                            Already a user? <Link to='/home/login'>Log In</Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errMsg: state.auth.errorMessage,
});

export default connect(
    mapStateToProps,
    { signup }
)(Register);