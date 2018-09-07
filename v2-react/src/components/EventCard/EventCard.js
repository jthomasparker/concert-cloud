import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button, CardTitle, CardText, CardImg, CardHeader } from 'reactstrap'



class EventCard extends Component {
    constructor(props) {
        super(props)

        this.state = {

        };
    }



    render() {
        return (
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                {this.props.title}
                            </CardHeader>
                            <CardBody>
                                <CardText>This is a test</CardText>
                            </CardBody>
                        </Card>
                    </Col>                    
                </Row>
        )
    }

}

export default EventCard;