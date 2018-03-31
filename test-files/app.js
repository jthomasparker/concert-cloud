

var eventBriteToken = 'H3LGM754AS3WAX5USJYR'
var googleApiKey = 'AIzaSyAoSUvf9nkYuSYOhZbwtCjt1THHC9V0KGo'
var seatGeekid = 'MTEwMzkzNDZ8MTUyMjM2NDA5NS41Mw'
var seatGeekkey = '094349186bab82b92cda01baee0176b6a15cb2703a3b630c1108bc73ba7a66d3'
var qYoutube;
var qEventBrite;
var qSeatGeek = "concert"
var googleUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + qYoutube + '&type=video&videoEmbeddable=true&key=' + googleApiKey
var eventBriteurl = 'https://www.eventbriteapi.com/v3/events/search/?token=H3LGM754AS3WAX5USJYR&q=' + qEventBrite



$(document).ready(function(){
/* EVENTBRITE
    $.ajax({
        method: 'GET',
        url: eventBriteurl,
        async: true,
        crossDomain: true,
        headers: {}
    }).done(function(response){
        var results = response.events
        console.log(results)
        for(i=0; i < results.length; i++){
            var title = results[i].name.html + '<p>'
            $('#results').append(title)
        }
    }) */

    // click event for performer button - loads youtube video
    $('body').on('click', '.performerBtn', function(){
        // get the text of the button (performer name used for youtube search)
        var performer = $(this).text();
        // get the id of the div containing the button
        var performerDivId = $(this).closest('div').attr('id');
        // use the container id to select where the video should display
        var videoDiv = $('#v' + performerDivId);
        // set the youtube search to performer plus music
        qYoutube = performer + " music"
        // call youtube api with the div of where to display the video
        queryYoutube(videoDiv)
        
    })


    querySeatGeek();
 
})


// searches seatgeek api
function querySeatGeek(){
    var seatGeekurl = 'https://api.seatgeek.com/2/events?taxonomies.name=' + qSeatGeek + '&client_id=' + seatGeekid + '&client_secret=' + seatGeekkey
    $.ajax({
        method: 'GET',
        url: seatGeekurl,
        async: true,
        crossDomain: true,
        headers: {}
    }).done(function(response){
        // get the resulting events
        var results = response.events
        console.log(results)
        // loop through the results
        for(i = 0; i < results.length; i++){
            
            // create the main panel for results
            var resultPanel = $('<div class="panel panel-default resultPanel">')
            var panelHeading = $('<div class="panel-heading">').appendTo(resultPanel);
            var panelTitle = $('<h1 class="panel-title">').appendTo(panelHeading);
            var panelBody = $('<div class="panel-body">').appendTo(resultPanel);

            // create the sub row to divide main panel
            var row = $('<div class="row">').appendTo(panelBody);
            // columns of main panel - size can be adjusted just by changing the bootstrap classes
            var leftCol = $('<div class="col-xs-12 col-md-4">').appendTo(row);
            var middleCol = $('<div class="col-xs-12 col-md-4">').appendTo(row);
            var rightCol = $('<div class="col-xs-12 col-md-4">').appendTo(row);

            // create the sub-panels
            // venuePanel contains venue info
            var venuePanel = $('<div class="panel panel-default">').appendTo(leftCol);
            var venueBody = $('<div class="panel-body">')
                            .html("<h3>Where:</h3>")
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
            // div for event date and forecast
            var whenDiv = $('<div>').html("<h3>When:</h3>");
            // div for youtube video display
            var videoDiv = $('<div>');

            

            // get the performers
            for(j = 0; j < results[i].performers.length; j++){
                var performer = results[i].performers[j].name
                // create a btn-link for each performer, set its text to the performer name
                var performerBtn = $('<button class="btn btn-link performerBtn">').text(performer);
                // append each performer button to the performersDiv
                performersDiv.append(performerBtn);
            };

            // assign the event results to variables
            var eventId = results[i].id;
            var eventUrl = results[i].url;
            var eventScore = results[i].score;
            var venueName = '<h4>' + results[i].venue.name + '</h4>';
            var venueAddress = results[i].venue.address + '<br>';
            var venueCity = results[i].venue.city  + ', ';
            var venueState = results[i].venue.state;
            var venueCityandState = venueCity + "," + venueState;
            var venueZip = '<br>' + results[i].venue.postalcode;
            var venueLocation = results[i].venue.location;
            var title = results[i].title;
            var date = moment(results[i].datetime_local).format("MM/DD/YYYY");
            var dateTime = moment(results[i].datetime_local).format("dddd, MMMM Do YYYY, [at] h:mm a");

            // Set the title of the result panel
            panelTitle.html(date + " - " + title);
            // append the formatted date/time to whenDiv
            whenDiv.append(dateTime);
            
            //TODO: get venue rating from yelp?
            // append all the venue stuff plus the whenDiv to the venue panel
            venueDiv.append(venueName, venueAddress, venueCity, venueState, venueZip, whenDiv);
            // append the videoDiv to the performersDiv (output video will display below performers)
            performersDiv.append(videoDiv);
            
            // assign ids to divs for later use
            resultPanel.attr('id', 'e' + eventId);
            performersDiv.attr('id', 'p' + eventId);
            rightCol.attr('id', 'rightColp' + eventId);
            whenDiv.attr('id', 'when' + eventId);
            videoDiv.attr('id', 'vp' + eventId);

            // get the weather if the event date is within the next 5 days
            var fiveDaysAway = moment().add(5, 'd').format("MM/DD/YYYY");
            if(fiveDaysAway > date){
                queryWeather(whenDiv, venueCityandState, date);
            }
            // append it all to the results div that's hard-coded in
            $('#results').append(resultPanel);
        }


    }) 
    
}


// searches youtube for a video with the performer, output it to videoDiv
function queryYoutube(videoDiv){
    var googleUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + qYoutube + '&type=video&videoEmbeddable=true&key=' + googleApiKey
    
    $.ajax({
        method: 'GET',
        url: googleUrl,
        async: true,
        crossDomain: true,
        headers: {}
    }).done(function(response){
        // get the results
        var results = response.items
        // get the video id from the results for the url
        var videoId = results[0].id.videoId
        // set the embed url with the video id
        var videoUrl  = 'https://www.youtube.com/embed/' + videoId
        // create the video panel to contain the video
        var videoPanel = $('<div class="panel panel-default">');
        var videoBody = $('<div class="panel-body">').appendTo(videoPanel)
        var iframeDiv = $('<div class="embed-responsive embed-responsive-16by9">')
        var videoEmbed = $('<iframe class="embed-responsive-item" allowfullscreen>')
                            .attr({src: videoUrl})
                            .appendTo(iframeDiv);
        videoBody.html(iframeDiv)
        videoDiv.html(videoPanel)
        
    })
    
}


function queryWeather(whenDiv, cityAndState, date){
    var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityAndState + ",usa&units=imperial&APPID=cf2aa58036825fe3fb68e07d959d4291";

    $.ajax({
        url: weatherUrl,
        method: "GET",
        async: true,
      crossDomain: true,
      headers: {}
      }).then(function(response) {
        var results = response.list
        console.log(response)
        for(var i = 0; i < results.length; i++){
      var forecastDate = moment(results[i].dt_txt).format("MM/DD/YYYY")
      
      //  console.log(forecastDate)
        
        if(forecastDate == date){
            console.log(forecastDate, date)
            var lowTemp = results[i].main.temp_min
            var highTemp = results[i].main.temp_max
            var humidity = results[i].main.humidity
            var rain = results[i].rain
            var forecast = results[i].weather[0].description
            var weather = $("<div>").html('<h4>Forecast</h4>' + 'Temp: ' + lowTemp + ' - ' + highTemp + '<br>' + forecast)
            whenDiv.append(weather)
        }
    }
      });
}






