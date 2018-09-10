import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button, CardTitle, CardText, CardImg, CardHeader, CardSubtitle, CardLink, Modal, ModalBody } from 'reactstrap'
import moment from 'moment'
import Slider from 'react-rangeslider'
import API from '../../utils/API'
import 'react-rangeslider/lib/index.css'

// TODO: break this down into components, add favorites functionality

class EventCard extends Component {
    constructor(props) {
        super(props)
        this.getArtistVideo = this.getArtistVideo.bind(this)
        this.getWeather = this.getWeather.bind(this)
        this.toggleModal = this.toggleModal.bind(this)

        this.state = {
            weatherForecast: {
                temp: '',
                weather: ''
            },
            modal: false,
            videoUrl: '',
            videoTitle: ''
        }

    }

    componentDidMount() {
        this.getWeather()
    }

    getArtistVideo(e) {
       const name = e.target.name
       API.getArtistVideo(name)
        .then(res => {
            const video = res.data.items[0]
            this.setState({
                modal: !this.state.modal,
                videoUrl: 'https://www.youtube.com/embed/' + video.id.videoId,
                videoTitle: video.snippet.title
            })
        })
    }

    getWeather() {
        API.getWeather(this.props.event.venue.postal_code)
            .then(res => {
                // get the datetime of the event
                const eventDatetime = moment(this.props.event.datetime_local)
                // use moment's isBetween method to find the appropriate forecast timeframe
                const forecastMatch = 
                                res.data.list.filter(datetime => 
                                        eventDatetime.isBetween(datetime.dt_txt, 
                                        moment(datetime.dt_txt).add(3, 'hours'), 'minute', []))
                // if there's a forecast for the event date/time, update state
                const forecast = forecastMatch.length ? 
                                {
                                    temp: `${forecastMatch[0].main.temp_min} - ${forecastMatch[0].main.temp_max}${String.fromCharCode(176)} (F)`,
                                    weather: forecastMatch[0].weather[0].description
                                }
                                : 
                                {...this.state.weatherForecast}
                this.setState({
                    weatherForecast: forecast
                })
            })
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        })
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
                                <Col md="6">
                                    <Card>
                                        <Row>
                                            <Col md="6">
                                            <CardBody>
                                                <CardTitle>Where</CardTitle>
                                            
                                                <CardSubtitle>
                                                <CardLink href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(event.venue.name)}`}>
                                                {event.venue.name}
                                                </CardLink>
                                                </CardSubtitle>
                                                <CardText>
                                                    {event.venue.address}<br/>
                                                    {event.venue.extended_address}
                                                </CardText>
                                            </CardBody>
                                            </Col>
                                            <Col md="6">
                                            <CardBody>
                                                <CardTitle>When</CardTitle>
                                                <CardText>
                                                {moment(event.datetime_local).format("dddd, MMMM Do YYYY, [at] h:mm a")}
                                                </CardText>
                                                <CardText>
                                                {this.state.weatherForecast.temp}<br/>
                                                {this.state.weatherForecast.weather}
                                                </CardText>
                                            </CardBody>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <CardBody>
                                                    <CardSubtitle>Ticket Prices</CardSubtitle>
                                                    <CardText>${event.stats.average_price} Avg Price</CardText>
                                                <Slider
                                                    orientation="horizontal"
                                                    value={event.stats.average_price}
                                                    min={event.stats.lowest_price}
                                                    max={event.stats.highest_price}
                                                    labels={{[event.stats.lowest_price]: '$' + event.stats.lowest_price, [event.stats.highest_price]: '$' + event.stats.highest_price}}
                                                    />
                                                <CardLink href={event.url} target='_blank'>
                                                    Get Tickets
                                                </CardLink>
                                                </CardBody>
                                            </Col>
                                        </Row>
                                    </Card>
                                    </Col>
                                    <Col md="6">
                                    <Card>
                                        <CardBody>
                                            <CardTitle>Who</CardTitle>
                                                <CardText>
                                                    {event.performers.map(artist => (
                                                        <Button className="m-1" outline color="secondary"
                                                            key={artist.id}
                                                            name={artist.name}
                                                            onClick={this.getArtistVideo} 
                                                            >
                                                            {artist.name}
                                                        </Button>
                                                    ))}
                                                </CardText>
                                        </CardBody>
                                    </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>   
                    <Modal 
                    isOpen={this.state.modal}
                    toggle={this.toggleModal}
                    size="lg"
                    centered
                >
                
                <ModalBody className="embed-responsive embed-responsive-16by9">
                    <iframe 
                        className="embed-responsive-item" 
                        allowFullScreen
                        src={this.state.videoUrl}
                   />
                </ModalBody>
                </Modal>                 
                </Row>


        )
    }

}

export default EventCard;