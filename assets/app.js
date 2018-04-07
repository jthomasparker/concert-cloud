

var eventBriteToken = 'H3LGM754AS3WAX5USJYR'
var googleApiKey = 'AIzaSyAoSUvf9nkYuSYOhZbwtCjt1THHC9V0KGo'
var sgId = 'MTEwMzkzNDZ8MTUyMjM2NDA5NS41Mw'
var sgKey = '094349186bab82b92cda01baee0176b6a15cb2703a3b630c1108bc73ba7a66d3'
var weatherApiKey = 'cf2aa58036825fe3fb68e07d959d4291'
var qYoutube;
var qEventBrite;
var eventType = "concert"
var googleUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + qYoutube + '&type=video&videoEmbeddable=true&key=' + googleApiKey
var eventBriteurl = 'https://www.eventbriteapi.com/v3/events/search/?token=H3LGM754AS3WAX5USJYR&q=' + qEventBrite
var sgQ = "";
var page = 1;
var sgPerformer = "";
var lon = 0;
var lat = 0;
var favorites = [];
var displayFavorites = false;
var config = {
    apiKey: "AIzaSyC7rTCfLMZJrv9vy53vXZhJenvje0qwRQU",
    authDomain: "concert-cloud.firebaseapp.com",
    databaseURL: "https://concert-cloud.firebaseio.com",
    projectId: "concert-cloud",
    storageBucket: "concert-cloud.appspot.com",
    messagingSenderId: "36077992367"
  };
  firebase.initializeApp(config);
var db = firebase.database()
var ref = db.ref("/users/")
var currentUid = null;
var signedIn = false;
var signinRefused = false;
var userPhoto;
var geoip = false;;
var city;
var state;

$(document).ready(function(){
    $('#locationMsg').css("color", "white");
      // initial states  
    $('.pagination').hide();
    toggleDisplay()
    signedIn = checkUserStatus()

    // firebase listener
    ref.on('value', function(snapshot){
        if(signedIn){
        // console.log(snapshot.val())
        }
    })

        // on click functions to load results for pagination
    $("#btn1").on("click",function() {
        page = 1;
        querySeatGeek();
        toggleDisplay();
    });

    $("#btn2").on("click",function() {
        page = 2;
        querySeatGeek();
        toggleDisplay();
    });

    $("#btn3").on("click",function() {
        page = 3;
        querySeatGeek();
        toggleDisplay();
    });

    $("#btn4").on("click",function() {
        page = 4;
        querySeatGeek();
        toggleDisplay();
    });

    $("#btn5").on("click",function() {
        page = 5;
        querySeatGeek();
        toggleDisplay();
    });


    // firebase listener to see when a user signs in or out
    firebase.auth().onAuthStateChanged(function(user) {
        // if user is signed in
    if(user){
        signedIn = true;
        currentUid = user.uid;
        console.log(user.displayName + " is signed in as " + currentUid)
        updateUser();
        toggleDisplay();
     // if user is signed out
    } else {
       signedIn = false;
       signinRefused = false;
       currentUid = null;
       resetVariables();
       console.log('Not signed in')
        }
    updateLoginBtn();
    })


    // click event for performer button - loads youtube video
    $('body').on('click', '.performerBtn', function(){
        // get the text of the button (performer name used for youtube search)
        var performer = $(this).text();
        // get the event-id
        var eventId = $(this).attr('event-id')
        // use the event-id attr to select the videoDiv 
        var videoDiv = $('.video-output[event-id=' + eventId + ']')
        // set the youtube search to performer plus music
        qYoutube = performer + " official"
        // call youtube api with the div of where to display the video
        console.log(eventId)
        queryYoutube(videoDiv)
    })
    // click event for the search button
    $('#btnSearch').on('click', function () {
        //  preventDefault();    
        // go to home screen, reset previous variables    
        displayFavorites = false;        
        sgQ = "";

        //toggleDisplay();
        resetVariables();

        var searchInput = $('#search');
         userinput = searchInput.val();
        if(validatedZipCode(userinput)){
            geoip = userinput;
            city = "";
            state = "";
            lat  = 0;
            lon = 0;
            $("#locationMsg").html("Searching for events near " + userinput + ". <a style='color: white; cursor: pointer' onclick='clearLocation()'>Clear location</a>");
        }
        else if(validatedCity(userinput)){
            geoip = false;
            city = userinput.substring(5).trim();
            state = "";
            lat  = 0;
            lon = 0;
            $("#locationMsg").html("Searching for events near " + city + ". <a style='color: white; cursor: pointer' onclick='clearLocation()'>Clear location</a>");
        }
        else if(validatedState(userinput)){
            geoip = false;
            city = "";
            lat  = 0;
            lon = 0;
            state = userinput.substring(6).trim();
            $("#locationMsg").html("Searching for events in " + state + ". <a style='color: white; cursor: pointer' onclick='clearLocation()'>Clear location</a>");
        }
        else{
            sgQ = userinput;
        }
        querySeatGeek();
        $('.pagination').show();
        $(this).blur();

    });

    // resets search textbox
    $('#search').on('focus', function(){
        $(this).val('');
    })
    // enter key for search
    $('#search').keypress(function(e){
        var key = e.which;
        if(key === 13 && $('#search').val().length > 0){
            $('#btnSearch').click()
        }
    })

    // favorites nav button click event
    $('#navFavorites').on('click', function(){
        $("#locationMsg").text("");
        displayFavorites = true;
        
        if((!signedIn)&&(!signinRefused)){
            $('#loginModal').modal();
        }
    
        toggleDisplay();
    })

    //  home nav button click event
    $('#navHome').on('click', function(){
        displayFavorites = false;
        toggleDisplay();
    })

    // login button click event
    $('#btnLogin').on('click', function(){
        if(signedIn){
            firebase.auth().signOut();
        } else {
            $('#loginModal').modal();
        }
        
        updateLoginBtn();
    })
    $(".locationBtn").on("click", function (event) {
        event.preventDefault(); //prevent page from loading on button click
        var startPos;
        var geoSuccess = function (position) {
            // Do magic with location
            geoip = false;
            city = "";
            startPos = position;
            lat = startPos.coords.latitude;
            lon = startPos.coords.longitude;
            console.log("startLat: " + lon + " startLon: " + lat);
             sgQ = $('#search').val();
             $('#locationMsg').html("Searching for events near you. " + "<a style='color: white; cursor: pointer' onclick='clearLocation()'>Clear location</a>");
            querySeatGeek();
            $(this).blur();
        };
        var geoError = function (error) {
            switch (error.code) {
                case error.TIMEOUT:
                    // The user didn't accept the callout
                    lat = "";
                    lon = "";
                    if (google.loader.ClientLocation) {

                        var lati = google.loader.ClientLocation.latitude;
                        var longi = google.loader.ClientLocation.longitude;
                        console.log(lati + " + " + longi);
                    }
                    showNudgeBanner();
                    break;
            }
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    });


    // favorite star click event that saves event to favorites
    $('body').on('click', '.btnFavorite', function(){
        var thisBtn = $(this)
        var eventId = $(this).attr("event-id")
        
        if((!signedIn)&&(!signinRefused)){
            $('#loginModal').modal();
        }
        // add or remove from favorites
        if(favorites.indexOf(eventId) < 0){
            favorites.push(eventId)
        } else {
            var idx = favorites.indexOf(eventId)
            favorites.splice(idx, 1)
        }
        // updates the favorites page as favorites are added/removed
        if(displayFavorites){
            if(favorites.length > 0){
                querySeatGeek();
            } else {
            $('#results').empty();
            }
        }
        // update the favorite star button
        updateFavoriteBtn(thisBtn)
        // update the db if user is signed in
        if(signedIn){
            ref.child(currentUid).update({favorites: favorites})
        }
        $(this).blur();
    })


    // cancel click event for the modal
    $('.cancelLogin').on('click', function(){
        signinRefused = true;
    })
 
}) // end of document.ready


function resetVariables(){
    var sgQ = "";
    var page = 1;
    var sgPerformer = "";
    var lon = 0;
    var lat = 0;
}

// searches seatgeek api
function querySeatGeek(){
    $('#results').empty();
    // get the api url
    var searchUrl = getUrl('sgEventSearch')
        console.log(searchUrl)
    // call the api
    callApi(searchUrl).done(function(response){
       
        // get the resulting events
        var results = response.events 
        console.log(results)

        // loop through the results
        for(i = 0; i < results.length; i++){
            // assign the event results to variables
            var eventId = results[i].id;
            var eventUrl = results[i].url;
            var eventScore = results[i].score;
            var urlEncodedVenueName = encodeURI(results[i].venue.name);
            var venueName = '<a target="_blank" href= "https://www.google.com/maps/search/?api=1&query=' + urlEncodedVenueName + '">' + '<h4>' + results[i].venue.name + '</h4>' + '</a>';
            var venueStreet = results[i].venue.address;
            var venueCity = results[i].venue.city;
            var venueState = results[i].venue.state;
            var venueCityandState = venueCity + ", " + venueState;
            var venueZip = results[i].venue.postal_code;
            var venueLocation = results[i].venue.location;
            var title = results[i].title;
            var date = moment(results[i].datetime_local).format("MM/DD/YYYY");
            var dateTime = moment(results[i].datetime_local);
            // format date and time
            var formattedDateTime = moment(results[i].datetime_local).format("dddd, MMMM Do YYYY, [at] h:mm a");
            var formattedAddress = venueStreet + "<br>" + venueCityandState + "<br>" + venueZip;
            
            
            // create the main panel for results
            var resultPanel = $('<div class="panel panel-default resultPanel">').css('border-color', 'black')
            var panelHeading = $('<div class="panel-heading">')
                                .appendTo(resultPanel)
                                .css({'background': 'black',
                                    'color': 'white',
                                    'border-color': 'black'
                                })
                                .attr({
                                    'data-toggle': "collapse",
                                    'href': "#collapse-" + eventId
                                });
            // glyph to show collapsed/not collapsed
            var glyphSpan = $('<span>')
            .html("<p>")
            .appendTo(panelHeading);
            var glyph = $('<i class="glyphicon">') //changed to no glyph since the toggle on collapse wasn't changing the icon
            .appendTo(glyphSpan);
            // favorite (star) button
            var btnFavorite = $('<button class="btnFavorite">')
                            .appendTo(panelHeading)
                            .css({'background': 'black',
                                    'color': 'white',
                                    'border-color': 'black'
                                });
            var panelTitle = $('<h1>').appendTo(panelHeading);
            panelTitle.css({'display': 'inline-block',
                            'margin': '0.37em 0'});
            // create a div to wrap the panel body to make it collapsible, append it to the panel
            var collapseDiv = $('<div class="panel-collapse collapse in">')
            .attr('id', "collapse-" + eventId)
            .appendTo(resultPanel)
            // change glyph based on whether or not the panel is collapsed
            .on('shown.bs.collapse', function() {
                glyph.addClass('glyphicon-chevron-up');
                glyph.removeClass('glyphicon-chevron-down')
            })
            .on('hidden.bs.collapse', function() {
                glyph.addClass('glyphicon-chevron-down')
                glyph.removeClass('glyphicon-chevron-up')})
                
                
            var panelBody = $('<div class="panel-body">').appendTo(collapseDiv);

            // create the sub row to divide main panel
            var row = $('<div class="row">').appendTo(panelBody);
            // columns of main panel - size can be adjusted just by changing the bootstrap classes
            var leftCol = $('<div class="col-xs-12 col-md-6">').appendTo(row);
            var middleCol = $('<div class="col-xs-12 col-md-6">').appendTo(row);
            var rightCol = $('<div class="col-xs-0">').appendTo(row);

            // create the sub-panels
            // venuePanel contains venue info
            var venuePanel = $('<div class="panel panel-default">').appendTo(leftCol);
            var venueBody = $('<div class="panel-body">')
                            .appendTo(venuePanel);
            var venueDiv = $('<div>').appendTo(venueBody);
            // event panel is for event info like performers
            var eventPanel = $('<div class="panel panel-default">').appendTo(middleCol);
            var eventBody = $('<div class="panel-body">').appendTo(eventPanel);
            var eventDiv = $('<div>').appendTo(eventBody);
            // div for performers
            var performersDiv = $('<div>')
                                .html("<h3>Who:</h3>")
                                .appendTo(eventDiv);
            var whereDiv = $('<div>').html("<h3>Where:</h3>");                    
            // div for event date and forecast
            var whenDiv = $('<div>').html("<h3>When:</h3>");
            // div for youtube video display
            var videoDiv = $('<div class="video-output">');  
            //div for eventurl, tickets
            var ticketsDiv = $('<div class="tickets">');          
                            
            
            // get the performers
                for(j = 0; j < results[i].performers.length; j++){
                    var performer = results[i].performers[j].name;
                    // create a btn-link for each performer, set its text to the performer name
                    var performerBtn = $('<button class="btn btn-link performerBtn">')
                                        .text(performer)
                                        .attr("event-id", eventId)
                                        .appendTo(performersDiv);    
                };
             // append url to ticketsDiv
             ticketsDiv.html("<a target='_blank' href = '"+ eventUrl + "'>Get Tickets </a>");
            // Set the title of the result panel
            panelTitle.html(date + " - " + title);
            //where div
            whereDiv.append(venueName, formattedAddress)
                .css({
                    'float' : 'left',
                    'max-width' : '262px'
                });
            // append the formatted date/time to whenDiv
            whenDiv.append(formattedDateTime,ticketsDiv)
            .css({
                'float' : 'right',
                'margin-right' : '12px'
            });;
           
            //TODO: get venue rating from yelp?
            // append all the venue stuff plus the whenDiv to the venue panel
            venueDiv.append(whereDiv, whenDiv);
            // append the videoDiv to the performersDiv (output video will display below performers)
            performersDiv.append(videoDiv)
            .css('overflow', 'hidden');
            
            // assign event-id attributes to divs for later use
            resultPanel.attr('event-id', eventId);
            performersDiv.attr('event-id', eventId);
            whenDiv.attr('event-id', eventId);
            videoDiv.attr('event-id', eventId);
            btnFavorite.attr({'id': 'b' + eventId,
                            'event-id': eventId})
                           
            // update the star based on whether or not it has been favorited
            updateFavoriteBtn(btnFavorite)
            

            // get the weather if the event date is within the next 5 days (the openweather api limit)
            var fiveDaysAway = moment().add(5, 'd')
                if(moment(dateTime).isBetween(moment(), fiveDaysAway)){
                    // get the weather with the venue zip code and date/time of event. whenDiv is where to put the weather
                    queryWeather(whenDiv, venueZip, dateTime);
                }

            // append it all to the results div
            $('#results').append(resultPanel);
        };
    });
};




// searches youtube for a video with the performer, output it to videoDiv
function queryYoutube(videoDiv){
   
    var url = getUrl('youtube');
    callApi(url).done(function(response){
        // get the results
        var results = response.items;
        // get the video id from the results for the url
        var videoId = results[0].id.videoId;
        // set the embed url with the video id
        var videoUrl  = 'https://www.youtube.com/embed/' + videoId;
        // create the video panel to contain the video
        var videoPanel = $('<div class="panel panel-default">');
        var iframeDiv = $('<div class="embed-responsive embed-responsive-16by9">');
        var videoEmbed = $('<iframe class="embed-responsive-item" allowfullscreen>')
                            .attr({src: videoUrl})
                            .appendTo(iframeDiv);
        videoPanel.html(iframeDiv);
        videoDiv.html(videoPanel); 
    });
};



// gets the weather forecast for a zip code and dateTime, appends the whenDiv
function queryWeather(whenDiv, venueZip, dateTime){
    // get the url
    var url = getUrl('weather');
    url += '&zip=' + venueZip;
    // make the call
    callApi(url).done(function(response) {
        var results = response.list;
        //loop through the results
        for(var i = 0; i < results.length; i++){
            // get the forecast range
            var forecastStartTime = moment(results[i].dt_txt);
            var forecastEndTime;
                if(i + 1 < results.length){
                forecastEndTime = moment(results[i + 1].dt_txt);
                } else {
                    forecastEndTime = moment(results[i].dt_txt);
                };
            // get the forecast if dateTime falls within the range
            if((moment(dateTime).isBetween(forecastStartTime, forecastEndTime, 'minute', [])) || (moment(dateTime).isSame(forecastStartTime, forecastEndTime, 'minute'))) {
                var lowTemp = Math.round(results[i].main.temp_min)
                var highTemp = Math.round(results[i].main.temp_max)
                var humidity = results[i].main.humidity
                var rain = results[i].rain
                var forecast = results[i].weather[0].description
                var weather = $("<div>").html('<h4>Forecast</h4>' + 'Temp: ' + lowTemp + ' - ' + highTemp + '&#176 (F)<br>' + forecast)
                whenDiv.append(weather)
            };
        };
    });
}


// updates the favorite (star) button
function updateFavoriteBtn(thisBtn){
    // start with an empty button
    thisBtn.empty();
    var eventId = $(thisBtn).attr("event-id");
    var favStar = $('<span class="glyphicon">');
    favStar.css('top','-17px');

    // if it's not in favorites[], empty star otherwise filled star
    if(favorites.indexOf(eventId) < 0){
        favStar.removeClass("glyphicon-star").addClass("glyphicon-star-empty")
    } else {
        favStar.removeClass("glyphicon-star-empty").addClass("glyphicon-star text-danger");
    };

    // add the updated star to the button
    $(thisBtn).append(favStar);
};



function checkUserStatus(){
    var user = firebase.auth().currentUser;
    if(user){
        currentUid = user.uid;
        return true;
    } else {
        return false;
    }
}



// syncs the currentUser with the db, creates a user if it doesn't already exist
function updateUser(){
    // get the current user's data
    var userData = firebase.auth().currentUser;
    // update the db with the user data (except favorites)
    ref.child(currentUid).update({
        name: userData.displayName,
        email: userData.email,
        emailverified: userData.emailVerified,
        photoUrl: userData.photoURL,
        providerId: userData.providerData[0].providerId,
        providerUid: userData.providerData[0].uid,
    }).then(function(){
        // retrieve the newly updated user to see if they had any favorites stored
        ref.child(currentUid).once('value', function(snapshot){
            userPhoto = snapshot.val().photoUrl
            // if the user had favorites stored, combine the local favorites array with the db favorites
            if(snapshot.val().favorites){
                var dbFavorites = snapshot.val().favorites;
                favorites = combineArrays(favorites.concat(dbFavorites));
            };
            // update the db favorites with the favorites array
            ref.child(currentUid).update({favorites: favorites});
        });
    }); 
};


// combines 2 arrays and removes duplicates
function combineArrays(array){
    var arr = array.concat();
    for(var i = 0; i < arr.length; i++){
        for (var j = i+1; j < arr.length; j++){
            if(arr[i] === arr[j]){
                arr.splice(j--, 1)
            }
        }
        if(arr[i] === ""){
            arr.splice(i, 1)
        }
    }
    return arr
}


// updates the "login/out" button based on user status
function updateLoginBtn(){
    if(signedIn){
        if(firebase.auth().currentUser.providerData[0].providerId === 'google.com'){
        var userPhoto = firebase.auth().currentUser.photoURL;
        $('#profilePic').html('<img src="' + userPhoto +'" class="img-circle img-responsive" width="40" height="auto">')
        }
        $('#btnLogin').html("Sign Out")
    } else {
        $('#btnLogin').html("Sign In")
        $('#profilePic').empty();
    }
}



// toggles the page between displaying favorites or home
function toggleDisplay(){
    // update pagination buttons
    var pageList = $('.pagination').children();
    for(i = 0; i < pageList.length; i++){
        var pageBtn = $('#btn' + i)
        if(pageBtn.attr('id') === 'btn' + page){
            pageBtn.addClass('active disabled')
        } else {
            pageBtn.removeClass('active disabled')
        }
    }

    if(displayFavorites){
        $('#navFavorites').addClass("active");
        $('#navHome').removeClass("active");
        $('#results').empty();
        $('#signin').empty();
            if(favorites.length > 0){
                querySeatGeek();
            };
            if(!signedIn){
                var message = '<h3><center><a href="#" data-toggle="modal" data-target="#loginModal">Sign In</a> to Save Your Favorites!</center></h3>';
                var signInPanel = $('<div class="panel panel-default">').appendTo('#signin');
                var signInBody = $('<div class="panel-body">').html(message).appendTo(signInPanel);
            };
             
    } else {
        $('#navFavorites').removeClass("active");
        $('#navHome').addClass("active");
        $('#signin').empty();
            if(sgQ.length === 0){
                $('#results').empty;
            } else{
            querySeatGeek();
            };
    };
};

function validatedZipCode(searchInput){
    var regExVal = new RegExp('^\\d{5}([\\-]?\\d{4})?$');
    return regExVal.test(searchInput);
}
function validatedCity(searchInput){
    var regExVal = new RegExp('^city:');
    return regExVal.test(searchInput);
}
function validatedState(searchInput){
    var regExVal = new RegExp('^state:');
    return regExVal.test(searchInput);
}

function clearLocation() {
    $('#locationMsg').html("");
    geoip = false;
    city = "";
    state = "";
    lon = 0;
    lat = 0;
    querySeatGeek();
}