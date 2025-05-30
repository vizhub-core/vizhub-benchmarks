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
    // Set up SVG dimensions and margins
    const margin = {top: 40, right: 30, bottom: 40, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load data from data.csv
    d3.csv("data.csv").then(data => {
      console.log("Data loaded:", data);

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
        .domain([0, d3.max(data, d => d.price)])
        .range([height, 0]);

      // Create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Append axes
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .append("text")
          .attr("class", "axis-label")
          .attr("x", width / 2)
          .attr("y", 40)
          .text("Date");

      svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .append("text")
          .attr("class", "axis-label")
          .attr("transform", "rotate(-90)")
          .attr("y", -40)
          .attr("x", -height / 2)
          .text("Price");

      // Create bars
      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("y", d => yScale(d.price))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.price));

      // Add labels on top of bars
      svg.selectAll(".bar-label")
        .data(data)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.date) + xScale.bandwidth() / 2)
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

This updated `index.html` file includes the complete D3.js code to create a bar chart showing AAPL stock prices over time. The chart includes X and Y axes with labels, a title, and price values displayed on top of each bar. The visualization is responsive and fits within an 800x600 viewport.