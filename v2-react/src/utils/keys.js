export default {
    apiKeys: {
        youtube_api: process.env.REACT_APP_YOUTUBE,
        seatgeek_id: process.env.REACT_APP_SEATGEEKID,
        seatgeek_api: process.env.REACT_APP_SEATGEEKAPI,
        weather_api: process.env.REACT_APP_WEATHER
    },

    firebaseConfig: {
        apiKey: process.env.REACT_APP_FIREBASEAPI,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DB,
        projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
        messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID
    }
}