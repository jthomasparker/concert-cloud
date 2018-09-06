import React, { Component } from 'react';
import CustomNavbar from '../../components'
import { TabContent, TabPane, InputGroup, InputGroupAddon, InputGroupText, Input, Button, Container, Row, Col } from 'reactstrap'
import API from '../../utils/API'
class DefaultContainer extends Component {
    constructor(props) {
        super(props)
        this.toggleTab = this.toggleTab.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.state = {
            activeTab: 'home',
            searchVal: '',
            pageNum: 1,
            geoip: false
        };
    }


    toggleTab = tab => {
        this.setState({
            activeTab: tab
        })
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
            <div className="App">
                <CustomNavbar 
                    toggleTab={this.toggleTab}
                    activeTab={this.state.activeTab}
                    />
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="home">
                    <Container>
                        <Row>
                            <Col xs="3"/>
                            <Col xs="6">    
                        <InputGroup size="lg">
                            <Input
                                name="searchVal"
                                placeholder="Search" 
                                value={this.state.searchVal}
                                onChange={this.handleInputChange} />
                            
                                <InputGroupAddon addonType="append">
                                <Button color="secondary" onClick={this.handleSearch}><i className="fa fa-search fa-lg" /></Button>
                                </InputGroupAddon>
                        </InputGroup>
                        </Col>
                        <Col xs="3"/>
                        </Row>
                        </Container> 
                    </TabPane>
                    <TabPane tabId="favorites">
                        Favorites Tab
                    </TabPane>
                </TabContent>
            </div>
        )
    }

}

export default DefaultContainer