(function () {
    var app = angular.module('HMSApp');

    app.controller('DisciplineSummary', ['$scope', '$http', function ($scope, $http) {
        $scope.division = null;
        $scope.quarterlyData = null;
        $scope.data = null;

          //Get json data
        $http.get("http://10.63.6.103/Productivity/Discipline/Test.php")
    .success(function (response) {
        $scope.quarterlyData = response; // Assign json data to angular variable
    })
    .error(function (data, status, headers, config) {
        var Test = "not done " //log error
    });




        //Create pie, bar and  quarterly bar charts
        function dashboard(id, fData) {
            var barColor = '#4682b4';
            function segColor(c) { return { EnterpriseStorage: "#807dba", MidRangeStorage: "#e08214", EmergingTechnologies: "#41ab5d"}[c]; }

            // compute total for each state.
            fData.forEach(function (d) {
                d.total = d.freq.EnterpriseStorage + d.freq.MidRangeStorage + d.freq.EmergingTechnologies;
            });

            // function to handle histogram.
            function histoGram(fD) {
                var hG = {}, hGDim = { t: 60, r: 0, b: 30, l: 0 };
                hGDim.w = 500 - hGDim.l - hGDim.r,
        hGDim.h = 300 - hGDim.t - hGDim.b;

                //create svg for histogram.
                var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

                // create function for x-axis mapping.
                var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function (d) { return d[0]; }));

                // Add x-axis to the histogram svg.
                hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

                // Create function for y-axis map.
                var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function (d) { return d[1]; })]);

                // Create bars for histogram to contain rectangles and freq labels.
                var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");

                //create the rectangles.
                bars.append("rect")
            .attr("x", function (d) { return x(d[0]); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function (d) { return hGDim.h - y(d[1]); })
            .attr('fill', barColor)
            //.on("click", showQuarterlyData) // Show quarterly summary
            .on("click", mouseover);// mouseover is defined below.
           // .on("mouseout", mouseout); // mouseout is defined below.

                //Create the frequency labels above the rectangles.
                bars.append("text").text(function (d) { return d3.format(",")(d[1]) })
            .attr("x", function (d) { return x(d[0]) + x.rangeBand() / 2; })
            .attr("y", function (d) { return y(d[1]) - 5; })
            .attr("text-anchor", "middle");

                //***** Show Quarterly Data
                function showQuarterlyData(d) {
                    $scope.division = d[0]; //Get clicked value
                    $scope.$apply();

                    if ($scope.division == "AMERICAS")
                        $scope.data = $scope.quarterlyData.modules[0].Products;
                    else if ($scope.division == "APJ")
                        $scope.data = $scope.quarterlyData.modules[1].Products;
                    else if ($scope.division == "EMEA")
                        $scope.data = $scope.quarterlyData.modules[2].Products;


                    // $scope.tableParams.reload();
                    // if ($scope.division == "APJ")
                    //  d3.select("#infoTable1").remove();
                    var selectDIV = "";
                    selectDIV = d3.select("#infoTable1");
                    $("#quarterSummeryRow1").css("display", "block"); //Show quarterly summary <DIV> for AMERICAS
                    selectChartDIV = "#info-chart1";


                    var dataset = [],
                    NewArray = [],
                    stack = d3.layout.stack(),

                    /*Width and height*/
                w = 500,
                h = 200,
                barPadding = 20,
                padding = 60
                    duration = 500,
              grouped = false;

                    if ($scope.data.length > 0) {
                        for (var i = 0; i < $scope.data.length; i++) {
                            NewArray = [];
                            if ($scope.data[i].quarters.length > 0) {
                                for (var j = 0; j < $scope.data[i].quarters.length; j++) {
                                    var newObject = {};
                                    newObject.x = j;
                                    if (!isNaN($scope.data[i].quarters[j].size))
                                        newObject.y = $scope.data[i].quarters[j].size;
                                    else newObject.y = 0;
                                    NewArray.push(newObject);
                                }
                            }
                            if (!NewArray.length == 0)
                                dataset.push(NewArray);
                        }
                    }
                    stack(dataset);

                    /* Define Y scale */
                    var yScale = d3.scale.linear()
                    .domain([0,
                        d3.max(dataset, function (d) {
                            return d3.max(d, function (d) {
                                return d.y0 + d.y;
                            });
                        })
                    ])
                    .range([h, padding]);

                    d3.select("#info-chart1").select("svg").remove();
                    /* Create SVG element */
                    var svg = d3.select("#info-chart1")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

                    /* Add a group for each row of data */
                    var groups = svg.selectAll("g")
                    .data(dataset)
                    .enter()
                    .append("g")
                    .style("fill", function (d, i) {
                        var color = "#807dba";
                        if (i == 0) color = "#807dba"; else if (i == 1) color = "#e08214"; else if (i == 2) color = "#41ab5d"; else if (i == 3) color = "#800080"; else if (i == 4) color = "#FF8000";
                        return color;
                    });

                    groups.selectAll("rect")
                    .data(function (d) { return d; })
                    .enter()
                    .append("rect")
                    .attr("x", function (d, i) {
                        return i * (w / dataset[0].length);
                    })
                    .attr("y", function (d) {
                        return yScale(d.y) + yScale(d.y0) - h;
                    })
                    .attr("width", (w / dataset[0].length - barPadding))
                    .attr("height", function (d) {
                        return h - yScale(d.y);
                    })
                    .on("mouseover", function (d) {

                        /* Get this bar's x/y values, then augment for the tooltip */
                        var xPosition,
                        yPosition = parseInt(d3.select(this).attr("y"));


                        if (d3.select(this).attr("x") < 350) {

                            if (grouped) {
                                console.log("We be grouped!");
                                xPosition = parseFloat(d3.select(this).attr("x")) + 14;
                            } else {
                                xPosition = parseFloat(d3.select(this).attr("x")) + 27;
                            }

                            d3.select(".charttooltip").classed("charttooltip-left", false).classed("charttooltip-right", true);
                        } else {
                            xPosition = parseFloat(d3.select(this).attr("x")) - 143;
                            d3.select(".charttooltip").classed("charttooltip-left", true).classed("charttooltip-right", false); ;
                        }

                        /* Update the tooltip position and value */
                        d3.select(".charttooltip")
                            .style("left", xPosition + "px")
                            .style("top", yPosition + "px")
                            .select(".value")
                            .text(d.y);

                        /* Show the tooltip */
                        d3.select(".charttooltip").classed("hidden", false);

                    })
                        .on("mouseout", function () {
                            /* Hide the tooltip */
                            d3.select(".charttooltip").classed("hidden", true);
                        });

                    d3.selectAll("input").on("change", change);

                    function change() {
                        if (this.value === "grouped") {
                            grouped = true;
                            transitionGrouped();
                        } else {
                            grouped = false;
                            transitionStacked();
                        }
                    }

                    var transitionGrouped = function () {
                        groups.selectAll("rect")
                    .transition()
                    .duration(duration)
                .delay(function (d, i) { return i / dataset[0].length * duration; })
                    .attr("width", (w / dataset[0].length - barPadding) / 4)
                    .transition()
                    .duration(duration)
                    .attr("x", function (d, i, j) {
                        return i * (w / dataset[0].length) + ((w / dataset[0].length - barPadding) / 4) * j;
                    })
                    .transition()
                .duration(duration)
                    .attr("y", function (d, i, j) {
                        return yScale(d.y);
                    });
                    };

                    var transitionStacked = function () {
                        groups.selectAll("rect")
                    .transition()
                .duration(duration)
                .delay(function (d, i) { return i / dataset[0].length * duration; })
                    .attr("y", function (d) {
                        return yScale(d.y) + yScale(d.y0) - h;
                    })
                    .transition()
                    .duration(duration)
                    .attr("x", function (d, i) {
                        return i * (w / dataset[0].length);
                    })
                    .transition()
                    .duration(duration)
                    .attr("width", w / dataset[0].length - barPadding);
                    };

                }

                function mouseover(d) {  // utility function to be called on mouseover.
                showQuarterlyData(d); // Show quarterly summary
                    // filter for selected state.
                    var st = fData.filter(function (s) { return s.State == d[0]; })[0],
                nD = d3.keys(st.freq).map(function (s) { return { type: s, freq: st.freq[s] }; });

                    // call update functions of pie-chart and legend.    
                    pC.update(nD);
                    leg.update(nD);
                }

                function mouseout(d) {    // utility function to be called on mouseout.
                    // reset the pie-chart and legend.    
                    pC.update(tF);
                    leg.update(tF);
                }


                // create function to update the bars. This will be used by pie-chart.
                hG.update = function (nD, color) {
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function (d) { return d[1]; })]);

                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);

                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500)
                .attr("y", function (d) { return y(d[1]); })
                .attr("height", function (d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500)
                .text(function (d) { return d3.format(",")(d[1]) })
                .attr("y", function (d) { return y(d[1]) - 5; });
                }
                return hG;
            }

            // function to handle pieChart.
            function pieChart(pD) {
                var pC = {}, pieDim = { w: 250, h: 250 };
                pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

                // create svg for pie chart.
                var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");

                // create function to draw the arcs of the pie slices.
                var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

                // create a function to compute the pie slice angles.
                var pie = d3.layout.pie().sort(null).value(function (d) { return d.freq; });

                // Draw the pie slices.
                piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function (d) { this._current = d; })
            .style("fill", function (d) { return segColor(d.data.type); })
            .on("mouseover", mouseover).on("mouseout", mouseout);

                //Show Quarterly Data
                function showQuarterlyData(d) {
                    var s = "te";
                }

                // create function to update pie-chart. This will be used by histogram.
                pC.update = function (nD) {
                    piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
                }
                // Utility function to be called on mouseover a pie slice.
                function mouseover(d) {
                    // call the update function of histogram with new data.
                    hG.update(fData.map(function (v) {
                        return [v.State, v.freq[d.data.type]];
                    }), segColor(d.data.type));
                }
                //Utility function to be called on mouseout a pie slice.
                function mouseout(d) {
                    // call the update function of histogram with all data.
                    hG.update(fData.map(function (v) {
                        return [v.State, v.total];
                    }), barColor);
                }
                // Animating the pie-slice requiring a custom function which specifies
                // how the intermediate paths should be drawn.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function (t) { return arc(i(t)); };
                }
                return pC;
            }

            // function to handle legend.
            function legend(lD) {
                var leg = {};

                // create table for legend.
                var legend = d3.select(id).append("table").attr('class', 'legend');

                // create one row per segment.
                var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

                // create the first column for each segment.
                tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill", function (d) { return segColor(d.type); });

                // create the second column for each segment.
                tr.append("td").text(function (d) { return d.type; });

                // create the third column for each segment.
                tr.append("td").attr("class", 'legendFreq')
            .text(function (d) { return d3.format(",")(d.freq); });

                // create the fourth column for each segment.
                tr.append("td").attr("class", 'legendPerc')
            .text(function (d) { return getLegend(d, lD); });

                // Utility function to be used to update the legend.
                leg.update = function (nD) {
                    // update the data attached to the row elements.
                    var l = legend.select("tbody").selectAll("tr").data(nD);

                    // update the frequencies.
                    l.select(".legendFreq").text(function (d) { return d3.format(",")(d.freq); });

                    // update the percentage column.
                    l.select(".legendPerc").text(function (d) { return getLegend(d, nD); });
                }

                function getLegend(d, aD) { // Utility function to compute percentage.
                    return d3.format("%")(d.freq / d3.sum(aD.map(function (v) { return v.freq; })));
                }

                return leg;
            }

            // calculate total frequency by segment for all state.
            var tF = ['EnterpriseStorage', 'MidRangeStorage', 'EmergingTechnologies'].map(function (d) {
                return { type: d, freq: d3.sum(fData.map(function (t) { return t.freq[d]; })) };
            });

            // calculate total frequency by state for all segment.
            var sF = fData.map(function (d) { return [d.State, d.total]; });

            var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg = legend(tF);  // create the legend.
        }
        var freqData = [
        { State: 'AMERICAS', freq: { EnterpriseStorage: 176077, MidRangeStorage: 77041, EmergingTechnologies: 2584} }
        , { State: 'APJ', freq: { EnterpriseStorage: 24012, MidRangeStorage: 21902, EmergingTechnologies: 192} }
        , { State: 'EMEA', freq: { EnterpriseStorage: 15232, MidRangeStorage: 15232, EmergingTechnologies: 165} }

        ]

        dashboard('#ProductSummary_Quarterlydashboard', freqData);
        //Download reports
        $scope.download = function () {
            d3.selectAll("svg text").style({ 'font-size': '12px' });
            d3.selectAll(".c3-axis path").style({ 'fill': 'none', 'stroke': '#000' });

            html2canvas(document.getElementById('disciplineSummaryDIV'), {
                onrendered: function (canvas) {
                    var canvasdata = canvas.toDataURL("image/png");
                    // Convert and download as image 
                    //  Canvas2Image.saveAsPNG(canvas); 

                    var a = document.createElement("a");
                    a.download = "DisciplineSummary.png";
                    a.href = canvasdata;
                    a.click();
                }
            });

        };

    } ]);

})();