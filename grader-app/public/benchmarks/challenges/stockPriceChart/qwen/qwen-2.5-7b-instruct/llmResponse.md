**index.html**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Stock Price Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    /* TODO: Add basic CSS styling for the chart, axes, labels, title */
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
  <script type="module"> // Use type="module" for potential imports if refactored
    // --- Your D3 code starts here ---

    const margin = { top: 40, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load data from data.csv
    d3.csv("data.csv").then(data => {
      // Parse data
      data.forEach(d => {
        d.date = new Date(d.date);
        d.price = +d.price;
      });

      // Create scales
      const xScale = d3.scaleTime()
                        .domain(d3.extent(data, d => d.date))
                        .range([0, width]);

      const yScale = d3.scaleLinear()
                        .domain(d3.extent(data, d => d.price))
                        .range([height, 0]);

      // Create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Add titles and axes to the chart
      svg.append("g")
         .attr("class", "x axis")
         .attr("transform", `translate(0,${height})`)
         .call(xAxis)
         .selectAll("text")
         .style("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", ".15em")
         .attr("transform", "rotate(-45)" );

      svg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("y", 6)
         .attr("dy", ".71em")
         .attr("transform", "rotate(-90)")
         .attr("text-anchor", "end")
         .text("Price");

      // Add a title
      svg.append("text")
         .attr("class", "chart-title")
         .attr("x", width / 2)
         .attr("y", 0 - (margin.top / 2))
         .text("AAPL Stock Price Over Time");

      // Add bars and labels to the chart
      svg.selectAll(".bar")
         .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .attr("x", d => xScale(d.date))
         .attr("y", d => yScale(d.price))
         .attr("width", (width / data.length) - margin.left)
         .attr("height", d => height - yScale(d.price))
         .append("title")
         .text(d => d.price);

    }).catch(error => {
      console.error("Error loading or processing data:", error);
      svg.append("text")
         .attr("x", width / 2)
         .attr("y", height / 2)
         .attr("text-anchor", "middle")
         .text("Error loading data. Check console.");
    });

    // --- Your D3 code ends here ---
  </script>
</body>
</html>
```

**data.csv**

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