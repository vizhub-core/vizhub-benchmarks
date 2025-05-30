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