// Les données
var categories= ['', 'Bureautique', 'Graphisme', 'Internet', 'Loisirs', 'Mathématiques', 'Multimédia', 'Progiciels', 'Publication', 'Serveurs', 'Système d\'information géographique', 'Traduction de textes', 'Utilitaires'];

var nbSubcategories = [9, 7, 10, 2, 7, 3, 5, 5, 1, 1, 2, 11];

var colors = ['#2383c1', '#64a61f', '#7b6788', '#a05c56', '#7c9058', '#961919', '#d8d239', '#e98125', '#d0743c', '#6ada6a', '#0b6197', '#207f32'];

// Paramétrage de l'histogramme
var grid = d3.range(16).map(function(i){
    return {'x1':0, 'y1':0, 'x2':0, 'y2':480};
});

var tickVals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

var xscale = d3.scale.linear()
                .domain([0,15])
                .range([0,450]);

var yscale = d3.scale.linear()
                .domain([0,categories.length])
                .range([0,480]);

var colorScale = d3.scale.quantize()
                .domain([0,colors.length])
                .range(colors);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) { return "<span>" + d + "</span>"; });

tip.direction('e');

var canvas = d3.select('#screen')
                .append('svg')
                .attr({'width':782,'height':620})
                .call(tip);

var grids = canvas.append('g')
                  .attr('id','grid')
                  .attr('transform','translate(150,10)')
                  .selectAll('line')
                  .data(grid)
                  .enter()
                  .append('line')
                  .attr({'x1':function(d,i){ return i*30; },
                         'y1':function(d){ return d.y1; },
                         'x2':function(d,i){ return i*30; },
                         'y2':function(d){ return d.y2; },
                    })
                  .style({'stroke':'#adadad','stroke-width':'2px'});

var xAxis = d3.svg.axis();
    xAxis
        .orient('bottom')
        .scale(xscale)
        .tickValues(tickVals);

var yAxis = d3.svg.axis();
    yAxis
        .orient('left')
        .scale(yscale)
        .tickSize(6)
        .tickFormat(function(d,i){ return categories[i]; })
        .tickValues(d3.range(15));

var y_xis = canvas.append('g')
                  .attr("transform", "translate(150,0)")
                  .attr('id','yaxis')
                  .call(yAxis);

var x_xis = canvas.append('g')
                  .attr("transform", "translate(150,480)")
                  .attr('id','xaxis')
                  .call(xAxis);

var chart = canvas.append('g')
                    .attr("transform", "translate(150,0)")
                    .attr('id','bars')
                    .selectAll('rect')
                    .data(nbSubcategories)
                    .enter()
                    .append('rect')
                    .attr('height',33)
                    .attr({'x':0,'y':function(d,i){ return yscale(i)+19; }})
                    .style('fill',function(d,i){ return colorScale(i); })
                    .attr('width',function(d){ return 0; })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

var transit = d3.select("svg").selectAll("rect")
                    .data(nbSubcategories)
                    .transition()
                    .duration(1000)
                    .attr("width", function(d) {return xscale(d); });
