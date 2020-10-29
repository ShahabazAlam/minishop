import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getShirts } from '../../actions/Actions';
import { connect } from 'react-redux';
import { Button, Icon, Image, Item, Label, Header, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

class Shirts extends Component {

    componentDidMount() {
        this.props.getShirts();
    }

    static propTypes = {
        shirts: PropTypes.array.isRequired,
    }

    TitleCase = (str) => {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    }
    render() {
        return (
            <>
                {this.props.shirts.length > 0 &&
                    <Header as='h3' block >
                        <center><b>Shirts</b></center>
                    </Header>
                }
                <Item.Group divided>
                    {this.props.shirts.map(shirt => (
                        <Item key={shirt.id}>
                            <Item.Image src={shirt.image} />

                            <Item.Content>
                                <Item.Header as='a'>{this.TitleCase(shirt.title)}</Item.Header>
                                <Item.Description>{shirt.description}</Item.Description>
                                <Item.Extra>
                                    <Item.Extra>
                                        <Label><i className="rupee sign icon"></i>{shirt.price}</Label>
                                        <Item.Group style={{ float: 'right' }}>
                                            <Link to={`/home/product-detail/${shirt.id}`} className='ui button yellow small text-dark'
                                            ><i className="eye icon"></i>
                                        View
                                        </Link>
                                        </Item.Group>
                                    </Item.Extra>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))}
                </Item.Group>

            </>
        );
    };
};

const mapStateToProps = shirts => ({
    shirts: Object.values(shirts.all_shirts)
});


export default connect(
    mapStateToProps,
    { getShirts } // added deleteTodo
)(Shirts);