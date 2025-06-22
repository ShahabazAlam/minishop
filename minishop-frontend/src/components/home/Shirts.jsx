import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShirts } from '../../actions/Actions';
import { Button, Icon, Image, Item, Label, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Shirts = () => {
    const dispatch = useDispatch();
    const shirts = useSelector(state => Object.values(state.all_shirts || {}));

    useEffect(() => {
        dispatch(getShirts());
    }, [dispatch]);

    const titleCase = (str) => {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    };

    return (
        <>
            {shirts.length > 0 &&
                <Header as='h3' block >
                    <center><b>Shirts</b></center>
                </Header>
            }

            <Item.Group divided>
                {shirts.map(shirt => (
                    <Item key={shirt.id}>
                        <Item.Image src={shirt.image} />

                        <Item.Content>
                            <Item.Header as='a'>{titleCase(shirt.title)}</Item.Header>
                            <Item.Description>{shirt.description}</Item.Description>
                            <Item.Extra>
                                <Label><i className="rupee sign icon"></i>{shirt.price}</Label>
                                <Item.Group style={{ float: 'right' }}>
                                    <Link
                                        to={`/home/product-detail/${shirt.id}`}
                                        className='ui button yellow small text-dark'
                                    >
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

export default Shirts;
