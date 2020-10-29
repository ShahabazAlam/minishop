import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { getPants } from '../../actions/Actions';
import { connect } from 'react-redux';
import { Button, Icon, Image, Item, Label, Header } from 'semantic-ui-react';
import { addToCart } from '../../actions/cartActions';
import PropTypes from 'prop-types';


class Pants extends Component {

    componentDidMount() {
        this.props.getPants();
    }

    static propTypes = {
        pants: PropTypes.array.isRequired,
    }

    TitleCase = (str) => {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    }

    render() {
        return (
            <>
                {this.props.pants.length > 0 &&
                    <Header as='h3' block>
                        <center><b>Pants</b></center>
                    </Header>
                }
                <Item.Group divided style={{ marginBottom: '100px' }}>
                    {this.props.pants.map(pant => (
                        <Item key={pant.id}>
                            <Item.Image src={pant.image} />


                            <Item.Content>
                                <Item.Header as='a'>{this.TitleCase(pant.title)}</Item.Header>
                                <Item.Description>{pant.description}</Item.Description>
                                <Item.Extra>
                                    <Item.Extra>
                                        <Label><i className="rupee sign icon"></i>{pant.price}</Label>
                                        <Item.Group style={{ float: 'right' }}>
                                            <Link to={`/home/product-detail/${pant.id}`} className='ui button yellow small text-dark'
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

const mapStateToProps = pants => ({
    pants: Object.values(pants.all_pants)
});


export default connect(
    mapStateToProps,
    { getPants, addToCart } // added deleteTodo
)(Pants);