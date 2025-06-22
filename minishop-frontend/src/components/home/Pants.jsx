import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPants } from '../../actions/Actions';
import { addToCart } from '../../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Image, Item, Label, Header } from 'semantic-ui-react';

const Pants = () => {
    const dispatch = useDispatch();
    const pants = useSelector(state => Object.values(state.all_pants || {}));

    useEffect(() => {
        dispatch(getPants());
    }, [dispatch]);

    const titleCase = (str) => {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    };

    return (
        <>
            {pants.length > 0 &&
                <Header as='h3' block>
                    <center><b>Pants</b></center>
                </Header>
            }

            <Item.Group divided style={{ marginBottom: '100px' }}>
                {pants.map(pant => (
                    <Item key={pant.id}>
                        <Item.Image src={pant.image} />

                        <Item.Content>
                            <Item.Header as='a'>{titleCase(pant.title)}</Item.Header>
                            <Item.Description>{pant.description}</Item.Description>
                            <Item.Extra>
                                <Label><i className="rupee sign icon"></i>{pant.price}</Label>
                                <Item.Group style={{ float: 'right' }}>
                                    <Link to={`/home/product-detail/${pant.id}`} className='ui button yellow small text-dark'>
                                        <i className="eye icon"></i> View
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

export default Pants;
