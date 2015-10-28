var shape;
var backgroundColor;
var shapeColor;
var labelColor;
var labelState;

// L'utilisateur a-t-il customisé l'affichage ?
function testCustomDisplay(cookieName, defaultValue) {
    var property;
    if (Cookies.get( cookieName ) === "undefined") {
        property = defaultValue;
    } else {
        property = Cookies.get( cookieName );
    }
    return property;
}

shape = testCustomDisplay("shape", "circle");
backgroundColor = testCustomDisplay("backgroundColor", "#F2F2F2");
shapeColor = testCustomDisplay("shapeColor", "silver");
labelColor = testCustomDisplay("labelColor", "black");
labelState = testCustomDisplay("labelState", "on");

// On n'envoie pas les mêmes données sur toutes les pages...
/**
 * Petite subtilité pour cette première condition, car le pattern /categorie/
 * existe dans la route des catégories et celles des sous-/catégorie/
 * raison pour laquelle il faut vérifier que c'est bien le pattern /categorie/
 * de la route "categorie" qui match et non celui de la route des sous-catégorie,
 * pour éviter que le même fichier soit renvoyer dans les deux cas.
 * */
if (/categorie/i.test(location.pathname) && !/sous-categori/i.test(location.pathname))
    loadGraph("/data/subCategory.json", shapeColor); 
else if (/sous-categorie/i.test(location.pathname))
    loadGraph("/data/software.json", shapeColor); 
else
    loadGraph("data/category.json", "silver");

// Chargement du graphe
function loadGraph(dataFile)
{
    // Le canevas et la taille des formes seront différents selon la définition d'écran
    var vizWidth, vizHeight, linkDistance, radiusCircle, borderRect, scaleStar, textX, textY;

    if ($( window ).width() >= 1400) {
        width = 782;
        height = 620;
        linkDistance = 200;
        radiusCircle = 40;
        borderRect = 50;
        scaleStar = 1.5;
        textX = 0;
        textY = -43;
    } else {
        width = 570;
        height = 451;
        linkDistance = 130;
        radiusCircle = 30;
        borderRect = 40;
        scaleStar = 1;
        textX = 0;
        textY = -33;
    }

    // Initialisation d'un graphe de force
    var force = d3.layout.force()
        .charge(-2000)
        .gravity(0.1)
        .linkDistance(linkDistance)
        .size([width, height]);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return "<span>" + d.name + "</span>"; });

    // Création du canevas et création du graphe à partir des données
    var svg = d3.select("#screen")
        .append("svg")
        .attr("width", vizWidth)
        .attr("height", vizHeight)
        .style("background-color", backgroundColor)
        .call(tip);

    d3.json(dataFile, function(error, graph) {
      if (error) throw error;

      force
          .nodes(graph.nodes)
          .links(graph.links)
          .start();

      var link = svg.selectAll(".link")
          .data(graph.links)
          .enter().append("line")
          .attr("class", "link")

      var gnodes = svg.selectAll("g.gnode")
          .data(graph.nodes)
          .enter()
          .append("g")
          .classed("gnode", true)

    if (shape == "square") { // On crée des carrés...

        var node = gnodes.append("rect")
          .attr("class", "node")
          .attr("width", borderRect)
          .attr("height", borderRect)
          .attr("x", -25)
          .attr("y", -25)
          .style("fill", shapeColor)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .on("click", function(d) {

            /**
             * À voir pour SIG et les autres pour l'espace qui se trouve devant
             * */
            var cleaned_url = d.name.trim();
            var tab_s = cleaned_url.split(" "),
                url = " ",
                fullUrl = " ";
            if (tab_s.length > 1) {
                for (var i=0; i < tab_s.length; i++) {
                    url += tab_s[i]+"_";
                }
            }
            //Variable contenant l'url temporaire en formaté
            var tmp_url = tab_s.length > 1 ? url.substr(0, url.length - 1).trim() : cleaned_url;
            //Dynamisation du lien des noeuds en fonction du graph encours (catégorie, sous-catégorie...)
            if (/categorie/i.test(location.pathname) && !/sous-categori/i.test(location.pathname)) {
                fullUrl = "/sous-categorie/" + tmp_url;
			} else if (/sous-categorie/i.test(location.pathname)) {
                ajaxSend(tmp_url);
                return;
			}
            else
                fullUrl = "/categorie/" + tmp_url;

            location.href = fullUrl;
          })
          .call(force.drag);

    } else if (shape == "star") { // ... ou on crée des étoiles...

        var node = gnodes.append("polygon")
          .attr("class", "node")
          .attr("points", "50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180")
          .attr("transform", "scale(" + scaleStar + ") translate(-50, -190)")
          .style("fill", shapeColor)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .on("click", function(d) {

            /**
             * À voir pour SIG et les autres pour l'espace qui se trouve devant
             * */
            var cleaned_url = d.name.trim();
            var tab_s = cleaned_url.split(" "),
                url = " ",
                fullUrl = " ";
            if (tab_s.length > 1) {
                for (var i=0; i < tab_s.length; i++) {
                    url += tab_s[i]+"_";
                }
            }
            //Variable contenant l'url temporaire en formaté
            var tmp_url = tab_s.length > 1 ? url.substr(0, url.length - 1).trim() : cleaned_url;
            //Dynamisation du lien des noeuds en fonction du graph encours (catégorie, sous-catégorie...)
            if (/categorie/i.test(location.pathname) && !/sous-categori/i.test(location.pathname)) {
                fullUrl = "/sous-categorie/" + tmp_url;
			} else if (/sous-categorie/i.test(location.pathname)) {
                ajaxSend(tmp_url);
                return;
			}
            else
                fullUrl = "/categorie/" + tmp_url;

            location.href = fullUrl;
          })
          .call(force.drag);

    } else {  // ... sinon on crée des cercles

        var node = gnodes.append("circle")
          .attr("class", "node")
          .attr("r", radiusCircle)
          .style("fill", shapeColor)
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          .on("click", function(d) {

            /**
             * À voir pour SIG et les autres pour l'espace qui se trouve devant
             * */
            var cleaned_url = d.name.trim();
            var tab_s = cleaned_url.split(" "),
                url = " ",
                fullUrl = " ";
            if (tab_s.length > 1) {
                for (var i=0; i < tab_s.length; i++) {
                    url += tab_s[i]+"_";
                }
            }
            //Variable contenant l'url temporaire en formaté
            var tmp_url = tab_s.length > 1 ? url.substr(0, url.length - 1).trim() : cleaned_url;
            //Dynamisation du lien des noeuds en fonction du graph encours (catégorie, sous-catégorie...)
            if (/categorie/i.test(location.pathname) && !/sous-categori/i.test(location.pathname)) {
                fullUrl = "/sous-categorie/" + tmp_url;
			} else if (/sous-categorie/i.test(location.pathname)) {
                ajaxSend(tmp_url);
                return;
			}
            else
                fullUrl = "/categorie/" + tmp_url;

            location.href = fullUrl;
          })
          .call(force.drag);

     }

    if (labelState != "off") {
        var labels = gnodes.append("text")
          .attr("x", textX)
          .attr("y", textY)
          .style("fill", labelColor)
          .text(function(d) { return d.name; });
    }
    // On enlève l'écouteur d'événement (clic) sur le premier nœud (central)
    d3.select('.node').on('click', null);

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
