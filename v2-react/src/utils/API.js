import axios from 'axios'
import keys from './keys'

export default {

    getEvents: data => axios.get('https://api.seatgeek.com/2/events?taxonomies.name=concert', {
                                params: 
                                {
                                    client_id: keys.apiKeys.seatgeek_id,
                                    client_secret: keys.apiKeys.seatgeek_api,
                                    q: data.searchVal,
                                    page: data.pageNum,
                                    per_page: 10,
                                    geoip: data.geoip
                                }
                            }),
    
    getWeather: zipCode => axios.get('https://api.openweathermap.org/data/2.5/forecast?', {
                                params: 
                                {
                                    APPID: keys.apiKeys.weather_api,
                                    units: 'imperial',
                                    zip: zipCode 
                                }
                            }),

    getArtistVideo: artist => axios.get('https://www.googleapis.com/youtube/v3/search?', {
                                params:
                                {
                                    key: keys.apiKeys.youtube_api,
                                    maxResults: 1,
                                    q: artist + ' official',
                                    part: 'snippet',
                                    type: 'video',
                                    videoCategoryId: 10,
                                    videoEmbeddable: true,
                                    videoSyndicated: true,
                                }
                            })

}