import React, { Component } from 'react';
import { CustomNavbar } from '../../components'
import { TabContent, TabPane } from 'reactstrap'
import { Home, Favorites } from '../../views'
class DefaultContainer extends Component {
    constructor(props) {
        super(props)
        this.toggleTab = this.toggleTab.bind(this);
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


    render() {
        return (
            <div className="App">
                <CustomNavbar 
                    toggleTab={this.toggleTab}
                    activeTab={this.state.activeTab}
                    />
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="home">
                        <Home/>
                    </TabPane>
                    <TabPane tabId="favorites">
                        <Favorites />
                    </TabPane>
                </TabContent>
            </div>
        )
    }

}

export default DefaultContainer