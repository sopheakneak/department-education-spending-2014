// /* Create a treemap of country level measures. Inspiration drawn from https://bl.ocks.org/mbostock/4063582.
//  */
$(function () {
    // Read in your data. On success, run the rest of your code
    // d3.csv('Prep-spending.csv', function (error, data) {
    var margin = {
        top: 20,
        right: 40,
        bottom: 30,
        left: 80
    },
        width = 960,
        height = 500,
        drawWidth = width - margin.left - margin.right,
        drawHeight = height - margin.top - margin.bottom,
        measure = 'Alaska'; // variable to visualize

    d3.csv('Prep-spending.csv', function (d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }, function (error, data) {
        if (error) throw error;

        // former code
        // var nestedData = d3.nest()
        //     .key(function (d) {
        //         return d.state;
        //     })
        //     .entries(data);

        // //console.log(nestedData);

        // function selection() {
        //     if (measure !== '') {
        //         var updated = data.filter(function (d) {
        //             return d.state === measure;
        //         })
        //         return updated;
        //     }
        //     return data;
        // }
        // var workingData = selection();


        // var states = nestedData.map(function (d) {
        //     return d.key;
        // });
        data.sort(function (a, b) { return b.total - a.total; });
        
        var xScale = d3.scaleBand()
            .rangeRound([0, drawWidth])
            .paddingInner(0.05)
            .align(0.1)
            .domain(data.map(function (d) {
            //console.log("state", d.state)
            return d.state;
        }));

        // var y = d3.scaleLinear()
        //     .rangeRound([drawHeight, 0]);
        var yScale = d3.scaleLinear()
            .rangeRound([drawHeight,0])
            .domain([0, d3.max(data, function (d) {
            //console.log("domain",d.total);
            return d.total;
        })]).nice();

        var keys = data.columns.slice(1);

        var colorScale = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory20);

        var svg = d3.select('#vis')
            .append('svg')
            .attr('width', width)
            .attr('height', height+60);

        // Append a `g` element to your svg in which you'll draw your bars. Store the element in a variable called `g`, and
        // Transform the g using `margin.left` and `margin.top`
        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('height', drawHeight)
            .attr('width', drawWidth);

        // var test = d3.stack().keys([function (d) {
        //     return d.key;
        // }]);
        //console.log(test(nestedData));

        var xAxis = d3.axisBottom().scale(xScale);
        var yAxis = d3.axisLeft().scale(yScale);

        var stacks = g.append('g').selectAll('g').data(d3.stack().keys(keys)(data))
        .enter().append("g")
            .attr("fill", function (d) {
                //console.log(d);
                return colorScale(d.key);
            });

        var rects = stacks.selectAll("rect")
            .data(function (d) {
                return d;
            }); 

        rects.enter().append("rect")
            .attr("x", function (d) {
                //console.log("x:",d.data.state) 
                return xScale(d.data.state);
            })

            //.easeLinear(500)
            .attr("y", function (d) {
                return yScale(d[1]);
            })
                        .transition()
            .ease(d3.easeExp)
            .duration(4000)
            // .duration(function(d,i){
            // return 500* i/2;
            // }) 
            .attr("height", function (d) {
                return yScale(d[0]) - yScale(d[1]);
            })
            .attr("width", xScale.bandwidth());

        var xAxisLabel = svg.append('g').attr('transform', 'translate(' +margin.left+ ',' +(drawHeight + margin.top)+ ')')
                        .attr('class', 'axis')
                        .call(xAxis);
        
        xAxisLabel.selectAll('text')
            .attr('x',0)
            .attr('y',0)
            .attr('transform','rotate(-45)')
            .attr('alignment-baseline', 'hanging')
            .style('text-anchor','end');
        
        var yAxisLabel = svg.append('g').attr('transform','translate(' +margin.left+ ',' +(margin.top)+ ')')
                    .attr('class', 'axis')
                    .attr("fill", "#000")
                    .call(yAxis)
                    .attr('x', 4)
                    .append('text')
                    .attr("fill", "#000")
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "start")
                    .text('Dollars');

        // var legend = g.append("g")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", 10)
        //     .attr("text-anchor", "end")
        //     .selectAll("g")
        //     .data(keys.slice().reverse())
        //     .enter().append("g")
        //     .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        // legend.append("rect")
        //     .attr("x", drawWidth - 19)
        //     .attr("width", 19)
        //     .attr("height", 19)
        //     .attr("fill", colorScale);

        // legend.append("text")
        //     .attr("x", drawWidth - 24)
        //     .attr("y", 9.5)
        //     .attr("dy", "0.32em")
        //     .text(function (d) { return d; });


        // var draw = function() {

        // }
        // var weight = d3.scale.linear()
        //     .domain()
        //         // Call your draw function
        //         draw();

        //         // Listen to change events on the input elements
        //         $("input").on('change', function() {
        //             // Set your measure variable to the value (which is used in the draw funciton)
        //             measure = $(this).val();

        //             // Draw your elements
        //             draw();
        //         });
    });
});