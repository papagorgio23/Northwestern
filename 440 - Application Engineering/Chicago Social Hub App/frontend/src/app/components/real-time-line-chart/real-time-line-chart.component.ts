import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Time from 'd3-time-format';

import { Station } from '../../station';
import { Dock } from '../../dock';

import { PlacesService } from '../../places.service';
import { VERSION } from '@angular/material';


@Component({
    selector: 'app-real-time-line-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './real-time-line-chart.component.html',
    styleUrls: ['./real-time-line-chart.component.css']
})


export class RealTimeLineComponent implements OnInit {


     private margin = {top: 50, right: 20, bottom: 30, left: 150};
     private width: number;
     docks: Dock[];
     timeRangeSelected: string;

     stationSelected:Station;
     value:number;
     SMALineChart:Subscription;
     LineChart: Subscription;
     stationNameSelected: string;
     title: string;
     padding = 1;


     timeRanges = [
        { id : '1 HOUR', value: 'Past Hour'},
        { id : '24 HOUR', value: 'Last 24 Hours'},
        { id : '7 DAY', value: 'Last 7 Days'}
      ];

     private height: number;
     private x: any;
     private y: any;
     private svg: any;
     private line: d3Shape.Line<[number, number]>;
 
     private movingAverageLine1: d3Shape.Line<[number, number]>;
     private movingAverageLine: d3Shape.Line<[number, number]>;
     version = VERSION;


    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

     constructor(private placesService: PlacesService) {
         this.width = 900 - this.margin.left - this.margin.right;
         this.height = 500 - this.margin.top - this.margin.bottom;
     }


    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


     ngOnInit() {
       if (this.SMALineChart !== undefined) {
               this.SMALineChart.unsubscribe();
           }
         this.timeRangeSelected ="1 HOUR";
         this.stationNameSelected = this.placesService.stationNameSelected;
         this.title = 'Divvy Dock Station:    ' + this.stationNameSelected;
         this.createPriodicTaskToPullStationDataFromServer();

     }

    
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    changeTimeRangeSelected(data){
        this.build_d3_chart('#008000',0,this.timeRangeSelected);
    }

    

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    createPriodicTaskToPullStationDataFromServer(){

        if (this.SMALineChart !== undefined) {
                this.SMALineChart.unsubscribe();
        }

        this.placesService.getStationSelected().subscribe((data: Station) => {
          this.stationSelected = data;
          this.LineChart = this.placesService.pulledNewStationDocksDataFromServer(this.placesService.stationNameSelected, this.timeRangeSelected).subscribe(res => {
            this.create_d3_chart(this.placesService.stationNameSelected,this.placesService,this.timeRangeSelected);
          });
        });
    }

      
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    build_d3_chart(color,value,type){
      this.placesService.getStationSelected().subscribe((data: Station) => {
           this.stationSelected = data;
           this.create_d3_chart(this.stationSelected.stationName,this.placesService,this.timeRangeSelected);
      });

    }

        
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    create_d3_chart(stationName,placesService,timeRange) {
      if (this.SMALineChart !== undefined) {
               this.SMALineChart.unsubscribe();
      }

      this.stationNameSelected = stationName;
      this.title = 'Divvy Dock Station:    ' + this.stationNameSelected;
        
      placesService.getStationDocksLog(stationName,timeRange).subscribe(() => {
         this.fetchDocks(placesService,timeRange);
      });
    }


        
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    fetchDocks(placesService,timeRange) {

         placesService
           .getDocks()
              .subscribe((data: Dock[]) => {
                    this.docks = data;
                    console.log(this.docks);
                    this.updateChart();
                    this.initSvg();
                    this.initAxis();
                    this.create_d3_chart_legend(timeRange);
                    this.create_d3_chart_X_Y_Axis(timeRange);
                    this.create_d3_line();
              });
    }


    
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    private initSvg() {
         this.svg = d3.select('#svg')
             .append('g')
             .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    private initAxis() {
         this.x = d3Scale.scaleTime().range([0, this.width]);
         this.y = d3Scale.scaleLinear().range([this.height, 0]);

         this.x.domain(d3Array.extent(this.docks, (d) => new Date(d.lastCommunicationTime.replace(/-/g,'/').toString() )));
         this.y.domain([0, d3Array.max(this.docks, (d) => d.availableDocks)]);

    }


        
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    private setTimeIncrementFor_X_Axis(timeRange){
       if(timeRange=="1 HOUR"){
            this.svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3Axis.axisBottom(this.x)
            .ticks(d3.timeMinute.every(2)))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start")
       }
       else if(timeRange=="24 HOUR"){
                this.svg.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(d3Axis.axisBottom(this.x)
                .ticks(d3.timeHour.every(1)))
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(45)")
                .style("text-anchor", "start")
            }
            else if(timeRange=="7 DAY"){

                          this.svg.append('g')
                          .attr('class', 'axis axis--x')
                          .attr('transform', 'translate(0,' + this.height + ')')
                          .call(d3Axis.axisBottom(this.x)
                          .ticks(d3.timeHour.every(12)))
                          .selectAll("text")
                          .attr("y", 0)
                          .attr("x", 9)
                          .attr("dy", ".35em")
                          .attr("transform", "rotate(45)")
                          .style("text-anchor", "start")

                  }

    }



        
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    private create_d3_chart_X_Y_Axis(timeRange) {

        this.svg.append('g')
             .attr('class', 'axis axis--x')
             .attr('transform', 'translate(0,' + this.height + ')')
             .append('text')
             .attr('class', 'axis-title')
             .attr('text-anchor', 'middle')
             .attr('transform', 'translate(420,50)')
             .text('Time');

        this.setTimeIncrementFor_X_Axis(timeRange);

        this.svg.append('g')
             .attr('class', 'axis axis--y')
             .call(d3Axis.axisLeft(this.y))
             .append('text')
             .attr('class', 'axis-title')
             .attr("transform", "translate("+ 1 +","+(this.height/2)+")rotate(90)")  
             .attr('y', 35)
             .attr('dy', '.71em')
             .style('text-anchor', 'end')
             .text('Available Docks');
    }


    

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    private create_d3_line() {

        this.line = d3Shape.line()
             .x( (d: any) => this.x(new Date(d.lastCommunicationTime.replace(/-/g,'/').toString()) ))
             .y( (d: any) => this.y(d.availableDocks) );
        this.svg.append('path')
             .datum(this.docks)
             .attr('class', 'line')
             .attr('d', this.line);


    }

    

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    private create_d3_chart_legend(timeRange) {

      var legend = this.svg.append('g')
                              .attr("class", "legend")
                              .attr("x", 15)
                              .attr("y", 5)
                              .attr('transform','translate(860,5)')
                              .attr("width", 18)
                              .attr("height", 10)

      if(timeRange == "1 HOUR") {
              legend.append("rect")
                        .attr("class", "legend")
                        .attr("x", 1)
                        .attr("y", 5)
                        .attr("width", 15)
                        .attr("height", 7)
                        .style("fill", 'green');

              legend.append("text")
                        .attr("class", "legendTxt")
                        .style("font-size", "13px")
                        .attr("x", 20)
                        .attr("y", 5)
                        .attr("dy", "10px")
                        .style("text-anchor", "start")
                        .text("Real-Time Data" );
      }
      else if(timeRange == "24 HOUR") {
                  legend.append("rect")
                            .attr("class", "legend")
                            .attr("x", 1)
                            .attr("y", 5)
                            .attr("width", 15)
                            .attr("height", 7)
                            .style("fill", 'green');

                  legend.append("text")
                            .attr("class", "legendTxt")
                            .style("font-size", "13px")
                            .attr("x", 20)
                            .attr("y", 5)
                            .attr("dy", "10px")
                            .style("text-anchor", "start")
                            .text("Real-Time Data");
            }
            else if(timeRange == "7 DAY") {
                          legend.append("rect")
                                    .attr("class", "legend")
                                    .attr("x", 1)
                                    .attr("y", 5)
                                    .attr("width", 15)
                                    .attr("height", 7)
                                    .style("fill", 'green');

                          legend.append("text")
                                    .attr("class", "legendTxt")
                                    .style("font-size", "13px")
                                    .attr("x", 20)
                                    .attr("y", 5)
                                    .attr("dy", "10px")
                                    .style("text-anchor", "start")
                                    .text("Real-Time Data");
                  }

    }


    

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////


    private updateChart(){

       var chart = d3.select('#svg').select("g").remove().exit();


    }

    

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////



    ngOnDestroy() {

      if (this.LineChart !== undefined) {
              this.LineChart.unsubscribe();
      }

    }




}
