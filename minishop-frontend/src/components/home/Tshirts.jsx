import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTshirts } from '../../actions/Actions';
import { Header, Item, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Tshirts = () => {
    const dispatch = useDispatch();
    const tshirts = useSelector(state => Object.values(state.all_tshirts || {}));

    useEffect(() => {
        dispatch(getTshirts());
    }, [dispatch]);

    const titleCase = (str) => {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    };

    return (
        <>
            {tshirts.length > 0 &&
                <Header as='h3' block>
                    <center><b>T-Shirts</b></center>
                </Header>
            }

            <Item.Group divided>
                {tshirts.map(tshirt => (
                    <Item key={tshirt.id}>
                        <Item.Image src={tshirt.image} />

                        <Item.Content>
                            <Item.Header as='a'>{titleCase(tshirt.title)}</Item.Header>
                            <Item.Description>{tshirt.description}</Item.Description>
                            <Item.Extra>
                                <Label><i className="rupee sign icon"></i>{tshirt.price}</Label>
                                <Item.Group style={{ float: 'right' }}>
                                    <Link
                                        to={`/home/product-detail/${tshirt.id}`}
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

export default Tshirts;
