import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import * as moment from 'moment'
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { divvyTripsCountPerDay } from '../../DivvyTripsCountPerDay';
import { PlacesService } from '../../places.service';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';

import { Router } from '@angular/router';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-divvy-trips-chart',
  templateUrl: './divvy-trips-chart.component.html',
  styleUrls: ['./divvy-trips-chart.component.css']
})
export class DivvyTripsChartComponent implements OnInit {

  divvyTripsCounts: divvyTripsCountPerDay[]=[];

  private margin = { top: 20, right: 100, bottom: 150, left: 100 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  collectDays = [];

  startDate;
  endDate;
  dates_of_week_days;

  chart_1_name:string;
  chart_2_name:string;
  chart_3_name:string;
  chart_4_name:string;
  chart_5_name:string;
  chart_6_name:string;
  chart_7_name:string;


  minDate: Date;
  maxDate: Date;
  date: Date;
  form: FormGroup;


  constructor(private placesService: PlacesService, private router: Router, private http: HttpClient,fb: FormBuilder) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.form = fb.group({
      date: [{begin: new Date(2018, 9, 1), end: new Date(2018, 9, 7)}]
    });

  }



  ngOnInit() {
      // Default display is for first week of 2018 fourth quarter

      this.minDate = new Date('10/1/2018');
      this.maxDate = new Date('12/31/2018');
      this.dates_of_week_days = this.getDates('2018-10-1','2018-10-7');
      console.log(this.dates_of_week_days);
   
      for (var i = 0; i < this.dates_of_week_days.length; i++) {
        var daydata = new Date(this.dates_of_week_days[i]).getDay()+1
        if(daydata == 7){
          daydata = 0;
        }
        this.getDivvyTripsCountsPerDay(daydata,new Date(this.dates_of_week_days[i]));
      }

      this.form.valueChanges.subscribe((res) =>{
            console.log('this.form.valueChanges selected');
            console.log('res.date.begin=', res.date.begin);
            console.log('res.date.end=', res.date.end);
            this.updateChart();
            this.collectDays=[];
            console.log(res);
            this.startDate = new Date(res.date.begin);
            this.endDate = new Date(res.date.end);
            this.dates_of_week_days = this.getDates(this.startDate,this.endDate);
            console.log(this.dates_of_week_days);
            for (var i = 0; i < this.dates_of_week_days.length; i++) {
              var daydata = new Date(this.dates_of_week_days[i]).getDay()+1
              if(daydata == 7){
                daydata = 0;
              }
            this.collectDays.push(daydata);
            console.log("length",this.collectDays.length);
            if(this.collectDays.length > 7){
              console.log("Select a week");
              console.log("datasliced",this.collectDays.slice(-7).pop());
            }else{
              this.getDivvyTripsCountsPerDay(daydata,new Date(this.dates_of_week_days[i]));
            }

          }
      });

  }


  getDivvyTripsCountsPerDay(day,selectedDate) {

      this.placesService.getDivvyTripsCountsPerDay(day,selectedDate).subscribe(() => {
          this.getDivvyTripsCounts(day);
      });

  }
    
  getDivvyTripsCounts(day) {

        if(day == 0){
          this.chart_7_name = 'Sunday';

           this.placesService
            .getDivvyTripsCountsForSunday()
            .subscribe((data: divvyTripsCountPerDay[]) => {
              this.divvyTripsCounts = data;

              console.log(this.divvyTripsCounts);
              var id="#svg"; this.initSvg(id);
              this.initAxis();
              this.drawAxis();
              this.updateChartBars(this.divvyTripsCounts);})
        }

        else if(day == 1){
          this.chart_1_name = 'Monday';
          this.placesService
            .getDivvyTripsCountsForMonday()
            .subscribe((data: divvyTripsCountPerDay[]) => {
              this.divvyTripsCounts = data;

              console.log(this.divvyTripsCounts);
              var id="#svg1"; this.initSvg(id);
              this.initAxis();
              this.drawAxis();
              this.updateChartBars(this.divvyTripsCounts);})
        }
        else if(day == 2){
          this.chart_2_name = 'Tuesday';
          this.placesService
            .getDivvyTripsCountsForTuesday()
            .subscribe((data: divvyTripsCountPerDay[]) => {
              this.divvyTripsCounts = data;

              console.log(this.divvyTripsCounts);
              var id="#svg2"; this.initSvg(id);
              this.initAxis();
              this.drawAxis();
              this.updateChartBars(this.divvyTripsCounts);})
        }


    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////


    /////////////     ADD YOUR CODE HERE      ///////////
    else if(day == 3){
      this.chart_3_name = 'Wednesday';
      this.placesService
        .getDivvyTripsCountsForWednesday()
        .subscribe((data: divvyTripsCountPerDay[]) => {
          this.divvyTripsCounts = data;

          console.log(this.divvyTripsCounts);
          var id="#svg3"; this.initSvg(id);
          this.initAxis();
          this.drawAxis();
          this.updateChartBars(this.divvyTripsCounts);})
    }
    else if(day == 4){
      this.chart_4_name = 'Thursday';
      this.placesService
        .getDivvyTripsCountsForThursday()
        .subscribe((data: divvyTripsCountPerDay[]) => {
          this.divvyTripsCounts = data;

          console.log(this.divvyTripsCounts);
          var id="#svg4"; this.initSvg(id);
          this.initAxis();
          this.drawAxis();
          this.updateChartBars(this.divvyTripsCounts);})
    }
    else if(day == 5){
      this.chart_5_name = 'Friday';
      this.placesService
        .getDivvyTripsCountsForFriday()
        .subscribe((data: divvyTripsCountPerDay[]) => {
          this.divvyTripsCounts = data;

          console.log(this.divvyTripsCounts);
          var id="#svg5"; this.initSvg(id);
          this.initAxis();
          this.drawAxis();
          this.updateChartBars(this.divvyTripsCounts);})
    }
    else if(day == 6){
      this.chart_6_name = 'Saturday';
      this.placesService
        .getDivvyTripsCountsForSaturday()
        .subscribe((data: divvyTripsCountPerDay[]) => {
          this.divvyTripsCounts = data;

          console.log(this.divvyTripsCounts);
          var id="#svg6"; this.initSvg(id);
          this.initAxis();
          this.drawAxis();
          this.updateChartBars(this.divvyTripsCounts);})
    }
    // Extend the else if block above to add and plot the charts for
    // Wednesday, Thursday, Friday, and Saturday
    

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    

  }

  private initSvg(id) {
        this.svg = d3.select(id);
        this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
        this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
        this.g = this.svg.append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }


  private initAxis() {
      this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.2);
      this.y = d3.scaleLinear().range([this.height, 0]).domain([0, 100]);
      this.x.domain(this.divvyTripsCounts.map((d) => d.hour_timestamp));
      this.y.domain([0, d3Array.max(this.divvyTripsCounts, (d) => Number(d.total_trips))]).nice();
  }


  private drawAxis() {

          this.g.append('g')
              .attr('class', 'axis axis--x')
              .attr('transform', 'translate(0,' + this.height + ')')
              .call(d3Axis.axisBottom(this.x)
              .ticks(d3.timeHour.every(1)))
              .selectAll("text")
              .attr("y", 0)
              .attr("x", 9)
              .attr("dy", ".35em")
              .attr("transform", "rotate(60)")
              .style("text-anchor", "start");
        
          this.g.append('g')
              .attr('class', 'axis axis--y')
              .call(d3Axis.axisLeft(this.y).ticks(10))
              .append("text")
              .attr("transform", "rotate(90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
              .text("Frequency");

          this.svg.append("text")
              .attr("x", this.width / 2 + 80)
              .attr("y", this.height + 85)
              .style("text-anchor", "middle")
              .text("");

          //text label for y axis
          this.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 58)
          .attr("x", 0 - (this.height / 2))
          //.attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Divvy Trips");
  }


  private updateChartBars(data){
    // Remove existing Bars
  	var bars = this.g.selectAll(".bar")
  					.remove()
  					.exit()
  					.data(data)

  	// Create new rectangle/bar
    bars.enter().append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => this.x(d.hour_timestamp) )
    .attr('y', (d) => this.y(d.total_trips) )
    .attr('width', this.x.bandwidth())
    .attr('height', (d) => this.height - this.y(d.total_trips) );
  }


  
  getDates(fromDate, toDate) {
    var dates = [];
    var startDate = moment(fromDate);
    var endDate = moment(toDate);
    while (startDate <= endDate) {
        dates.push( moment(startDate).format('YYYY-MM-DD') )
        startDate = moment(startDate).add(1, 'days');
    }
    return dates;
  }

  private updateChart(){
     d3.select('#svg').select("g").remove().exit();
     d3.select('#svg1').select("g").remove().exit();
     d3.select('#svg2').select("g").remove().exit();
     d3.select('#svg3').select("g").remove().exit();
     d3.select('#svg4').select("g").remove().exit();
     d3.select('#svg5').select("g").remove().exit();
     d3.select('#svg6').select("g").remove().exit();

  }



}
