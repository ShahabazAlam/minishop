import React from 'react';
import {
    Container,
    Form,
    Segment,
    Input,
    TextArea,
    Button,
    Grid,
    Header,
    Divider,
    Card,
    Icon
} from "semantic-ui-react";

const Contact = () => {
    return (
        <Container>
            <Header as="h2" textAlign="center">Contact Us</Header>

            <div style={{ margin: 'auto', width: '60%', padding: '10px' }}>
                <Segment>
                    <Header as="h4">How may I help you?</Header>
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

            <Grid divided="vertically">
                <Grid.Row columns={3}>
                    <Grid.Column>
                        <Card>
                            <Card.Content header='Email & Website' />
                            <Card.Content>
                                <Icon name='mail' /> abcd@gmaiil.com<br />
                                <Icon name='weibo' /> abcdefgh.com
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card>
                            <Card.Content header='Contact' />
                            <Card.Content>
                                <Icon name='phone' /> +91 (123) 456 789 0<br />
                                <Icon name='phone' /> +91 (123) 456 789 0
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column>
                        <Card>
                            <Card.Content header='Address' />
                            <Card.Content>
                                <Icon name='location arrow' /> xxxxxxxxxxx<br />
                                <Icon name='location arrow' /> xxxxxxxxxxx
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default Contact;
