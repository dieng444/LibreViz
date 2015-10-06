function loadGraph(dataFile)
{
    var width = 782,// window.innerWidth,
        height = 620;// window.innerHeight;

    // var color = d3.scale.ordinal();

    var force = d3.layout.force()
        .charge(-2000)
        .gravity(0.1)
        .linkDistance(180)
        .size([width, height]);


    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json(dataFile, function(error, graph) {
    if (error) throw error;

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    //console.log(graph.links);return;
    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")

    var gnodes = svg.selectAll('g.gnode')
        .data(graph.nodes)
        .enter()
        .append('g')
        .classed('gnode', true);

    /*var foreignObject = gnodes.append("foreignObject")
        //.data(graph.nodes)
        .attr("width", 100)
        .attr("height", 100);*/

    //var a = foreignObject.append('');
        //.attr('href',"/"+function(d) { return d.name; })
        //.text(function(d) { return d.name; });

    var node = gnodes.append("circle")
        .attr("class", "node")
        .attr("r", 35)
        .on("click", function(d) { location.href = "/"+d.name;})
        // .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    var labels = gnodes.append("text")
        .attr("x", 0)
        .attr("y", -39)
        .on("click", function(d) { location.href = "/"+d.name})
        .text(function(d) { return d.name; });

    //~ var images = gnodes.append("image")
    //~ .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Wilber-gimp.png/96px-Wilber-gimp.png")
    //~ .attr("x", 0)
    //~ .attr("y", 0)
    //~ .attr("width", 80)
    //~ .attr("height", 80)
    //~ .on("click", function(d) {alert(d.name);});

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        gnodes.attr("transform", function(d) {
            return 'translate(' + [d.x, d.y] + ')';
        });
    });
    });
}
//Appel à la function
//console.log(location.pathname);
if (location.pathname=="/") {
    loadGraph("data/categorie.json");
} else
    loadGraph("data/sous_etapes.json");
