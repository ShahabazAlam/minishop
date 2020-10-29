import React, { Component } from 'react';
import {
    Container,
    Responsive,
    Header
} from "semantic-ui-react";

class About extends Component {
    render() {
        return (
            <>
                <Container>
                    <Header>
                        <h1 style={{ textAlign: 'center' }}>About Us</h1>
                    </Header>
                </Container>
            </>
        )
    }
}

export default About;