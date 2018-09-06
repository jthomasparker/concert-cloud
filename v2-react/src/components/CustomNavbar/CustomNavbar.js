import React, { Component } from 'react';
import { 
    Collapse,
    Navbar, 
    NavbarToggler, 
    Nav, 
    NavItem, 
    NavLink, 
    NavbarBrand,
    TabContent,
    TabPane
} from 'reactstrap';
import classnames from 'classnames';
//import './CustomNavbar.css'

class CustomNavbar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="App">
                <Navbar expand="md">
                    <NavbarBrand href="/">ConcertCloud</NavbarBrand>
                    
                    <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.props.activeTab === 'home'})}
                            onClick={ () => { this.props.toggleTab('home') }}
                        >
                        <i className="fa fa-home fa-lg"/>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink 
                            className={classnames({ active: this.props.activeTab === 'favorites'})}
                            onClick={ () => { this.props.toggleTab('favorites') }}
                        >
                        <i className="fa fa-star fa-lg"/>
                        </NavLink>
                    </NavItem>
                    </Nav>
                    </Navbar>
                
            </div>
        )
    }

}

export default CustomNavbar