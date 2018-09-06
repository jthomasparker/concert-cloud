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
                            })
                        

}