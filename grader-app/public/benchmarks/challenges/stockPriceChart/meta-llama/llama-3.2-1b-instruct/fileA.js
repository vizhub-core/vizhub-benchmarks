// Entire updated code for fileA
function createBars(data) {
  const margin = {top: 40, right: 30, bottom: 40, left: 60};
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3.select("#chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.price)])
    .range([height, 0]);

  const bars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.date))
    .attr("y", (d) => yScale(d.price))
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => d.price);

  bars.on("click", (event, d) => {
    console.log(d);
  });

  return svg;
}

const data = d3.csv("data.csv");
const chart = createBars(data);