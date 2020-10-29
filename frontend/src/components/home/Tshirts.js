import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getTshirts } from '../../actions/Actions';
import { connect } from 'react-redux';
import { Button, Icon, Image, Item, Label, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'


class Tshirts extends Component {

    componentDidMount() {
        this.props.getTshirts();
    }

    static propTypes = {
        tshirts: PropTypes.array.isRequired,
    }

    TitleCase = (str) => {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    }
    render() {
        return (
            <>

                {this.props.tshirts.length > 0 &&
                    <Header as='h3' block>
                        <center><b>T-Shirts</b></center>
                    </Header>
                }
                <Item.Group divided>
                    {this.props.tshirts.map(tshirt => (
                        <Item key={tshirt.id}>
                            <Item.Image src={tshirt.image} />

                            <Item.Content>
                                <Item.Header as='a'>{this.TitleCase(tshirt.title)}</Item.Header>
                                <Item.Description>{tshirt.description}</Item.Description>
                                <Item.Extra>
                                    <Label><i className="rupee sign icon"></i>{tshirt.price}</Label>
                                    <Item.Group style={{ float: 'right' }}>
                                        <Link to={`/home/product-detail/${tshirt.id}`} className='ui button yellow small text-dark'
                                        ><i className="eye icon"></i>
                                        View
                                        </Link>
                                    </Item.Group>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))}
                </Item.Group>

            </>
        );
    };
};

const mapStateToProps = paints => ({
    tshirts: Object.values(paints.all_tshirts)
});


export default connect(
    mapStateToProps,
    { getTshirts } // added deleteTodo
)(Tshirts);