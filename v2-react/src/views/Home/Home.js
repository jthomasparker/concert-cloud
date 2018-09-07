import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Button, Container, Row, Col } from 'reactstrap'
import API from '../../utils/API'
import { EventCard } from '../../components'


class Home extends Component {
    constructor(props) {
        super(props)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.state = {
            searchVal: '',
            pageNum: 1,
            geoip: false
        };
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
      }

    handleSearch = () => {
        API.getEvents({
            searchVal: this.state.searchVal,
            pageNum: this.state.pageNum,
            geoip: this.state.geoip
        })
        .then(result => console.log(result.data.events))
        .catch(err => console.log(err))
    }

    


    render() {
        return (
                <Container>
                    <Row>
                        <Col xs="3"/>
                        <Col xs="6">    
                            <InputGroup size="lg">
                                <Input
                                    name="searchVal"
                                    placeholder="Search" 
                                    value={this.state.searchVal}
                                    onChange={this.handleInputChange} 
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
                    <EventCard title={"this is the title"} />
                </Container> 
        )
    }

}

export default Home