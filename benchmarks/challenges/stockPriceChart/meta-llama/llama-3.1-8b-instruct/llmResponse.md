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
    // 1. Set up SVG dimensions and margins
    // 2. Load data from data.csv using d3.csv
    // 3. Parse data (dates and prices)
    // 4. Create scales (X: time, Y: linear)
    // 5. Create axes
    // 6. Create SVG container and append axes
    // 7. Create bars based on data
    // 8. Add labels on top of bars
    // 9. Add a title

    const margin = {top: 40, right: 30, bottom: 40, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load data
    d3.csv("data.csv").then(data => {
      // Parse dates and prices
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

      // Add axes
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

      svg.append("g")
        .attr("class", "axis")
        .call(yAxis);

      // Create bars
      svg.selectAll("rect")
        .data(data.filter(d => d.symbol === "AAPL"))
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("y", d => yScale(d.price))
        .attr("width", xScale(d3.extent(data, d => d.date)[1] - d3.extent(data, d => d.date)[0]) / data.length)
        .attr("height", d => height - yScale(d.price));

      // Add labels
      svg.selectAll("text.bar-label")
        .data(data.filter(d => d.symbol === "AAPL"))
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.date) + xScale(d3.extent(data, d => d.date)[1] - d3.extent(data, d => d.date)[0]) / 2)
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

**bar.js**

```javascript
// Optional: Split the logic into a separate file for better module organization
const renderChart = (svg, data, xScale, yScale) => {
  // Create bars
  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.date))
    .attr("y", d => yScale(d.price))
    .attr("width", xScale(d3.extent(data, d => d.date)[1] - d3.extent(data, d => d.date)[0]) / data.length)
    .attr("height", d => height - yScale(d.price));

  // Add labels
  svg.selectAll("text.bar-label")
    .data(data)
    .join("text")
    .attr("class", "bar-label")
    .attr("x", d => xScale(d.date) + xScale(d3.extent(data, d => d.date)[1] - d3.extent(data, d => d.date)[0]) / 2)
    .attr("y", d => yScale(d.price) - 5)
    .text(d => d.price);
}

export { renderChart };
```

Delete the old **index.html** file.