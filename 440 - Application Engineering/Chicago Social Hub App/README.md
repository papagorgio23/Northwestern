Final Project - Chicago Social Hub Real-Time Analytics Application
================

``` bash
git clone https://github.com/papagorgio23/Northwestern.git
```

### Backend

``` bash
cd Northwestern/440\ -\ Application\ Engineering/Chicago\ Social\ Hub\ App/backend/
node server
```

### Frontend

``` bash
cd Northwestern/440\ -\ Application\ Engineering/Chicago\ Social\ Hub\ App/frontend/
ng serve
```

## Project Overview Statement:

In this project we will design and implement a web-based real-time
application for Divvy bikers that will allow them to search and chart
Yelp reviewed Chicago social places (restaurants, bars, coffee shops,
etc) and plot real-time available docks in near-by Divvy docking
stations on Chicago downtown area map; we will call our application
ChicagoSocialHub. The following sections document the technologies, data
sources, and the detailed requirements

## Technologies and Platforms:

The following is the list of technologies, platforms, and packages used
in the design and development of the ChicagoSocialHub real-time app:

1.  Angular 7 or higher  
2.  Node.js/Express  
3.  D3.js  
4.  Google Maps (AGM)  
5.  PostgreSQL – to store Divvy stations real-time status  
6.  ElasticSearch – to store Yelp reviews for Chicago Businesses  
7.  ElasticSearch – to create and store Divvy real-time logs and store  
    Divvy trips anonymized data  
8.  Chrome browser that is compliant with ECMAScript 2015 scripting
    2015, (ES6):
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes>.
    List of browsers/platforms that support ES6 can be found under
    modern browsers link on this URL:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript>

## Data Sources:

For this project there are two data sources that we will use for our
application:

1.  We will use Yelp business reviews (See Appendix A) to make
    recommendations for restaurants in Chicago downtown area that are
    highly reviewed and got at least 3-stars on Yelp.
      - Here is the URL for Yelp API:
        <https://www.yelp.com/developers/documentation/v3/get_started>  
      - Here is the URL for businesses search:
        <https://www.yelp.com/developers/documentation/v3/business_search>  
      - Here is the URL for the supported search categories:
        <https://www.yelp.com/developers/documentation/v3/all_ca>
        tegory\_list
2.  We will use Divvy real-time data (See Appendix B) about the status
    of their docking stations
      - Here is the URL for the real-time data they publish:
        <https://gbfs.divvybikes.com/gbfs/gbfs.json>  
      - Here is the URL for the real-time status for the docking
        stations:
        <https://gbfs.divvybikes.com/gbfs/en/station_status.json>  
      - Here is the URL for the information for the docking stations:
        <https://gbfs.divvybikes.com/gbfs/en/station_information.json>  
      - Here is the URL for the anonymized data for Divvy trips:
        <https://www.divvybikes.com/system-data>

## Architecture and High-Level Design:

The **Chicago Social Hub** real-time web-app has the architecture
detailed in the following diagram. Python scripts pulls data from Yelp
and Divvy and store the data on PostgreSQL server and ElasticSearch
server hosted on DSCC. Node/js/Express server receives requests from
Angular clients and access the database servers to collect data and send
the data back to Angular clients.

## Requirements specification:

You will design and develop a web-based real-time application that meets
the following requirements:

1.  Develop the infrastructure for the ChicagoSocialHub realt-ime web-
    app utilizing Yelp and Divvy APIs.  
2.  Use Node.js/Express to create the back-end application server  
3.  Use PostgreSQL and ElasticSearch for SQL and NoSQL databases to
    retrieve data  
4.  Use Google Maps to plot data for the Geospatial queries  
5.  Divvy bikers would like to search for places located on certain
    streets in Chicago downtown area and plot divvy nearest docking
    stations for a selected place on Google Map for Chicago downtown
    area.  
6.  Use Angular for to create the front-end (client-side) application  
7.  The app-user shall be able to specify the search conditions using
    two fields to represent the pair (business-category, street-name),
    for example, Italian on Wabash, steak on Rush, pizza on Michigan,
    etc. Your web-page shall look as follows:  
8.  The search results for top rated Yelp-reviewed places based on the
    specified filter by the app-user shall be displayed on a web-page.  
9.  The app-user shall be provided with the capability to view the real-
    time status for the near-by Divvy docking stations of the selected
    place along with Google map for the current location, the selected
    place location, and the nearest 3 Divvy docking stations of the
    selected place.  
10. The app-user shall be provided with the capability to view the bar-
    chart for yelp reviews.  
11. The app-user shall be provided with the capability to view the real-
    time line-chart for the status of the selected Divvy docking
    station. The Line-chart shall provide the app-user with the
    capability to select the time-range: past hour, past 24 hours, past
    7 days data.  
12. The app-user shall be provided with the capability to view the
    Simple Moving Average (past hour and past 24 hours) in a real-time
    line- chart for the status of the selected docking station. The
    Line-chart shall provide the app-user with the capability to select
    the time- range: past hour, past 24 hours, past 7 days data.  
13. The real-time line-chart for the status of the selected Divvy
    docking station shall be updated/refreshed automatically every 2
    minutes without the app-user manual refresh. The line-chart shall
    provide the app-user with the capability to select the time-range:
    past hour, past 24 hours, past 7 days data.  
14. Create real-time Heatmaps for Divvy docking stations. Divvy can
    utilize the HeatMap to decide at which stations to place a valet
    (<https://www.chicagotribune.com/redeye/redeye-divvy-stations-locations-20140901-story.html>)
    to make sure riders have spots to dock at stations popular for
    drop-offs  
15. The app-user shall be provided with the capability to view the
    Heatmap in a real-time for the status of the docking stations for
    the entire city of Chicago. The Heatmap shall provide the app-user
    with the capability to select the time-range: past hour, past 24
    hours, past 7 days data.  
16. The app-user shall be provided with the capability to use Divvy
    anonymized log data to view the count of Divvy hourly trips for
    every day of the week in order to analyze the chart patterns: double
    tops bar-chart for morning rush-hours and evening rush-hours. And
    the bell-curve bar-chart for the weekends or holiday days.

## Appendix A. Yelp Business Reviews

## Appendix B. Divvy Bikes and Docking Stations
