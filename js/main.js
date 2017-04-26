
$(function () {
    d3.csv('DeptEducationSpending2014.csv', function (error, data) {
        var margin = {
            top: 20,
            right: 40,
            bottom: 30,
            left: 80
        },
            width = 960,
            height = 500,
            drawWidth = width - margin.left - margin.right,
            drawHeight = height - margin.top - margin.bottom;

        // Nest the dataset by state as key and sum as value
        function nestedByState(data) {
            var nestedData = d3.nest()
                .key(function (d) {
                    return d.state;
                })
                .rollup(function (v) {
                    return d3.sum(v, function (d) {
                        return d['2014_actual'];
                    })
                })
                .entries(data);
            return nestedData;
        }

        // Nest the dataset by program as key and sum as value
        function nestedByProgram(data) {
            var nestedData = d3.nest()
                .key(function (d) {
                    return d.program_name;
                })
                .rollup(function (v) {
                    return d3.sum(v, function (d) {
                        return d['2014_actual'];
                    })
                })
                .entries(data);
            return nestedData;
        }
        // for creating the list of states
        var stateSelector = $('#statelist');

        var uniqueStates = nestedByState(data).map(function (d) {
            return d.key;
        });

        //fill in select menu
        uniqueStates.forEach(function (d) {
            var newOption = new Option(d, d);
            stateSelector.append(newOption);
        });

        var xScale = d3.scaleBand();
        var yScale = d3.scaleLinear();
        var xAxis = d3.axisBottom();
        var yAxis = d3.axisLeft();
        var colorScale = d3.scaleOrdinal();


        var setScales = function (data) {
            var keys = data.map(function (d) {
                return d.key;
            });

            // Set the domain/range of your xScale
            xScale.range([0, drawWidth])
                .padding(0.25)
                .domain(keys);

            // Get min/max values of the percent data (for your yScale domain)
            var yMin = d3.min(data, function (d) {
                return +d.value;
            });

            var yMax = d3.max(data, function (d) {
                return +d.value;
            });

            // Set the domain/range of your yScale
            yScale.range([drawHeight, 0])
                .domain([0, yMax]);
        };


        // to set Axes with the scale
        function setAxes() {
            xAxis.scale(xScale);
            yAxis.scale(yScale);

            xAxisLabel
                .transition()
                .duration(1500)
                .call(xAxis);

            yAxisLabel.transition().duration(1500).call(yAxis);

        }

        var svg = d3.select("#vis")
            .append('svg')
            .attr('width', width)
            .attr('height', height + 200);

        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('height', height)
            .attr('width', width);

        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
            .attr('class', 'axis');

        // Append a yaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + (margin.left) + ',' + (margin.top) + ')')

        // Append text to label the y axis (don't specify the text yet)
        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ') rotate(90)')
            .attr('class', 'title');

        // Append text to label the y axis (don't specify the text yet)
        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
            .attr('class', 'title');

        // initial selection
        var dataSelection = nestedByState(data);

        var draw = function (data) {
            data.sort(function (a, b) { return b.value - a.value; });
            setScales(data);
            setAxes();
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<span style='color:#b7a57a'>$" + Math.round(d.value / 1000000) + " Millions Spent on " + d.key + "</span> ";
                })
            g.call(tip);

            var bars = g.selectAll(".bar").data(data);
            bars.enter()
                .append("rect")
                .attr("x", function (d) { return xScale(d.key); })
                .attr("y", function (d) { return yScale(d.value); })
                .attr('height', 0)
                .attr("class", "bar")
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .attr("width", xScale.bandwidth())
                .merge(bars)
                .transition()
                .duration(500)
                .delay(function (d, i) {
                    return i * 50;
                })
                .attr('y', function (d) {
                    return yScale(d.value);
                })
                .attr('height', function (d) {
                    return drawHeight - yScale(d.value);
                });

            // Use the .exit() and .remove() methods to remove elements that are no longer in the data
            bars.exit().remove();

            xAxisLabel.selectAll('text')
                .attr('x', 0)
                .attr('y', 0)
                .attr('transform', 'rotate(-45)')
                .attr('alignment-baseline', 'hanging')
                .style('text-anchor', 'end')
                .attr("dy", "0.32em");
        };
        // draw the graph with initial value
        draw(dataSelection);

        // filter the data by a statename
        function stateFilter(stateName) {
            var stateObject = data.filter(function (d) {
                return d.state === stateName;
            })
            return stateObject;
        }
        $('.selection').on('change', function () {
            // Set your measure variable to the value (which is used in the draw funciton)
            selected = $(this).val();
            if (selected === 'program') {
                dataSelection = nestedByProgram(data);
            } else if (selected === 'state') {
                dataSelection = nestedByState(data);
            } else {
                dataSelection = nestedByProgram(stateFilter(selected));
            }
            draw(dataSelection);
        });
    });
});