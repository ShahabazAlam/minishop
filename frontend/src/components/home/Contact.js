import React, { Component, Fragment } from 'react';
import {
    Container,
    Form,
    Responsive,
    Segment,
    Input,
    TextArea,
    Button,
    Grid,
    Image,
    Header,
    Divider,
    Card,
    Icon

} from "semantic-ui-react";

class Contact extends Component {
    render() {
        return (
            <Fragment>
                <Container>
                    <Header><h2 style={{ textAlign: 'center' }}>Contact Us</h2></Header>
                    <div style={{
                        margin: 'auto', width: '60%', padding: '10px'
                    }}>
                        <Segment>
                            <Header>How may I help you?</Header>
                            <Form>
                                <Form.Field
                                    control={Input}
                                    label='Your Name'
                                    placeholder='Your Name'
                                />
                                <Form.Field
                                    control={Input}
                                    label='Email'
                                    placeholder='Enter Your Email'
                                />
                                <Form.Field
                                    control={TextArea}
                                    label='About'
                                    placeholder='Tell us something about you...'
                                />
                                <Form.Field control={Button}>Submit</Form.Field>
                            </Form>
                        </Segment>
                    </div>
                    <Divider />
                    <Grid divided='vertically'>
                        <Grid.Row columns={3}>
                            <Grid.Column>
                                <Card>
                                    <Card.Content header='Email & Website' />
                                    <Card.Content>
                                        <Icon name='mail' />abcd@gmaiil.com<br />
                                        <Icon name='weibo' />abcdefgh.com
                                        </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column>
                                <Card>
                                    <Card.Content header='Contact' />
                                    <Card.Content>
                                        <Icon name='phone' />+91 (123) 456 789 0<br />
                                        <Icon name='phone' />+91 (123) 456 789 0
                                        </Card.Content>

                                </Card>
                            </Grid.Column>
                            <Grid.Column>
                                <Card>
                                    <Card.Content header='Address' />
                                    <Card.Content>
                                        <Icon name='location arrow' />xxxxxxxxxxx<br />
                                        <Icon name='location arrow' />xxxxxxxxxxx
                                        </Card.Content>
                                </Card>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Fragment>
        )
    }
}

export default Contact;