

var eventBriteToken = 'H3LGM754AS3WAX5USJYR'
var googleApiKey = 'AIzaSyAoSUvf9nkYuSYOhZbwtCjt1THHC9V0KGo'
var seatGeekid = 'MTEwMzkzNDZ8MTUyMjM2NDA5NS41Mw'
var seatGeekkey = '094349186bab82b92cda01baee0176b6a15cb2703a3b630c1108bc73ba7a66d3'
var qYoutube = "kanye"
var qEventBrite;
var qSeatGeek = "concert"
var googleUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + qYoutube + '&type=video&videoEmbeddable=true&key=' + googleApiKey
var eventBriteurl = 'https://www.eventbriteapi.com/v3/events/search/?token=H3LGM754AS3WAX5USJYR&q=' + qEventBrite
var seatGeekurl = 'https://api.seatgeek.com/2/events?taxonomies.name=' + qSeatGeek + '&client_id=' + seatGeekid + '&client_secret=' + seatGeekkey


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

/// SEATGEEK
 $.ajax({
     method: 'GET',
     url: seatGeekurl,
     async: true,
    crossDomain: true,
    headers: {}
 }).done(function(response){
     var results = response.events
     console.log(results)
     for(i = 0; i < results.length; i++){
         for(j = 0; j < results[i].performers.length; j++){
             var performer = results[i].performers[j].name
             var performers = [];
             performers.push(performer)
         }
         console.log(performers)
        var title = results[i].title;
        var date = results[i].datetime_local;
        var performers = results[i].performers
        var resultDiv = $('<div>').html(date)
         var resultPanel = $('<div class="panel panel-default">')
         var panelHeading = $('<div class="panel-heading">').text(title).appendTo(resultPanel)
         var panelBody = $('<div class="panel-body">').append(resultDiv)
      
         panelBody.appendTo(resultPanel)
         
         $('#results').append(resultPanel)
     }
 }) 

 /* YOUTUBE
 $.ajax({
    method: 'GET',
    url: googleUrl,
    async: true,
   crossDomain: true,
   headers: {}
}).done(function(response){
    var results = response.items
    console.log(results)
    for(i=0; i<results.length; i++){
      var id =  results[i].id.videoId;
      var videoUrl = 'https://www.youtube.com/embed/' + id
     var video = $('<iframe>').attr({src: videoUrl, width: '200', height: '300'})
     $('#results').append(video)
    }
})
*/


})



