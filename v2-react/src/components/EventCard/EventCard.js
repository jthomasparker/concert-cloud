import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button, CardTitle, CardText, CardImg, CardHeader, CardSubtitle, CardLink } from 'reactstrap'
import moment from 'moment'
import API from '../../utils/API'


class EventCard extends Component {
    constructor(props) {
        super(props)
        this.getArtistVideo = this.getArtistVideo.bind(this)
        this.getWeather = this.getWeather.bind(this)

    }

    getWeather(zip) {
        
    }

    getArtistVideo(artist) {

    }



    render() {
        const event = this.props.event
        return (
                <Row className="m-3">
                    <Col xs="12">
                        <Card>
                            <CardHeader tag="h3">
                                {event.title}
                            </CardHeader>
                            <CardBody>
                                <Row>
                                <Col xs="6">
                                    <Card>
                                        <Row>
                                            <Col xs="6">
                                            <CardBody>
                                                <CardTitle>Where</CardTitle>
                                            
                                                <CardSubtitle>{event.venue.name}</CardSubtitle>
                                                <CardText>
                                                    {event.venue.address}<br/>
                                                    {event.venue.extended_address}
                                                </CardText>
                                                <CardLink href={event.url}>
                                                    Get Tickets
                                                </CardLink>
                                            </CardBody>
                                            </Col>
                                            <Col xs="6">
                                            <CardBody>
                                                <CardTitle>When</CardTitle>
                                                <CardText>
                                                {moment(event.datetime_local).format("dddd, MMMM Do YYYY, [at] h:mm a")}
                                                </CardText>
                                            </CardBody>
                                            </Col>
                                        </Row>
                                    </Card>
                                    </Col>
                                    <Col xs="6">
                                    <Card>
                                        <CardBody>
                                            <CardTitle>Who</CardTitle>
                                                <CardText>
                                                    {event.performers.map(artist => (
                                                        <CardLink 
                                                            key={artist.id}
                                                            href="#" 
                                                            onClick={this.getArtistVideo(artist.name)} 
                                                            >
                                                            {artist.name}
                                                        </CardLink>
                                                    ))}
                                                </CardText>
                                        </CardBody>
                                    </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>                    
                </Row>
        )
    }

}

export default EventCard;