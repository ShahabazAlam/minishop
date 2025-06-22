// Updated ProductDetail.jsx
import React, { useEffect, useState, Fragment } from 'react';
import {
    Segment, Dimmer, Loader, Image, Card, Icon, Container,
    Button, Label, Grid, Divider, Form, Select, Header, Item
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail, addToCart } from '../../actions/cartActions';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const [formShow, setFormShow] = useState(false);
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [p_id, setPid] = useState('');
    const [slug, setSlug] = useState('');

    const { id } = useParams();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const { data, loading } = cart;

    useEffect(() => {
        dispatch(fetchProductDetail(id));
    }, [dispatch, id]);

    const handleToggleForm = (p_id, slug) => {
        setFormShow(!formShow);
        setPid(p_id);
        setSlug(slug);
    };

    const handleChange = (e, result) => {
        if (result.datavalue === 'color') setColor(result.value);
        if (result.datavalue === 'size') setSize(result.value);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (color && size) {
            const result = dispatch(addToCart(slug, p_id, color, size));
            if (result) {
                setColor('');
                setSize('');
            }
        }
    };

    let colorOptions = [];
    let sizeOptions = [];

    if (data?.color) {
        colorOptions = data.color.map(c => ({
            key: c.id, value: c.id, text: c.color.toUpperCase()
        }));
    }

    if (data?.size) {
        sizeOptions = data.size.map(s => ({
            key: s.id, value: s.id, text: s.size.toUpperCase()
        }));
    }

    if (loading) {
        return (
            <Segment>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
                <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </Segment>
        );
    }

    return (
        <Container>
            <Grid columns={2} divided>
                <Grid.Row style={{ marginTop: '20px' }}>
                    {data ?
                        <Grid.Column>
                            <Card fluid>
                                <Image src={data.image} wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{data.title}</Card.Header>
                                    <Card.Meta>
                                        {data.category}{" "}
                                        {data.discount_price && (
                                            <Label color={
                                                data.label === "primary" ? "blue" :
                                                    data.label === "secondary" ? "green" : "olive"
                                            }>
                                                {data.label}
                                            </Label>
                                        )}
                                    </Card.Meta>
                                    <Card.Description>{data.description}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <Button fluid color="yellow" floated="right" icon labelPosition="right"
                                        onClick={() => handleToggleForm(data.id, data.slug)}>
                                        {formShow ? 'Close Form' : 'Add to cart'}
                                        <Icon name="cart plus" />
                                    </Button>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        : 'Not Available'}

                    <Grid.Column>
                        <Header as="h2">Try different color and size</Header>
                        <Segment>
                            <Divider horizontal>Available Colors</Divider>
                            <Item.Group divided>
                                <Grid columns={5}>
                                    {data?.color?.map(c => (
                                        <Item key={c.id}>
                                            {c.image && <Item.Image size="tiny" src={c.image} />}
                                            <Item.Content verticalAlign="middle">{c.value}</Item.Content>
                                        </Item>
                                    )) || 'No Color Available'}
                                </Grid>
                            </Item.Group>
                        </Segment>

                        <Segment>
                            <Divider horizontal>Available Sizes</Divider>
                            <Item.Group divided>
                                {data?.size?.map(s => (
                                    <Label color='green' horizontal key={s.id}>
                                        {s.size}
                                    </Label>
                                )) || 'No Size Available'}
                            </Item.Group>
                        </Segment>

                        {formShow && (
                            <Segment>
                                <Divider horizontal>Select Color And Size </Divider>
                                <Select fluid value={color} placeholder='Select Color' options={colorOptions}
                                    onChange={handleChange} datavalue='color' style={{ marginBottom: '10px' }} />
                                <Select fluid value={size} placeholder='Select Size' options={sizeOptions}
                                    onChange={handleChange} datavalue='size' style={{ marginBottom: '10px' }} />
                                <Button onClick={handleAddToCart} color='violet' fluid>Add</Button>
                            </Segment>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default ProductDetail;
