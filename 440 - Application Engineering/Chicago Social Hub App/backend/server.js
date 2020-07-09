////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/27/2019



////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//////////////////////              SETUP NEEDED                ////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

//  Install Nodejs (the bundle includes the npm) from the following website:
//      https://nodejs.org/en/download/


//  Before you start nodejs make sure you install from the
//  command line window/terminal the following packages:
//      1. npm install express
//      2. npm install pg
//      3. npm install pg-format
//      4. npm install moment --save
//      5. npm install elasticsearch


//  Read the docs for the following packages:
//      1. https://node-postgres.com/
//      2.  result API:
//              https://node-postgres.com/api/result
//      3. Nearest Neighbor Search
//              https://postgis.net/workshops/postgis-intro/knn.html
//      4. https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html
//      5. https://momentjs.com/
//      6. http://momentjs.com/docs/#/displaying/format/


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


const express = require('express');

var pg = require('pg');

var bodyParser = require('body-parser');

const moment = require('moment');


// Connect to elasticsearch Server

const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
//  host: '127.0.0.1:9200',
  host: 'http://chicago:msdsdata@129.105.88.91:9200',
  log: 'error'
});


// Connect to PostgreSQL server

var conString = "pg://chicago:msdsdata@129.105.208.229:5432/chicago_divvy_stations_status";
var pg_connection_divvy_trips = "pg://chicago:msdsdata@129.105.208.229:5432/chicago_divvy_trips";




var pgClient = new pg.Client(conString);
pgClient.connect();

var pgClientForDivvyTrips = new pg.Client(pg_connection_divvy_trips);
pgClientForDivvyTrips.connect();



const app = express();
const router = express.Router();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

router.all('*', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});



var places_found = [];
var stations_found = [];
var docks_found = [];
var all_docks_found=[];

var place_selected;
var station_selected;
var allRecords = [];
var isBeginningOfTimeRangeSet = false;

var go_back_in_time_var;
var go_forward_in_time_var;
var time_stamp_var_0;
var time_stamp_var_1;
var time_stamp_var_2;
var time_stamp_var_3;
var time_stamp_var_4;



const PAST_HOUR =  'Past Hour';
const PAST_24_HOURS =  'Last 24 Hours';
const PAST_7_DAYS =  'Last 7 Days';

const SUNDAY    = 0;
const MONDAY    = 1;
const TUESDAY   = 2;
const WEDNESDAY = 3;
const THURSDAY  = 4;
const FRIDAY    = 5;
const SATURDAY  = 6;




var dailyTrips = [];  



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

//////   The following are the routes received from NG/Browser client        ////////

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



router.route('/places').get((req, res) => {

    res.json(places_found)

});



router.route('/place_selected').get((req, res) => {

    res.json(place_selected)

});

router.route('/station_selected').get((req, res) => {

    res.json(station_selected)

});



router.route('/allPlaces').get((req, res) => {

    res.json(places_found)

});







router.route('/stations').get((req, res) => {

    res.json(stations_found)

});

router.route('/docks').get((req, res) => {


    res.json(docks_found)

});




router.route('/places/find').post((req, res) => {

    var str = JSON.stringify(req.body, null, 4);


    find_places_from_yelp(req.body.find, req.body.where).then(function (response) {
        var hits = response;
        res.json(places_found);
    });

});


router.route('/stations/getdocks').post((req, res) => {

    var str = JSON.stringify(req.body, null, 4);

    for (var i = 0,len = stations_found.length; i < len; i++) {

        if ( stations_found[i].stationName === req.body.placeName ) { // strict equality test

            station_selected = stations_found[i];

            timeRange = req.body.timeRange;

            break;
        }
    }


    get_divvy_station_log(req.body.placeName, req.body.timeRange).then(function (response) {
        var hits = response;
        res.json(docks_found);
    });

});





router.route('/stations/find').post((req, res) => {

    var str = JSON.stringify(req.body, null, 4);

    for (var i = 0,len = places_found.length; i < len; i++) {

        if ( places_found[i].name === req.body.placeName ) { // strict equality test

            place_selected = places_found[i];

            break;
        }
    }

    const query = {
        // give the query a unique name
        name: 'fetch-divvy',
        text: ' SELECT * FROM divvy_stations_realtime_status ORDER BY (divvy_stations_realtime_status.where_is <-> ST_POINT($1,$2)) LIMIT 3',
        values: [place_selected.latitude, place_selected.longitude]
    }

    find_stations_from_divvy(query).then(function (response) {
        var hits = response;
        res.json({'stations_found': 'Successfully Retrieved'});
    });


});

router.route('/stations/fetch_all_divvy_stations_data').post((req, res) => {

    get_all_divvy_stations_log(req.body.timeRange,req.body.newTimeRangeSelection).then(function (response) {
        var hits = response;

        res.json(all_docks_found);
    });




});


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

/////////       Get Divvy Trips Per Day                   //////////

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////



router.route('/getDivvyTripsCountsSunday').get((req, res) => {

  res.json(dailyTrips[SUNDAY])

});

router.route('/getDivvyTripsCountsForMonday').get((req, res) => {

  res.json(dailyTrips[MONDAY])

});

router.route('/getDivvyTripsCountsForTuesday').get((req, res) => {

  res.json(dailyTrips[TUESDAY])

});

router.route('/getDivvyTripsCountsForWednesday').get((req, res) => {

  res.json(dailyTrips[WEDNESDAY])

});

router.route('/getDivvyTripsCountsForThursday').get((req, res) => {

  res.json(dailyTrips[THURSDAY])

});

router.route('/getDivvyTripsCountsForFriday').get((req, res) => {

  res.json(dailyTrips[FRIDAY])

});

router.route('/getDivvyTripsCountsForSaturday').get((req, res) => {

  res.json(dailyTrips[SATURDAY])

});



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

/////////       Count Divvy Trips Per Day                 //////////

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////


router.route('/countDivvyTripsPerDay').post((req, res) => {
  var day = req.body.day;
  var selectedDate = req.body.selectedDate;
  selectedDate = selectedDate.replace('T', " ");
  selectedDate = selectedDate.replace('.000Z', " ");
  const query = {
      // give the query a unique name
      name: 'fetch-count-'+day,
      text:' SELECT * FROM (SELECT COUNT (DISTINCT bikeid) AS total_trips, EXTRACT(DOW FROM start_time) as day ,date_trunc($2, start_time) as hour_timestamp,max(date_trunc($3, start_time)) as daydt FROM divvy_trips group by day,hour_timestamp) as tb WHERE day= $1 and daydt = $4::timestamp',
      values: [day,'hour','day',selectedDate]
  }

  if(day == SUNDAY){
    dailyTrips[SUNDAY]=[];
    getDailyTrips(SUNDAY, query).then(function (response) {
        var hits = response;
        res.json({'SUNDAY': 'Successfully Retrieved'});
    });
  }
  else if(day == MONDAY){
        dailyTrips[MONDAY]=[];
        getDailyTrips(MONDAY, query).then(function (response) {
          var hits = response;
          res.json({'MONDAY': 'Successfully Retrieved'});
        });
  }
  else if(day == TUESDAY){
        dailyTrips[TUESDAY]=[];
        getDailyTrips(TUESDAY, query).then(function (response) {
          var hits = response;
          res.json({'TUESDAY': 'Successfully Retrieved'});
      });
  }
  else if(day == WEDNESDAY){
      dailyTrips[WEDNESDAY]=[];
      getDailyTrips(WEDNESDAY, query).then(function (response) {
        var hits = response;
        res.json({'WEDNESDAY': 'Successfully Retrieved'});
    });
  }
  else if(day == THURSDAY){
      dailyTrips[THURSDAY]=[];
      getDailyTrips(THURSDAY, query).then(function (response) {
        var hits = response;
        res.json({'THURSDAY': 'Successfully Retrieved'});
    });
  }
  else if(day == FRIDAY){
      dailyTrips[FRIDAY]=[];
      getDailyTrips(FRIDAY, query).then(function (response) {
        var hits = response;
        res.json({'FRIDAY': 'Successfully Retrieved'});
    });
  }
  else if(day == SATURDAY){
      dailyTrips[SATURDAY]=[];
      getDailyTrips(SATURDAY, query).then(function (response) {
        var hits = response;
        res.json({'SATURDAY': 'Successfully Retrieved'});
    });
  }



});



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

////////////////////    Get Divvy - Daily Trips on PostgreSQL       /////////////////

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


async function getDailyTrips(dayIndex, query) {
	const response = await pgClientForDivvyTrips.query(query);


    for (i = 0; i < response.rows.length; i++) {

         plainTextDateTime =  moment(response.rows[i].hour_timestamp).format('YYYY-MM-DD, h:mm:ss a');


        var countofdept = {

                    "total_trips": response.rows[i].total_trips,
                    "hour_timestamp": plainTextDateTime,
                    "day": response.rows[i].day

        };

        dailyTrips[dayIndex].push(countofdept);

    }
}






/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

////////////////////    Divvy - PostgreSQL - Client API            /////////////////

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


async function find_stations_from_divvy(query) {
	const response = await pgClient.query(query);

  stations_found = [];

    for (i = 0; i < 3; i++) {

         plainTextDateTime =  moment(response.rows[i].lastcommunicationtime).format('YYYY-MM-DD, h:mm:ss a');


        var station = {
                    "id": response.rows[i].id,
                    "stationName": response.rows[i].stationname,
                    "availableBikes": response.rows[i].availablebikes,
                    "availableDocks": response.rows[i].availabledocks,
                    "is_renting": response.rows[i].is_renting,
                    "lastCommunicationTime": plainTextDateTime,
                    "latitude": response.rows[i].latitude,
                    "longitude": response.rows[i].longitude,
                    "status": response.rows[i].status,
                    "totalDocks": response.rows[i].totaldocks
        };

        stations_found.push(station);

    }


}
async function find_docks_from_divvyStations(query) {
	const response = await pgClient.query(query);


    docks_found = [];


    for (i = 0; i < response.rows.length; i++) {
		 //console.log(response.rows[i].lastcommunicationtime);

         plainTextDateTime =  moment(response.rows[i].lastcommunicationtime).format('YYYY-MM-DD, h:mm:ss a');


        var docks = {

                    "availableDocks": response.rows[i].availabledocks,
                    "lastCommunicationTime": plainTextDateTime,

        };

        docks_found.push(docks);

    }


}




/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

////////////////////    Yelp - ElasticSerch - Client API            /////////////////

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



async function find_places_from_yelp(place, where) {

    places_found = [];

//////////////////////////////////////////////////////////////////////////////////////
// Using the business name to search for businesses will leead to incomplete results
// better to search using categorisa/alias and title associated with the business name
// For example one of the famous places in chicago for HotDogs is Portillos
// However, it also offers Salad and burgers
// Here is an example of a busness review from Yelp for Pertilos
//               alias': 'portillos-hot-dogs-chicago-4',
//              'categories': [{'alias': 'hotdog', 'title': 'Hot Dogs'},
//                             {'alias': 'salad', 'title': 'Salad'},
//                             {'alias': 'burgers', 'title': 'Burgers'}],
//              'name': "Portillo's Hot Dogs",
//////////////////////////////////////////////////////////////////////////////////////


    let body = {
        size: 1000,
        from: 0,
        "query": {
          "bool" : {
            "must" : {
               "term" : { "categories.alias" : place }
            },


            "filter": {
                "term" : { "location.address1" : where  }
            },


            "must_not" : {
              "range" : {
                "rating" : { "lte" : 3 }
              }
            },

            "must_not" : {
              "range" : {
                "review_count" : { "lte" : 500 }
              }
            },

            "should" : [
              { "term" : { "is_closed" : "false" } }
            ],
          }
        }
    }


    results = await esClient.search({index: 'chicago_yelp_reviews', body: body});
    //console.log(results)
    results.hits.hits.forEach((hit, index) => {


        var place = {
                "name": hit._source.name,
                "display_phone": hit._source.display_phone,
                "address1": hit._source.location.address1,
                "is_closed": hit._source.is_closed,
                "rating": hit._source.rating,
                "review_count": hit._source.review_count,
                "latitude": hit._source.coordinates.latitude,
                "longitude": hit._source.coordinates.longitude
        };

        places_found.push(place);

    });


}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

///////    Fetch Divvy Stations' Logs from ElasticSearch                     ////////   
///////    Based on the time-window selected                                 ////////
///////    Time-window : 1 Hour, 24 Hours, 7 Days                            ////////

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



async function get_all_divvy_stations_log(timeRange, newTimeRangeSelection) {
  var start_datetime_var = new Date();
  var scrollVal;


  all_docks_found = [];

  if(timeRange.includes(PAST_HOUR)){
    if(newTimeRangeSelection){
      isBeginningOfTimeRangeSet = false;

    }

    if(!isBeginningOfTimeRangeSet){

      all_docks_found = [];

      isBeginningOfTimeRangeSet = true;

      var start_datetime_var = new Date();
      var start_datetime_var_2 = new Date();
      var targetTime = new Date(start_datetime_var);
      var tzDifference = targetTime.getTimezoneOffset();

      //convert the offset to milliseconds, add to targetTime, and make a new Date
      start_datetime_var = new Date(targetTime.getTime() - tzDifference * 60 * 1000);
      start_datetime_var_2 = new Date(targetTime.getTime() - tzDifference * 60 * 1000);
      go_back_in_time_var = start_datetime_var.getHours() - 1;

      start_datetime_var_2.setHours(go_back_in_time_var);
      time_stamp_var_2 = start_datetime_var_2.toISOString().slice(0,-5).replace('Z', ' ').replace('T', ' ');

      time_stamp_var_1 = start_datetime_var.toISOString().slice(0,-5).replace('Z', ' ').replace('T', ' ');
      time_stamp_var_4  = new Date(new Date(time_stamp_var_2).getTime() - new Date(time_stamp_var_2).getTimezoneOffset() * 60 * 1000);

      var go_forward_in_time_var_2 = time_stamp_var_4 .getMinutes() + 2 ;
      time_stamp_var_4 .setMinutes(go_forward_in_time_var_2);

      time_stamp_var_3 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);

      time_stamp_var_1 = start_datetime_var.toISOString().slice(0,-5).replace('Z', ' ').replace('T', ' ');


      sizeVal = 1000000;
      scrollVal='1s';
    }

  }



  else if(timeRange  == PAST_24_HOURS ){

        if(newTimeRangeSelection){
          isBeginningOfTimeRangeSet = false;
        }


        if(! isBeginningOfTimeRangeSet){

          isBeginningOfTimeRangeSet = true;
          var start_datetime_var = new Date();
          var start_datetime_var_2 = new Date();
          var targetTime = new Date(start_datetime_var);
          var tzDifference = targetTime.getTimezoneOffset();

          //convert the offset to milliseconds, add to targetTime, and make a new Date
          start_datetime_var = new Date(targetTime.getTime() - tzDifference * 60 * 1000);
          start_datetime_var_2 = new Date(targetTime.getTime() - tzDifference * 60 * 1000);

          go_back_in_time_var = start_datetime_var.getHours() - 24;

          start_datetime_var_2.setHours(go_back_in_time_var);
          time_stamp_var_2 = start_datetime_var_2.toISOString().slice(0,-5).replace('Z', ' ').replace('T', ' ');
          time_stamp_var_4  = new Date(new Date(time_stamp_var_2).getTime() - new Date(time_stamp_var_2).getTimezoneOffset() * 60 * 1000);

          var go_forward_in_time_var_2 = time_stamp_var_4 .getHours() + 1 ;
          time_stamp_var_4 .setHours(go_forward_in_time_var_2);

          time_stamp_var_3 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);

          time_stamp_var_1 = start_datetime_var.toISOString().slice(0,-5).replace('Z', ' ').replace('T', ' ');

          // Recalculate lower bound for the time-window
          // Take 2 minutes sample on the top of every hour for the past 24 hours
          // This is NOT the best we could do..
          // We can calculate the average for every hour and use that 
          // as the average sample for the heatmap to display 
          time_stamp_var_4  = new Date(new Date(time_stamp_var_3).getTime() - new Date(time_stamp_var_3).getTimezoneOffset() * 60 * 1000);

          diffMinutes = time_stamp_var_4 .getMinutes() - 2 ;
          time_stamp_var_4 .setMinutes(diffMinutes);

          time_stamp_var_2 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);
          

          sizeVal = 300;
          scrollsize = 10000;
          scrollVal='15s';
        }
  }



  else if(timeRange.includes(PAST_7_DAYS)){

          if(newTimeRangeSelection){  
            isBeginningOfTimeRangeSet = false;
  
          }


          if(! isBeginningOfTimeRangeSet){

            isBeginningOfTimeRangeSet = true;
            var start_datetime_var = new Date();
            var start_datetime_var_2 = new Date();
            var targetTime = new Date(start_datetime_var);
            var tzDifference = targetTime.getTimezoneOffset();



            //convert the offset to milliseconds, add to targetTime, and make a new Date
            start_datetime_var = new Date(targetTime.getTime() - tzDifference * 60 * 1000);
            start_datetime_var_2 = new Date(targetTime.getTime() - tzDifference * 60 * 1000);

            go_back_in_time_var = start_datetime_var.getHours() - 168;

            start_datetime_var_2.setHours(go_back_in_time_var);
            time_stamp_var_2 = start_datetime_var_2.toISOString().slice(0,-5).replace('Z', ' ').replace('T', ' ');

            time_stamp_var_1 = start_datetime_var.toISOString().slice(0,-5).replace('Z', ' ').replace('T', ' ');
            time_stamp_var_4  = new Date(new Date(time_stamp_var_2).getTime() - new Date(time_stamp_var_2).getTimezoneOffset() * 60 * 1000);

            var go_forward_in_time_var_2 = time_stamp_var_4 .getHours() + 24 ;
            time_stamp_var_4 .setHours(go_forward_in_time_var_2);

            time_stamp_var_3 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);

            time_stamp_var_1 = start_datetime_var.toISOString().slice(0,-5).replace('Z', ' ').replace('T', ' ');


            // Recalculate lower bound fo the time-window
            // Take 2 minutes sample on the top of every hour of every day for the past 7 days
            // This is NOT the best we could do...
            // We can calculate the average for every hour and use that 
            // as the average sample for the heatmap to display 
            time_stamp_var_4  = new Date(new Date(time_stamp_var_3).getTime() - new Date(time_stamp_var_3).getTimezoneOffset() * 60 * 1000);

            diffMinutes = time_stamp_var_4 .getMinutes() - 2 ;
            time_stamp_var_4 .setMinutes(diffMinutes);

            time_stamp_var_2 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);

            sizeVal = 100000;
            scrollVal='15s';
          }
  }



    
    results = await esClient.search({
      index: 'divvy_station_logs',
      type: 'log',
      scroll: scrollVal,
      //  search_type : 'scan',
      size: 1000000,
      from: 0,
      body: {

         query: {
           "bool":{
          "filter":
            {
          "bool" : {
            "must" :[
              {
              "range" : {
                "lastCommunicationTime.keyword" : {
                  "gte": time_stamp_var_2,
                  "lt": time_stamp_var_3
                  }
              }
              }
            ]
          }
          }
      }
    }, "sort": [
                { "lastCommunicationTime.keyword":   { "order": "desc" }},

            ]
      }
    });


    
  // collect all the records

  // console.log('results.hits.total = ', results.hits.total);

  results.hits.hits.forEach(function (hit) {
    allRecords.push(hit);
    var docks = {
                "availableDocks": hit._source.availableDocks,
                "latitude": hit._source.latitude,
                "longitude": hit._source.longitude
        };
      all_docks_found.push(docks);
  });


            
  // Adjust lower bound and upper bound for the time-window
  // for data collection for the next round from ElasticSearch

    if(timeRange.includes(PAST_HOUR)){
        time_stamp_var_2 = time_stamp_var_3;

        time_stamp_var_4  = new Date(new Date(time_stamp_var_2).getTime() - new Date(time_stamp_var_2).getTimezoneOffset() * 60 * 1000);

        diffMinutes = time_stamp_var_4 .getMinutes() + 2 ;
        time_stamp_var_4 .setMinutes(diffMinutes);

        time_stamp_var_3 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);
    }


  else if(timeRange == PAST_24_HOURS){

    time_stamp_var_2 = time_stamp_var_3;

    time_stamp_var_4  = new Date(new Date(time_stamp_var_2).getTime() - new Date(time_stamp_var_2).getTimezoneOffset() * 60 * 1000);

    go_forward_in_time_var = time_stamp_var_4 .getHours() + 1 ;
    time_stamp_var_4 .setHours(go_forward_in_time_var);

    time_stamp_var_3 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);

    // Recalculate lower bound fo the time-window
    // Take 2 minutes sample on the top of every hour for the past 24 hours
    // This is NOT the best we could do..
    // We can calculate the average for every hour and use that 
    // as the average sample for the heatmap to display 
    time_stamp_var_4  = new Date(new Date(time_stamp_var_3).getTime() - new Date(time_stamp_var_3).getTimezoneOffset() * 60 * 1000);

    diffMinutes = time_stamp_var_4 .getMinutes() - 2 ;
    time_stamp_var_4 .setMinutes(diffMinutes);

    time_stamp_var_2 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);


  }


  else if(timeRange == PAST_7_DAYS){


    time_stamp_var_2 = time_stamp_var_3;

    time_stamp_var_4  = new Date(new Date(time_stamp_var_2).getTime() - new Date(time_stamp_var_2).getTimezoneOffset() * 60 * 1000);

    go_forward_in_time_var = time_stamp_var_4 .getHours() + 24 ;
    time_stamp_var_4 .setHours(go_forward_in_time_var);

    time_stamp_var_3 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);



    // Recalculate lower bound fo the time-window
    // Take 2 minutes sample on the top of every hour of every day for the past 7 days
    // This is NOT the best we could do...
    // We can calculate the average for every hour and use that 
    // as the average sample for the heatmap to display 
    time_stamp_var_4  = new Date(new Date(time_stamp_var_3).getTime() - new Date(time_stamp_var_3).getTimezoneOffset() * 60 * 1000);

    diffMinutes = time_stamp_var_4 .getMinutes() - 2 ;
    time_stamp_var_4 .setMinutes(diffMinutes);

    time_stamp_var_2 = time_stamp_var_4 .toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);
 

  }
  


}




////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


async function get_divvy_station_log(stationName, timeRange) {
  if(timeRange==='1 HOUR'){
    var deduction = 60 * 60 * 1000; /* ms */
  }
  else if(timeRange==='24 HOUR'){
    var deduction = 24 * 60 * 60 * 1000; /* ms */
  }
  else if(timeRange==='7 DAY'||'7 Day'){
    var deduction = 7*24 * 60 * 60 * 1000; /* ms */
  }
  else{
    console.log("Not a valid time limit");
  }


  var date =new Date();
  var newDate = new Date(date - date.getTimezoneOffset() * 6e4);
  var one = new Date(newDate.getTime()-deduction);

  time_stamp_var_1 = newDate.toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);
  time_stamp_var_0 = one.toISOString().replace('Z', '').replace('T', ' ').slice(0, -4);


    docks_found = [];
    let body = {
        size: 100000,
        from: 0,
        "query": {

           "bool":{
          "filter":
            {
          "bool" : {
            "must" :[ {
               "match" : { "stationName.keyword" : stationName }

            },
            {
              "range" : {
                "lastCommunicationTime.keyword" : {
                  "gte": time_stamp_var_0,
                  "lt": time_stamp_var_1
                }
              }
            }
          ]
        }


      }

    }


  },
  "sort": [
       { "lastCommunicationTime.keyword":   { "order": "desc" }},

   ]

    }


    results = await esClient.search({index: 'divvy_station_logs', body: body});
    results.hits.hits.forEach((hit, index) => {

      var docks = {
                  "stationName": hit._source.stationName,
                  "availableDocks": hit._source.availableDocks,
                  "lastCommunicationTime": hit._source.lastCommunicationTime,

      };



        docks_found.push(docks);

    });


}



app.use('/', router);

app.listen(4000, () => {

            for (var i=0;i<7;i++) {
              dailyTrips[i] = [];
            }

            console.log('Make sure you execute following command before you start the Angular client');

            console.log('');            
            console.log('--------------------------------------------------------');

            console.log('curl -H "Content-Type: application/json" -XPUT "http://localhost:9200/divvy_station_logs/_settings"  -d "{\"index\":{\"max_result_window\":10000000}}"');

            console.log('--------------------------------------------------------');
            console.log('');

            console.log('Express server running on port 4000')
});
