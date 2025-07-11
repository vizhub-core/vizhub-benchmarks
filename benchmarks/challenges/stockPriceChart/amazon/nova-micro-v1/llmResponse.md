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
    const margin = {top: 40, right: 30, bottom: 40, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data.csv").then(data => {
      const parsedData = data.map(d => ({
        date: d3.timeParse("%Y-%m-%d")(d.date),
        price: +d.price
      }));

      const x = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.date))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.price)])
        .range([height, 0]);

      const xAxis = g => g
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

      const yAxis = g => g
        .call(d3.axisLeft(y));

      svg.append("g")
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 20)
        .style("text-anchor", "middle")
        .text("Date");

      svg.append("g")
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .text("Price");

      svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .text("AAPL Stock Price Over Time");

      const bar = svg.selectAll(".bar")
        .data(parsedData)
        .join("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.date))
          .attr("width", x.bandwidth())
          .attr("y", d => y(d.price))
          .attr("height", d => height - y(d.price));

      bar.append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.date) + x.bandwidth() / 2)
        .attr("y", d => y(d.price) - 4)
        .attr("text-anchor", "middle")
        .text(d => d.price);

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

In this implementation, we have:
1. Loaded the data from `data.csv`.
2. Parsed the dates and prices.
3. Created time and linear scales for the X and Y axes.
4. Added the X and Y axes with appropriate labels.
5. Added a title to the chart.
6. Rendered bars based on the data.
7. Added labels on top of each bar.
8. Ensured the visualization fits within an 800x600 viewport.
9. Added basic styling for the chart, bars, and axes.