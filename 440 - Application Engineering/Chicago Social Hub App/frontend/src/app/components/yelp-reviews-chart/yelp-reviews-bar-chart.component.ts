import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Place } from '../../place';
import { PlacesService } from '../../places.service';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './yelp-reviews-bar-chart.component.html',
  styleUrls: ['./yelp-reviews-bar-chart.component.css']
})



        
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


export class BarChartComponent implements OnInit {

  title = "Yelp Reviews Chart";
  private places: Place[];
  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 150, left: 80};

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  
        
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  constructor(private placesService: PlacesService) {}


        
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  ngOnInit() {
      this.fetchPlaces();

  }

  
         
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

 
  fetchPlaces() {
    this.placesService
      .getPlaces()
      .subscribe((data: Place[]) => {
        this.places = data;
        let list_of_names = [];
        let list_of_places = [];
        for(let i=0; i<this.places.length;i++){
            let name = this.places[i].name;
            let review_count = this.places[i].review_count;
            if (list_of_names.includes(name)){
                name = ' '+name;
            }
            list_of_names.push(name);
            list_of_places.push({name:name,review_count:review_count});
        }
        this.places = list_of_places;
        console.log(this.places);
        this.initSvg();
        this.init_X_Y_Axis();
        this.create_X_Y_Axis();
        this.createBarChart(this.places);
      });
  }


        
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  private initSvg() {

      this.svg = d3.select('svg');
      this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
      this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
      this.g = this.svg.append('g')
                          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }


        
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  private init_X_Y_Axis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(.800);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, .099]);
    this.x.domain(this.places.map((d) => d.name));
    this.y.domain([0, d3Array.max(this.places, (d) => Number(d.review_count))]);
  }


        
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  private create_X_Y_Axis() {

    this.g.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(d3Axis.axisBottom(this.x))
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(60)")
                .style("text-anchor", "start");

    this.g.append('g')
                .attr('class', 'axis axis--y')
                .call(d3Axis.axisLeft(this.y))
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
                .text("Name");

    this.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 15)
                .attr("x", 0 - (this.height / 2))
                .style("text-anchor", "middle")
                .text("Review Count");

  }


        
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


  private createBarChart(data){
    //select all bars on the graph, take them out, and exit the previous data set.
    //then you can add/enter the new data set
    var bars = this.g.selectAll(".bar")
                          .remove()
                          .exit()
                          .data(data)

    //now actually give each rectangle the corresponding data
    bars.enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', (d) => this.x(d.name) )
                    .attr('y', (d) => this.y(d.review_count) )
                    .attr('width', this.x.bandwidth())
                    .attr('height', (d) => this.height - this.y(d.review_count) );
  }

}
