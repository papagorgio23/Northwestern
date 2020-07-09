////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////




import { Component, OnInit ,Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Station } from '../../station';
import { PlacesService } from '../../places.service';


import { Input, ViewChild, NgZone} from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Place } from 'src/app/place';


import { RealTimeLineComponent } from '../../components/real-time-line-chart/real-time-line-chart.component'
import { RealTimeSMALineComponent } from '../../components/real-time-sma-line-chart/real-time-sma-line-chart.component';




interface Location {
  lat: number;
  lng: number;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  label: string;
}



@Component({
  selector: 'app-list-of-stations',
  templateUrl: './list-of-stations.component.html',
  styleUrls: ['./list-of-stations.component.css']
})


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

export class ListOfStationsComponent implements OnInit {

  stations: Station[];
  markers: Station[];
  placeSelected: Place;
  timeLimit:string;

  displayedColumns = ['id', 'stationName', 'availableBikes', 'availableDocks', 'is_renting', 'lastCommunicationTime', 'latitude',  'longitude', 'status', 'totalDocks','ChartData','smachart'];


  icon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize: {
      width: 60,
      height: 60
    }
  }


  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  constructor(private placesService: PlacesService, private router: Router) { }



  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  ngOnInit() {
    this.getPlaceSelected();
    this.fetchStations();
  }



  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  fetchStations() {
    this.placesService
      .getStations()
      .subscribe((data: Station[]) => {
        this.stations = data;
        this.markers = data;

      });
  }



  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  getPlaceSelected() {
    this.placesService
      .getPlaceSelected()
      .subscribe((data: Place) => {
        this.placeSelected = data;

      });
  }


  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  getDivvyDailyTripsChart() {

    console.log('getting Divvy Trips chart')
    this.router.navigate(['/divvy_trips_chart']);
    
  }



  
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  getLineChart(stationName) {

    this.placesService.stationNameSelected = stationName;
    console.log(stationName);
    this.timeLimit = "1 HOUR";

    const realTimeLineChart = new RealTimeLineComponent(this.placesService);

    this.router.navigate(['/realtime_line_chart']);

    realTimeLineChart.create_d3_chart(stationName,this.placesService,this.timeLimit);

  }

  getSMALineChart(stationName) {

    this.placesService.stationNameSelected = stationName;
    console.log(stationName);
    this.timeLimit = "1 HOUR";

    const realTimeLineChart = new RealTimeSMALineComponent(this.placesService);

    this.router.navigate(['/realtime_line_chart']);

    realTimeLineChart.create_d3_chart(stationName,this.placesService,this.timeLimit);

  }
  

 

  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  clickedMarker(label: string, index: number) {

    console.log(`clicked the marker: ${label || index}`)
    
  }


  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  circleRadius:number = 3000; // km

  public location:Location = {
    lat: 41.882607,
    lng: -87.643548,
    label: 'You are Here',
    zoom: 13
  };



}
