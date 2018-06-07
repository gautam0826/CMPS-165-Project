//Width and height
var margin = {left: 40, right: 40, top: 10, bottom: 30 }, 
    w = 500 - margin.left -margin.right,
    h = 300 - margin.top - margin.bottom;
//			var w = 500;
//			var h = 300;

			//Define map projection
			var projection = d3.geoAlbersUsa()
								   .translate([w/2, h/2])
								   .scale([500]);

			//Define path generator
			var path = d3.geoPath()
							 .projection(projection);
							 
			//Define quantize scale to sort data values into buckets of color
			var color = d3.scaleQuantize()
								.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
								//Colors derived from ColorBrewer, by Cynthia Brewer, and included in
								//https://github.com/d3/d3-scale-chromatic

            //region sets
            //far_west, rocky_mountain, plains, southwest, great_lakes, southeast, mideast, new_england, hawaii, alaska
            var far_west = new Set(["CA", "OR", "WA", "NV"]);
            var rocky_mountain = new Set(["ID", "MT", "WY", "UT", "CO"]);
            var plains = new Set(["ND", "SD", "NE", "KS", "MN", "IA", "MO"]);
            var southwest = new Set(["AZ", "NM", "TX", "OK"]);
            var great_lakes = new Set(["WI", "MI", "IL", "IN", "OH"]);
            var southeast = new Set(["AR", "LA", "KY", "WV", "VA", "TN", "NC", "MS", "AL", "GA", "SC", "FL"]);
            var mideast = new Set(["NY", "PA", "NJ", "DE", "MD", "DC"]);
            var new_england = new Set(["ME", "NH", "VT", "MA", "RI", "CT"]);
            var hawaii = new Set(["HI"]);
            var alaska = new Set(["AK"]);

            //var div = d3.select("body").append("div").attr("align", "right");
			//Create SVG element
			var svg = d3.select("#chart")
                        .append("svg")
                        .attr("class", "map1")
//                        .attr("align", "bottom right")
						.attr("width", w)
						.attr("height", h);
            
            var svg_2 = d3.select("div")
                          .append("svg")
                          .attr("class", "map2")
//                          .attr("align", "bottom left")
                          .attr("width", w)
                          .attr("height", h);

            //Load in GeoJSON data
			d3.json("us-states.json", function(json) {
                
                /* //add a toggle variable and a selection id
                for(var i = 0; i < json.features.length; i++){
                    json.features[i].properties.selected = 0;
                }*/

			     //Bind data and create one path per GeoJSON feature
				 svg.selectAll("path")
				    .data(json.features)
					.enter()
					.append("path")
					.attr("d", path)
                    .attr("id", function(d){
                        return "1_" + d.properties.name; 
                    })
                    .attr("class", "mass")
					.style("fill", function(d) {
						//Get data value
					   	var value = d.properties.value;
					                        
					   	if (value) {
					   		//If value exists…
							return color(value);
					   	} else {
					   		//If value is undefined…
							return "#ccc";
					   	}
					})
                    .on("click", function(d){
                        //console.log(this);
                        d3.select(this).style("fill", "blue");
                        //console.log(this.id);
                        //help from https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
                        var id = "2" + this.id.substr(1, this.id.length);
                        //console.log(id);
                        //id[0] = '2';
                        //console.log(id);
                        var elt = document.getElementById(id);
                        //console.log(elt);
                        d3.select(elt).style("fill", "blue");
                    })
                    .append("title")
                    .text(function (d) {
                        return d.properties.name; 
                    });
                
                //Bind data and create one path per GeoJSON feature
				 svg_2.selectAll("path")
				    .data(json.features)
					.enter()
					.append("path")
					.attr("d", path)
                    .attr("id", function(d) {
                        return "2_" + d.properties.name; 
                    })
                    .attr("class", "mass")
					.style("fill", function(d) {
						//Get data value
					   	var value = d.properties.value;
					   		
					   	if (value) {
					   		//If value exists…
							return color(value);
					   	} else {
					   		//If value is undefined…
							return "#ccc";
					   	}
					})
                    .on("click", function(d){
                        //console.log(this);
                        d3.select(this).style("fill", "blue");
                        //console.log(this.id);
                        //help from https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
                        var id = "1" + this.id.substr(1, this.id.length);
                        //console.log(id);
                        //id[0] = '2';
                        //console.log(id);
                        var elt = document.getElementById(id);
                        //console.log(elt);
                        d3.select(elt).style("fill", "blue");
                    })
                    .append("title")
                    .text(function(d) {
                        return d.properties.name;
                    });
			
				
            
                    //Load in GeoJSON data
				    d3.json("cb_2013_us_cbsa_5m.json", function(json_2) {

					   //Bind data and create one path per GeoJSON feature
					   svg.selectAll("path")
					       .data(json_2.features)
					       .enter()
					       .append("path")
					       .attr("d", path)
                           .attr("id", function(d) {
                                return "1_" + d.properties.name;
                           })
                           .attr("class", "mass")
					       .style("fill", function(d) {
					   		  //Get data value
					   		  //var value = d.properties.value;
                              var name = d.properties.name;
                              var state = name.substr(name.length - 2, name.length);
                              //console.log(name + ", " + state);
                              //far_west, rocky_mountain, plains, southwest, great_lakes, southeast, mideast, new_england, hawaii, alaska
                              //from https://htmlcolorcodes.com/color-chart/, selection chart fourth row from bottom left to right to fill
					   		
					   		  if (far_west.has(state)) {
					   			//If value exists…
						   		return "rgb(169,50,38)";
					   		  } else if(rocky_mountain.has(state)) {
					   			//If value is undefined…
						   		return "rgb(203,67,53)";
					          } else if(plains.has(state)) {
                                  return "rgb(136,78,160)";
                              } else if(southwest.has(state)) {
                                  return "rgb(125,60,152)";
                              } else if(great_lakes.has(state)) {
                                  return "rgb(36,113,163)";
                              } else if(southeast.has(state)) {
                                  return "rgb(46, 134, 193)";
                              } else if(mideast.has(state)) {
                                  return "rgb(23,165,137)";
                              } else if(new_england.has(state)) {
                                  return "rgb(19,141,117)";
                              } else if(hawaii.has(state)) {
                                  return "rgb(34,153,84)";
                              } else {
                                  return "rgb(40,180,99)";
                              }})
                           .on("click", function(d){
                                //console.log(this);
                                d3.select(this).style("fill", "yellow");
                                //console.log(this.id);
                                //help from https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
                                var id = "2" + this.id.substr(1, this.id.length);
                                //console.log(id);
                                //id[0] = '2';
                                //console.log(id);
                                var elt = document.getElementById(id);
                                //console.log(elt);
                                d3.select(elt).style("fill", "yellow");
                            })
                            .append("title")
                            .text(function(d) {
                                return d.properties.name;
                            });
                
                
                        //Bind data and create one path per GeoJSON feature
					   svg_2.selectAll("path")
					       .data(json_2.features)
					       .enter()
					       .append("path")
					       .attr("d", path)
                           .attr("id", function(d) {
                                return "2_" + d.properties.name;
                           })
                           .attr("class", "mass")
					       .style("fill", function(d) {
					   		  //Get data value
					   		  //var value = d.properties.value;
                              var name = d.properties.name;
                              var state = name.substr(name.length - 2, name.length);
                              //console.log(name + ", " + state);
                              //far_west, rocky_mountain, plains, southwest, great_lakes, southeast, mideast, new_england, hawaii, alaska
                              //from https://htmlcolorcodes.com/color-chart/, selection chart fourth row from bottom left to right to fill
					   		
					   		  if (far_west.has(state)) {
					   			//If value exists…
						   		return "rgb(169,50,38)";
					   		  } else if(rocky_mountain.has(state)) {
					   			//If value is undefined…
						   		return "rgb(203,67,53)";
					          } else if(plains.has(state)) {
                                  return "rgb(136,78,160)";
                              } else if(southwest.has(state)) {
                                  return "rgb(125,60,152)";
                              } else if(great_lakes.has(state)) {
                                  return "rgb(36,113,163)";
                              } else if(southeast.has(state)) {
                                  return "rgb(46, 134, 193)";
                              } else if(mideast.has(state)) {
                                  return "rgb(23,165,137)";
                              } else if(new_england.has(state)) {
                                  return "rgb(19,141,117)";
                              } else if(hawaii.has(state)) {
                                  return "rgb(34,153,84)";
                              } else {
                                  return "rgb(40,180,99)";
                              }})
                           .on("click", function(d){
                                //console.log(this);
                                d3.select(this).style("fill", "yellow");
                                //console.log(this.id);
                                //help from https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
                                var id = "1" + this.id.substr(1, this.id.length);
                                //console.log(id);
                                //id[0] = '2';
                                //console.log(id);
                                var elt = document.getElementById(id);
                                //console.log(elt);
                                d3.select(elt).style("fill", "yellow");
                            })
                            .append("title")
                            .text(function(d) {
                                return d.properties.name;
                            });
                        
                    });
                    
			
				});
            
            //pan and zoom code derived from bl.ocks.org/mbostock/3892919 and http://www.puzzlr.org/zoom-in-d3v4-minimal-example/ and especially https://bl.ocks.org/rutgerhofste/5bd5b06f7817f0ff3ba1daa64dee629d
            //define behaviour and link to scroll wheel
            var zoom = d3.zoom().on("zoom", zoomed);
            
            //apply behaviour to svg
            zoom(svg);
            zoom(svg_2);
            
            function zoomed() {
                //zoom on details
                svg.selectAll(".mass").attr("transform", d3.event.transform);
                svg_2.selectAll(".mass").attr("transform", d3.event.transform);
            }