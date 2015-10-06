var width = window.innerWidth,
	height = window.innerHeight;

// var color = d3.scale.ordinal();

var force = d3.layout.force()
	.charge(-2000)
	.gravity(0.1)
	.linkDistance(300)
	.size([width, height]);

var svg = d3.select("section").append("svg")
	.attr("width", width)
	.attr("height", height);

d3.json("test_categories.json", function(error, graph) {
  if (error) throw error;

  force
	  .nodes(graph.nodes)
	  .links(graph.links)
	  .start();

  var link = svg.selectAll(".link")
	  .data(graph.links)
	.enter().append("line")
	  .attr("class", "link")

  var gnodes = svg.selectAll('g.gnode')
	  .data(graph.nodes)
	  .enter()
	  .append('g')
	  .classed('gnode', true);

  var node = gnodes.append("circle")
	  .attr("class", "node")
	  .attr("r", 42)
	  .on("click", function(d) {alert(d.name);})
	  // .style("fill", function(d) { return color(d.group); })
	  .call(force.drag);

  var labels = gnodes.append("text")
	  .attr("x", 0)
	  .attr("y", -48)
	  .on("click", function(d) {alert(d.name);})
	  .text(function(d) { return d.name; });

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
