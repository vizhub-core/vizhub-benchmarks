// Import D3.js functions into the JavaScript environment.
import * as d3 from "https://d3js.org/d3.v7.min.js";
import {csv} from "d3-fetch";

// Helper functions for rendering a bar chart

const parseDate = d3.timeParse("%Y-%m-%d");

export const createSvgBarChart = (svg, margin, data) => {
  const width = svg.selectAll("rect").nodes()[0].width.baseVal.value;
  const height = svg.selectAll("rect").nodes()[0].height.baseVal.value;

  const xScale = d3.scaleTime()
    .domain([d3.min(data, d => parseDate(d.date)), d3.max(data, d => parseDate(d.date))])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.price)])
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%B"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d => "$" + d);

  svg.select(".x-axis")
    .remove();

  svg.select(".y-axis")
    .remove();

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  const bars = svg.selectAll("rect.bar")
    .data(data);

  bars.exit().remove();

  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(parseDate(d.date)))
    .attr("y", (d, i) => yScale(d.price))
    .attr("width", (d, i) => 40)
    .attr("height", (d, i) => height - yScale(d.price))
    .merge(bars)
    .transition()
    .duration(1000);

  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 0 - (margin.top / 2))
    .text("AAPL Stock Price Over Time");

  return {svg, yScale, xAxis};
};