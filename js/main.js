// /* Create a treemap of country level measures. Inspiration drawn from https://bl.ocks.org/mbostock/4063582.
//  */
$(function() {
    // Read in your data. On success, run the rest of your code
    d3.csv('DeptEducationSpending2014.csv', function(error, data) {
         
         var margin = {
                top: 40,
                right: 10,
                bottom: 10,
                left: 10
            },
            width = 960,
            height = 500,
            drawWidth = width - margin.left - margin.right,
            drawHeight = height - margin.top - margin.bottom,
            measure = 'fertility_rate'; // variable to visualize
        
        
        var nestedCountry = d3.nest()
            .key(function(d) {
                return d.state;
            })
            .entries(data);
            //console.log(nestedCountry);
        
    

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