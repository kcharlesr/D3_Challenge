

function makeResponsive() {


    var svgArea = d3.select("body").select("svg");
  

    if (!svgArea.empty()) {
      svgArea.remove();
    }
 
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 300,
      left: 100
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var yLabelWidth = 50;
    var yLabelHeight = svgHeight / 2;

    var xLabelWidth = svgWidth/2;
    var xLabelHeight = svgHeight -10;

    d3.csv("assets/data/data.csv").then(function(healthData) {
  
        healthData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
          });

        var xScale = d3.scaleLinear()
          .domain(d3.extent(healthData, d=>d.poverty))
          .range([0, width])
          
          console.log(xScale (19));
        var yScale = d3.scaleLinear()
          .domain([0, d3.max(healthData, d => d.healthcare)])
          .range([height, 0]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);
  
        chartGroup.append("g")
          .call(yAxis);

        var circlesGroup = chartGroup.selectAll("circle")
          .data(healthData)
          .enter()
          .append("circle")
          .attr("cx", d => xScale(d.poverty))
          .attr("cy", d => yScale(d.healthcare))
          .attr("r", "15")
          .classed("stateCircle", true);
          
        var textgroup =chartGroup.selectAll()
          .data(healthData)
          .enter()
          .append("text")
          .text(d=>d.abbr)
          .attr("x", d => xScale(d.poverty))
          .attr("y", d=> yScale(d.healthcare) +4)
          .attr("font-size", "10px")
          .classed("stateText", true);

          svg.append('g')
          .attr("transform", `translate(${yLabelWidth}, ${yLabelHeight} )`)
          .append("text")
          .attr('text-anchor', 'middle')
          .attr("transform", 'rotate(-90)')
          .attr("font-size", "20px")
          .classed("active", true)
          .text("Lacks Healthcare (%)");
      
          svg.append('g')
          .attr("transform", `translate(${xLabelWidth}, ${xLabelHeight} )`)
          .append("text")
          .attr('text-anchor', 'middle')
          .attr("font-size", "20px")
          .classed("active", true)
          .text("In Poverty (%)");

        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([40,-80])
          .html(function(d) {
            return (`<strong>${d.state}<br><hr>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%<strong>`);
          });
         
        chartGroup.call(toolTip);
         
        circlesGroup.on("mouseover", function(d) {
          toolTip.show(d, this);
          d3.select(this).style("stroke", "black");
         
        })
          .on("mouseout", function(d) {
            toolTip.hide(d);
            d3.select(this).style("stroke", "white");
          });

        textgroup.on("mouseover", function(d) {
          tooltip.show(d, this);
          d3.select(this).style("stroke", "black");
        })
          .on("mouseout", function(d) {
            tooltip.hide(d);
            d3.select(this).style("stroke", "white");
          });
    });
}

    makeResponsive();

    d3.select(window).on("resize", makeResponsive);