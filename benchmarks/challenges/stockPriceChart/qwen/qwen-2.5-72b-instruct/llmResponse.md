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
      // Parse the date and price
      const parsedData = data.map(d => ({
        date: new Date(d.date),
        symbol: d.symbol,
        price: +d.price
      }));

      // Create scales
      const xScale = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.date))
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.price)])
        .range([height, 0]);

      // Create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .text("Date");

      svg.append("g")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", -height / 2)
        .text("Price");

      // Create bars
      svg.selectAll(".bar")
        .data(parsedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("y", d => yScale(d.price))
        .attr("width", width / parsedData.length)
        .attr("height", d => height - yScale(d.price));

      // Add labels on top of bars
      svg.selectAll(".bar-label")
        .data(parsedData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.date) + (width / parsedData.length) / 2)
        .attr("y", d => yScale(d.price) - 5)
        .text(d => d.price);

      // Add a title
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

This implementation completes the task by:
1. Setting up the SVG dimensions and margins.
2. Loading data from `data.csv` and parsing it.
3. Creating time and linear scales for the X and Y axes.
4. Creating and appending the axes to the SVG.
5. Creating bars based on the parsed data.
6. Adding labels on top of each bar.
7. Adding a title to the chart.
8. Ensuring the chart fits within an 800x600 viewport.
9. Adding basic styling for the chart, axes, labels, and title.