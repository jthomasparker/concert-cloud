import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap'
import API from '../../utils/API'


class Favorites extends Component {
    constructor(props) {
        super(props)

        this.state = {
            favorites: [],
            pageNum: 1,
            geoip: false
        };
    }



    render() {
        return (
                <Container>
                    <Row>
                        Favorites
                    </Row>
                </Container> 
        )
    }

}

export default Favorites