import React, { Component } from 'react';
import { CustomNavbar } from '../../components'
import { TabContent, TabPane } from 'reactstrap'
import { Home, Favorites } from '../../views'
class DefaultContainer extends Component {
    constructor(props) {
        super(props)
        this.toggleTab = this.toggleTab.bind(this);
        this.updateFavorites = this.updateFavorites.bind(this)
        this.state = {
            activeTab: 'home',
            favorites: []
        };
    }


    toggleTab(tab) {
        this.setState({
            activeTab: tab
        })
    }

    updateFavorites(id) {
        let newFavorites = this.state.favorites
        newFavorites = newFavorites.includes(id) ? newFavorites.filter(fav => fav != id) : [id, ...newFavorites]
        this.setState({
            favorites: newFavorites
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
                        <Home
                            favorites={this.state.favorites}
                            updateFavorites={this.updateFavorites}
                            />
                    </TabPane>
                    <TabPane tabId="favorites">
                        <Favorites 
                            favorites={this.state.favorites}
                            updateFavorites={this.updateFavorites}
                            />
                    </TabPane>
                </TabContent>
            </div>
        )
    }

}

export default DefaultContainer