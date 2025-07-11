Here is the updated code:

**index.html**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Stock Price Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    /* Add basic CSS styling for the chart, axes, labels, title */
    body { font-family: sans-serif; }
    .bar { fill: steelblue; }
    .bar-label { fill: black; text-anchor: middle; font-size: 10px; }
    .axis path, .axis line { fill: none; stroke: #000; shape-rendering: crispEdges; }
    .axis text { font-size: 11px; }
    .chart-title { font-size: 16px; font-weight: bold; text-anchor: middle; }
  </style>
</head>
<body>
  <div id="chart"></div>
  <script type="module">
    // Set up SVG dimensions and margins
    const margin = {top: 40, right: 30, bottom: 40, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Load data from data.csv using d3.csv
    d3.csv("data.csv").then(data => {
      console.log("Data loaded:", data); // Log loaded data

      // Parse data (dates and prices)
      const parsedData = data.map(d => ({ date: new Date(d.date), price: parseFloat(d.price) }));

      // Create scales (X: time, Y: linear)
      const xScale = d3.scaleTime();
      const yScale = d3.scaleLinear().domain([d3.min(parsedData, d => d.price), d3.max(parsedData, d => d.price)]).range([height, 0]);

      // Create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Create SVG container and append axes
      const svg = d3.select("#chart")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})}`);

      svg.append("text")
       .attr("class", "chart-title")
       .attr("x", width / 2)
       .attr("y", 0 - (margin.top / 2))
       .text("AAPL Stock Price Over Time");

      // Create bars based on data
      const bars = svg.selectAll(".bar")
        .data(parsedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("y", 0)
        .attr("width", d => width)
        .attr("height", d => height - yScale(d.price))
        .text(d => d.price.toString());

      // Add labels on top of bars
      bars.selectAll(".bar-label")
        .data(parsedData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.date) + 10)
        .attr("y", d => yScale(d.price) + 10)
        .text(d => d.price.toString());

    }).catch(error => {
      console.error("Error loading or processing data:", error);
      // Display error message in the chart area
       svg.append("text")
         .attr("x", width / 2)
         .attr("y", height / 2)
         .attr("text-anchor", "middle")
         .text("Error loading data. Check console.");
    });
  </script>
</body>
</html>
```

**data.csv** (remains the same)

```csv
date,symbol,price
2000-01-01,AAPL,100
2000-02-01,AAPL,120
2000-03-01,AAPL,115
2000-04-01,AAPL,140
2000-05-01,AAPL,135
2000-06-01,AAPL,160
2000-07-01,AAPL,165
2000-08-01,AAPL,170
2000-09-01,AAPL,155
2000-10-01,AAPL,180
2000-11-01,AAPL,190
2000-12-01,AAPL,200
```