import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon, Dimmer, Loader } from 'semantic-ui-react'
import { login } from '../../actions/Auth'
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        };
    };

    static propType = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        errMsg: PropTypes.object,

    }

    resetLoginForm = () => {
        this.state.username = '';
        this.state.password = '';
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.login(this.state.username, this.state.password)
    };

    onChange = e => this.setState(
        { [e.target.name]: e.target.value }
    );
    render() {

        const { username, password } = this.state;
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
                                    fluid icon='user'
                                    iconPosition='left'
                                    placeholder='Username'
                                    name='username'
                                    onChange={this.onChange}
                                    value={username}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                    name='password'
                                    onChange={this.onChange}
                                    value={password}
                                />
                                {this.props.errMsg &&
                                    <div className="alert alert-danger" role="alert">
                                        {this.props.errMsg.non_field_errors.join()}
                                    </div>}
                                <Button color='teal' fluid size='large' disabled={isLoading}>
                                    {isLoading ? (
                                        <i
                                            className="fa fa-refresh fa-spin"
                                            style={{ marginRight: "5px" }}
                                        />
                                    ) : 'Login'}
                                </Button>
                            </Segment>
                        </Form>
                        <Message>
                            New to us? <Link to='/home/register'>Sign Up</Link>
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
    { login }
)(LoginForm);