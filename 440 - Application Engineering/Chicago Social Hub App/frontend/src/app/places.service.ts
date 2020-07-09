////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';



import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { Place } from './place';
import { Station } from './station';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  uri = 'http://localhost:4000';
  Emmiter;
  time_interval;
  stationNameSelected = 'None';

  
  constructor(private http: HttpClient) {


  }


  getPlaces() : Observable<Place[]> {
    return this.http.get<Place[]>(`${this.uri}/places`);
  }


  getPlaceSelected() {
    return this.http.get(`${this.uri}/place_selected`);
  }
  getStationSelected() {
    return this.http.get(`${this.uri}/station_selected`);
  }


  getStations() {
    return this.http.get(`${this.uri}/stations`);
  }

  getDocks() {
    return this.http.get(`${this.uri}/docks`);
  }





////////////////////////////////////////////////////////////////////////////////////
///                                                                              ///
///   This function will get all Divvy stations data from the App server         ///
///    The app server collects Divvy Logs that are stored on ElasticSearch       ///                              ///
///                                                                              ///
////////////////////////////////////////////////////////////////////////////////////

  get_all_divvy_stations_data(timeRange, newTimeRangeSelection){
    const find_stations_at = {

      timeRange:timeRange,
      newTimeRangeSelection: newTimeRangeSelection

    };

    var str = JSON.stringify(find_stations_at, null, 2);


    return this.http.post(`${this.uri}/stations/fetch_all_divvy_stations_data`, find_stations_at, httpOptions);

  }




  findPlaces(find, where) {
    const find_places_at = {
      find: find,
      where: where
    };

    return this.http.post(`${this.uri}/places/find`, find_places_at, httpOptions);

  }




  findStations(placeName) {
    const find_stations_at = {
      placeName: placeName
    };

    var str = JSON.stringify(find_stations_at, null, 2);


    return this.http.post(`${this.uri}/stations/find`, find_stations_at, httpOptions);

  }
  
  getStationDocksLog(placeName,timeRange) {
    const find_stations_at = {
      placeName: placeName,
      timeRange:timeRange
    };

    var str = JSON.stringify(find_stations_at, null, 2);

    return this.http.post(`${this.uri}/stations/getdocks`, find_stations_at, httpOptions);

  }



  pulledNewStationDocksDataFromServer = (stationName, timeRange): Observable<Station[]> => {

    return Observable.create(observer => {
      this.Emmiter = observer;
      this.time_interval = setInterval(() => {
        observer.next({

         getStationDocksLog(placeName,timeRange) {
           const find_stations_at = {
             placeName: placeName,
             timeRange:timeRange
           };

           var str = JSON.stringify(find_stations_at, null, 2);

           return this.http.post(`${this.uri}/stations/getdocks`, find_stations_at, httpOptions);

         }
         });
    }, 30000);
    });
  }


    destroy(){
      if(this.time_interval){
        clearInterval(this.time_interval);
      }
      if(this.Emmiter){
        this.Emmiter.complete();
      }
    }



    ///////////////////////////////////////////////////////////////////

    getDivvyTripsCountsPerDay(day,selectedDate){
      const find_stations_at = {
        day: day,
        selectedDate:selectedDate
      };
  
      var str = JSON.stringify(find_stations_at, null, 2);
  
  
      return this.http.post(`${this.uri}/countDivvyTripsPerDay`, find_stations_at, httpOptions);
    }



    getDivvyTripsCountsForSunday() {
      return this.http.get(`${this.uri}/getDivvyTripsCountsSunday`);
    }
    getDivvyTripsCountsForMonday() {
      return this.http.get(`${this.uri}/getDivvyTripsCountsForMonday`);
    }
    getDivvyTripsCountsForTuesday() {
      return this.http.get(`${this.uri}/getDivvyTripsCountsForTuesday`);
    }
    getDivvyTripsCountsForWednesday() {
      return this.http.get(`${this.uri}/getDivvyTripsCountsForWednesday`);
    }
    getDivvyTripsCountsForThursday() {
      return this.http.get(`${this.uri}/getDivvyTripsCountsForThursday`);
    }
    getDivvyTripsCountsForFriday() {
      return this.http.get(`${this.uri}/getDivvyTripsCountsForFriday`);
    }
    getDivvyTripsCountsForSaturday() {
      return this.http.get(`${this.uri}/getDivvyTripsCountsForSaturday`);
    }

    


}
