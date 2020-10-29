import React, { Component } from 'react';
import Shirts from './Shirts';
import Tshirts from './Tshirts';
import Pants from './Pants';
import {
    Container,
    Responsive,
} from "semantic-ui-react";

class Home extends Component {
    render() {
        return (
            <>
                <Container>
                    <Shirts />
                    <Tshirts />
                    <Pants />
                </Container>
            </>
        )
    }
}

export default Home;