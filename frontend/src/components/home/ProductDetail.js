import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Segment,
    Dimmer,
    Loader,
    Image,
    Card,
    Icon,
    Container,
    Button,
    Label,
    Grid,
    Divider,
    Form,
    Select,
    Header,
    Item,
} from 'semantic-ui-react';
import { fetchProductDetail, addToCart } from '../../actions/cartActions';



class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formShow: false,
            size: '',
            color: '',
            p_id: '',
            slug: '',
        }
    }

    static propTypes = {
        addToCart: PropTypes.func.isRequired,
        cart: PropTypes.object.isRequired,
        fetchProductDetail: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.fetchProductDetail(this.props.match.params.id)
    }

    handleToggleForm = (p_id, slug) => {
        const { formShow } = this.state;
        this.setState({
            formShow: !formShow,
            p_id: p_id,
            slug: slug
        });
    };

    handleChange = (e, result) => {
        if (result.datavalue === 'color') { this.setState({ color: result.value }) }
        if (result.datavalue === 'size') { this.setState({ size: result.value }) }
    }

    handleAddToCart = (e) => {
        e.preventDefault()
        const { color, size, p_id, slug } = this.state;
        if (color !== '' && size !== '') {
            const data = this.props.addToCart(slug, p_id, color, size)
            if (data) {
                this.setState({
                    size: '',
                    color: '',
                })
            }
        }
        else {
        }
    };

    render() {
        const { data, loading } = this.props.cart;
        const { formShow } = this.state;
        let colorOptions = []
        let sizeOptions = []

        if (data.color) {
            data.color.forEach(c => {
                colorOptions.push({ key: c.id, value: c.id, text: c.color.toUpperCase() })
            });
        }

        if (data.size) {
            data.size.forEach(s => {
                sizeOptions.push({ key: s.id, value: s.id, text: s.size.toUpperCase() })
            });
        }
        if (loading) {
            return (
                <Segment>
                    <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>

                    <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
                </Segment>
            )
        }
        return (
            <><Container>
                <Grid columns={2} divided >
                    <Grid.Row style={{ marginTop: '20px' }} >
                        {data ?
                            <Grid.Column >
                                <Card fluid>
                                    <Image src={data.image} wrapped ui={false} />
                                    <Card.Content>
                                        <Card.Header>{data.title}</Card.Header>
                                        <Card.Meta>
                                            {data.category}  {" "}
                                            {data.discount_price && (
                                                <Label
                                                    color={
                                                        data.label === "primary"
                                                            ? "blue"
                                                            : data.label === "secondary"
                                                                ? "green"
                                                                : "olive"
                                                    }
                                                >
                                                    {data.label}
                                                </Label>
                                            )}
                                        </Card.Meta>
                                        <Card.Description>
                                            {data.description}
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Button
                                            fluid
                                            color="yellow"
                                            floated="right"
                                            icon
                                            labelPosition="right"
                                            onClick={() => this.handleToggleForm(data.id, data.slug)}
                                        >
                                            {this.state.formShow === false ?
                                                'Add to cart' :
                                                'Close Form'
                                            }
                                            <Icon name="cart plus" />
                                        </Button>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            : 'Not Available'}
                        <Fragment>
                            <Grid.Column>
                                <Header as="h2">Try different color and size</Header>
                                <Segment>
                                    <Divider horizontal>Available Colors</Divider>
                                    <Item.Group divided>
                                        <Grid columns={5}>
                                            {data.color ? data.color.map(c => {
                                                return (
                                                    <Item key={c.id}>
                                                        {c.image && (
                                                            <Item.Image
                                                                size="tiny"
                                                                src={c.image}
                                                            />
                                                        )}
                                                        <Item.Content verticalAlign="middle">
                                                            {c.value}
                                                        </Item.Content>
                                                    </Item>
                                                );
                                            })
                                                : 'No Color Available'}
                                        </Grid>
                                    </Item.Group>
                                </Segment>
                                <Segment>
                                    <Divider horizontal>Available Sizes</Divider>
                                    <Item.Group divided>
                                        {data.size ? data.size.map(s => {
                                            return (
                                                <Label color='green' horizontal key={s.id}>
                                                    {s.size}
                                                </Label>
                                            )
                                        })
                                            : 'No Size Available'}
                                    </Item.Group>
                                </Segment>

                                {formShow && (
                                    <Fragment>
                                        <Segment>
                                            <Divider horizontal>Select Color And Size </Divider>
                                            <Select
                                                fluid
                                                value={this.state.color}
                                                placeholder='Select Color'
                                                options={colorOptions}
                                                onChange={this.handleChange}
                                                datavalue='color'
                                                style={{ marginBottom: '10px' }}
                                            />
                                            <Select
                                                fluid
                                                value={this.state.size}
                                                placeholder='Select Size'
                                                options={sizeOptions}
                                                onChange={this.handleChange}
                                                datavalue='size'
                                                style={{ marginBottom: '10px' }}
                                            />
                                            <Button onClick={this.handleAddToCart} color='violet' fluid>Add</Button>
                                        </Segment>
                                    </Fragment>
                                )}
                            </Grid.Column>
                        </Fragment>
                    </Grid.Row>
                </Grid>
            </Container>
            </>
        )
    }

}
const mapstateToProps = state => ({
    cart: state.cart,
})

export default connect(mapstateToProps, { fetchProductDetail, addToCart })(ProductDetail);