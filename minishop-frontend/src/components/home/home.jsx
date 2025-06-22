import React from 'react';
import Shirts from './Shirts';
import Tshirts from './Tshirts';
import Pants from './Pants';
import { Container } from "semantic-ui-react";

const Home = () => {
    return (
        <Container>
            <Shirts />
            <Tshirts />
            <Pants />
        </Container>
    );
};

export default Home;
