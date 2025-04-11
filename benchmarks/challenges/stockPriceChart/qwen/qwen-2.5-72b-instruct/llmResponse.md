**index.html**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Stock Price Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
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
    const margin = { top: 40, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data.csv").then(data => {
      // Parse data
      data.forEach(d => {
        d.date = new Date(d.date);
        d.price = +d.price;
      });

      // Scales
      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([height, 0]);

      // Axes
      const xAxis = d3.axisBottom(x).ticks(10);
      const yAxis = d3.axisLeft(y).ticks(10);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", 30)
        .text("Time");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -height / 2)
        .text("Price");

      // Bars
      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.price))
        .attr("width", width / data.length)
        .attr("height", d => height - y(d.price));

      // Bar labels
      svg.selectAll(".bar-label")
        .data(data)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.date) + (width / data.length) / 2)
        .attr("y", d => y(d.price) - 5)
        .text(d => d.price);

      // Title
      svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .text("AAPL Stock Price Over Time");
    }).catch(error => {
      console.error("Error loading or processing data:", error);
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

**data.csv**

```
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