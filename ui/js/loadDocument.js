function loadDocument () {
	// Apparition/Disparition de la sidebar
	var sidebarStatus = Cookies.get( "sidebarStatus" );
	var flag;
	if (sidebarStatus == "off") {
		flag = false;
		$( ".ui.sidebar" ).hide();
		if ($( window ).width() >= 1400) {
			$( "#power" ).css( "background-position", "-51px 0" );
		} else {
			$( "#power" ).css( "background-position", "-43px 0" );
		}
		$( "#power" ).tooltip( {content: "Afficher le menu"} );
	} else {
		flag = true;
		$( ".ui.sidebar" ).show();
		$( "#power" ).css( "background-position", "0 0" );
		$( "#power" ).tooltip( {content: "Cacher le menu"} );
	}

	$( "#power" ).click(function() {
		if (flag == true) { // Sidebar invisible
			flag = false;
			$( this ).tooltip( {content: "Afficher le menu"} );
			if ($( window ).width() >= 1400) {
				$( "#power" ).css( "background-position", "-51px 0" );
			} else {
				$( "#power" ).css( "background-position", "-43px 0" );
			}
			Cookies.set( "sidebarStatus", "off", { expires: 1 });
		} else { // Sidebar visible
			flag = true;
			$( "#power" ).tooltip( {content: "Cacher le menu"} );
			$( "#power" ).css( "background-position", "0 0" );
			Cookies.set( "sidebarStatus", "on", { expires: 1 });
		}
		$( ".ui.sidebar" ).toggle( "slide", "slow" );
	});

	// Gestion du drag & drop pour la tablette
	$( "#viz" ).draggable({ cancel: "svg", scroll: false });

	$( "#viz" ).mouseup(function() {
		var top = $( "#viz" ).position().top;
		var left = $( "#viz" ).position().left;
		Cookies.set( "tabletTopPosition", top, { expires: 1 });
		Cookies.set( "tabletLeftPosition", left, { expires: 1 });
	});

	var top = Cookies.get( "tabletTopPosition" )
	var left = Cookies.get( "tabletLeftPosition" )
	$( "#viz" ).css( "transform", "translate(" + left + "px, " + top + "px)" );

	// Gestion du module de recherche
	$('.ui.search')
		.search({
			maxResults: 10,
			type : 'category',
			apiSettings : {
			  url: 'http://localhost:8080/search/{query}',
			  onResponse : function(serverResponse) {
				var response = { results : {} };
				if(!serverResponse || !serverResponse.result) {
				  return;
				}
				// Transformation de la réponse du serveur
				// afin qu'elle fontionne avec le search
				$.each(serverResponse.result, function(index, item) {
				  var name   = item.nom || 'Unknown',
					  maxResults = 8;
				  if(index >= maxResults) {
					return false;
				  }
				  // création d'une nouvelle catégorie de nom
				  if(response.results[name] === undefined) {
					response.results[name] = {
					  results : []
					};
				  }
				  // ajout du résultat à la catégorie
				  response.results[name].results.push({
					title : item.nom,
				  });
				});
				return response;
			  }
			},
			onSelect: function(result, response) {
				ajaxSend(result.title);
			}
		});

	// Suppression des préférences
	$( "#reset-prefs" ).click(function() {
		$(".ui.small.modal").modal("setting", {
			onApprove: function () {
				Cookies.remove( "labelState" );
				Cookies.remove( "labelColor" );
				Cookies.remove( "shapeColor" );
				Cookies.remove( "backgroundColor" );
				Cookies.remove( "shape" );
				Cookies.remove( "tabletTopPosition" );
				Cookies.remove( "tabletLeftPosition" );
				location.reload();
			}
		}).modal("show");
	});

	// Gestion des labels
	if (Cookies.get( "labelState" ) == "off") {
		$( "#toggleLabels" ).prop( "checked", true);
	} else {
		$( "#toggleLabels" ).prop( "checked", false);
	}

	$('.ui.checkbox').checkbox({
		onChecked: function() {
			$( "svg g text" ).fadeOut();
			Cookies.set( "labelState", "off", { expires: 1 });
		},
		onUnchecked: function() {
			$( "svg g text" ).fadeIn();
			Cookies.set( "labelState", "on", { expires: 1 });
			location.reload();
		}
	});

	// Gestion du zoom
	$( "#viz" ).panzoom({
		disablePan: true,
		increment: 0.2,
		minScale: 0.7,
		maxScale: 1.3,
		$zoomIn: $( "#zoom-in" ),
		$zoomOut: $( "#zoom-out" ),
		$reset: $( "#zoom-reset" )
	});

	$( "#zoom-in, #zoom-out" ).click(function() {
		$( ".d3-tip" ).css("display", "none");
	});

	$( "#zoom-reset" ).click(function() {
		$( ".d3-tip" ).css("display", "inherit");
	});

	// Gestion des couleurs
	function inputColorPickers(name, selection, property) {
		$( "#colorpicker-" + name ).on("input", function() {
			$( selection ).css( property, $( this ).val() );
			Cookies.set( name + "Color", $( this ).val(), { expires: 1 });
		});
	}

	inputColorPickers("label", "svg g text", "fill");
	inputColorPickers("shape", ".node", "fill");
	inputColorPickers("background", "svg", "background-color");

	function colorpickerUpdate(pickerType, cookieName, defaultColor) {
		if (Cookies.get( cookieName ) === "undefined") {
			$( "#colorpicker-" + pickerType ).val( defaultColor );
		} else {
			$( "#colorpicker-" + pickerType ).val( Cookies.get( cookieName ) );
		}
	}

	colorpickerUpdate("label", "labelColor", "#000");
	colorpickerUpdate("shape", "shapeColor", "#C0C0C0");
	colorpickerUpdate("background", "backgroundColor", "F2F2F2");

	// Gestion des formes
	function clickShapePickers(name) {
		$( "#" + name + "-picker" ).click(function() {
			Cookies.set( "shape", name, { expires: 1 });
			location.reload();
		});
	}

	clickShapePickers("circle");
	clickShapePickers("square");
	clickShapePickers("star");
}
// Gestion de la pop-up de logiciel (fiche de présentation)
function showPopup () {
	 $('.ui.long.modal')
		.modal('setting', 'transition', 'vertical flip')
		.modal('show')
	;
}
function parseSoftwareInfo (data) {
	var item = data.result[0];
	var content = 	'<i class="close icon"></i>\n\
					<div class="header">'+item.nom+'</div>\n\
					<div class="image content">';
					if (item.images.length > 0) {
			 content+='<div class="ui small image">\n\
							<img id="logo" src="/images/'+item.images[0].path+'" alt="'+item.nom+'">\n\
						</div>';
					}
				content+='<div class="description">';
							if (item.developpeurs.length > 0) {
				content+= '<i class="users icon"></i>\n\
						   <div class="ui header"> Développeur(s) : <br>';
								for (i in item.developpeurs) {
					content+= '<span style="margin-left:30px;">'+item.developpeurs[i]+'</span><br>';
								}
				content+= '</div>';
							}
							if (item.version!=" ") {
				  content+='<i class="history icon"></i>\n\
							<div class="ui header">Version : <br>\n\
								<span style="margin-left:30px;">'+item.version+'</span>\n\
							</div><br>';
							}
							if (item.technologies.length > 0) {
				 content+= '<i class="code icon"></i>\n\
							<div class="ui header"> Technologie(s) : <br>';
								for (i in item.technologies) {
					 content+='<span style="margin-left:30px;">'+item.technologies[i]+'</span><br>';
								}
				  content+='</div>';
							}
							if (item.langues.length > 0) {
				 content+='<i class="translate icon"></i>\n\
						   <div class="ui header"> Langue(s) : <br>';
								for (i in item.langues) {
					content+='<span style="margin-left:30px;">'+item.langues[i]+'</span><br>';
								}
				 content+='</div>';
							}
							;
							if (item.licences.length > 0) {
				content+='<i class="copyright icon"></i>\n\
						  <div class="ui header"> Licence(s) : <br>';
								for (i in item.licences) {
					content+='<span style="margin-left:30px;">'+item.licences[i]+'</span><br>';
								}
				content+='</div>';
							}
							if (item.site!=" " && item.site!="Site officiel") {
			  content+= '<i class="world icon"></i>\n\
						 <div class="ui header">Site web :</div>\n\
						 <a id="site-web" href="http://'+item.site+'" target="_blank">'+item.site+'</a><br>';
							}
							if (item.description!=" ") {
				content+='<div id="description">'+item.description+'</div>';
							}
			content+='</div>\n\
				</div>';

	$(".ui.long.modal").html(content);
	//Désactivation des liens dans la description
	$("#description a").each(function() {
		$(this).removeAttr("href");
		$(this).replaceWith(function () {
			return $('<span/>', {
				html: $(this).html()
			});
		});
	});
	//Affichage de la popup
	showPopup();
}
/**
 * Permet de récupérer les informations d'un logiciel donné
 * depuis le serveur.
 * @param software : le logiciel à chercher
 */
function ajaxSend (software) {
		$.ajax({
			  url: "http://localhost:8080/logiciel/"+software,
			  type: "GET",
			  dataType: "json"
		}).success(parseSoftwareInfo);
}

$( document ).ready(function() {
    loadDocument();
});
