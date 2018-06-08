//Define Margin
var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
    width = 960 - margin.left -margin.right,
    height = 500 - margin.top - margin.bottom;

//Define Color
var colors = d3.scaleOrdinal(d3.schemeCategory20);

//Define SVG
var svg_a = d3.select("div#chart")
    .append("svg")
    .attr("align", "left")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Define clipping region 
svg_a.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

//Define Scales   
var xScale = d3.scaleSqrt()
    .domain([0,16]) //Need to redefine this after loading the data
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0,450]) //Need to redfine this after loading the data
    .range([height, 0]);

//Define Axis
var xAxis = d3.axisBottom(xScale).tickPadding(2);
var yAxis = d3.axisLeft(yScale).tickPadding(2);

        
//Define Tooltip here
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("Data.csv", function(error, data) {
    if (error) throw error;
    console.log(data)

    // Define domain for xScale and yScale
    xScale.domain([0,3200]);
    yScale.domain([.04, 0.16]);
    //xScale.domain([0,d3.max(data, function(d) {return 1.5*d["Density 1990"]; })]);
    //yScale.domain([.7*d3.min(data, function(d) {return d["Pollutant 1990"]; }),2.9*d3.max(data, function(d) {return d["Pollutant 1990"]; })]);

    var tipMouseover = function(d) {
        //console.log(d);
        var html  = "MSA:" + d["Core Based Statistical Area"] + "<br>Pollutant value: " + d["Pollutant 1990"] + "<br>Population: " + d["Population 1990"] + "<br>Pop Density: " + d["Density 1990"];
        tooltip.html(html)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            //.style("background-color", colors(d.country))
            .transition()
            .duration(200) // ms
            .style("opacity", .9) // started as 0!
    };
    var zoom = d3.zoom()
      .scaleExtent([1, 32])
      .on("zoom", zoomed);
    
    function zoomed() {
        var new_x_scale = d3.event.transform.rescaleX(xScale);
        var new_y_scale = d3.event.transform.rescaleY(yScale);
//      console.log(d3.event.transform)
        svg_a.select(".x.axis").call(xAxis.scale(new_x_scale));
        svg_a.select(".y.axis").call(yAxis.scale(new_y_scale));
        svg.selectAll(".dot")
        .attr("r", function(d) { return Math.sqrt(d["Population 1990"])/75; })
        .attr("cx", function(d) {return xScale(d["Density 1990"]);})
        .attr("cy", function(d) {return yScale(d["Pollutant 1990"]);})
//        .attr("text", function(d) { return xScale(d.gdp); })
        .attr("transform", d3.event.transform)
};

svg_a.call(zoom);

    var tipMouseout = function(d) {
      tooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!
    };
    
    
    //Draw Scatterplot
    svg_a.selectAll(".dot")        
        .data(data)
        .enter().append("circle")
        .style("opacity", .7)
    
        .attr("class", "dot")
        .attr("r", function(d) { return Math.sqrt(d["Population 1990"])/75; })
        .attr("cx", function(d) {return xScale(d["Density 1990"]);})
        .attr("cy", function(d) {return yScale(d["Pollutant 1990"]);})
        .style("fill", function (d) { return colors(d["Pollutant 1990"]); })
        .attr("clip-path", "url(#clip)")
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout);

    //x-axis
    svg_a.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Population Density(Population per Sq. mile)");

    //Y-axis
    svg_a.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("O3 Max 99th percentile");
})
//https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
var slider2 = d3.sliderHorizontal()
    .min(1990)
    .max(2010)
    .step(1)
    .width(700)
    .tickFormat(d3.format("d"))
    .on('onchange', val => {
        d3.select("p#value2").text(val);
        var tipMouseover = function(d) {
        //console.log(d);
        var html  = "MSA:" + d["Core Based Statistical Area"] + "<br>Pollutant value: " + d["Pollutant " + val] + "<br>Population: " + d["Population " + val] + "<br>Pop Density: " + d["Density " + val];
        tooltip.html(html)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 15) + "px")
            //.style("background-color", colors(d.country))
            .transition()
            .duration(200) // ms
            .style("opacity", .9) // started as 0!
        };
        svg_a.selectAll(".dot")
            .attr("class", "dot")
            .attr("r", function(d) { return Math.sqrt(d["Population " + val])/75; })
            .attr("cx", function(d) {return xScale(d["Density " + val]);})
            .attr("cy", function(d) {return yScale(d["Pollutant " + val]);})
            .attr("id","slider_div")
            .on("mouseover", tipMouseover);
    });

var g = d3.select("div#slider2").append("svg")
    .attr("class", "slider")
    .attr("width", 1000)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(30,30)");

g.call(slider2);

d3.select("p#value2").text((slider2.value()));
d3.select("a#setValue2").on("click", () => slider2.value(5));
