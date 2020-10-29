import React, { Component } from 'react';
import {
    Container,
    Responsive,
    Header
} from "semantic-ui-react";

class Footer extends Component {
    render() {
        return (
            <div class="ui inverted vertical footer segment form-page" style={{ textAlign: 'center', position: 'fixed', width: '100%', background: 'black', bottom: 0 }}>
                <div class="ui container">
                    Copyright@ 2020 All Rights Reserved
                </div>
            </div>
        )
    }
}

export default Footer;