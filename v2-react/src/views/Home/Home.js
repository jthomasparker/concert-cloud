import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Button, Container, Row, Col } from 'reactstrap'
import API from '../../utils/API'
import { EventCard } from '../../components'


class Home extends Component {
    constructor(props) {
        super(props)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.clearInput = this.clearInput.bind(this)
        this.state = {
            searchVal: '',
            pageNum: 1,
            geoip: false,
            results: []
        };
    }

    handleInputChange = e => {
        const { name, value } = e.target;
        this.setState({
          [name]: value
        });
      }

    clearInput = () => {
        this.setState({
            searchVal: ''
        })
    }

    handleSearch = () => {
        API.getEvents({
            searchVal: this.state.searchVal,
            pageNum: this.state.pageNum,
            geoip: this.state.geoip
        })
        .then(res => {
            console.log(res.data.events)
            this.setState({
                results: res.data.events
            })
        })
        .catch(err => console.log(err))
    }

    


    render() {
        return (
                <Container className="p-1">
                    <Row className="mb-4">
                        <Col xs="3"/>
                        <Col xs="6">    
                            <InputGroup size="lg">
                                <Input
                                    name="searchVal"
                                    placeholder="Search" 
                                    value={this.state.searchVal}
                                    onChange={this.handleInputChange}
                                    onFocus={this.clearInput} 
                                />
                                <InputGroupAddon addonType="append">
                                    <Button 
                                        color="secondary" 
                                        onClick={this.handleSearch}>
                                        <i className="fa fa-search fa-lg" />
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                        <Col xs="3"/>
                    </Row>
                    {this.state.results.map(event => (
                        <EventCard
                            key={event.id}
                            toggleFavs={this.props.updateFavorites}
                            isFavorite={this.props.favorites.includes(event.id)}
                            event={event}
                            />
                        ))
                    }
                    
                </Container> 
        )
    }

}

export default Home