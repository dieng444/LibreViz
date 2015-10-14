$(document ).ready(function() {

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

    // Gestion de la pop-up de logiciel (fiche de présentation)
    $( "#popup" ).click(function() {
         $('.ui.long.modal')
            .modal('setting', 'transition', 'vertical flip')
            .modal('show')
        ;
    });

    // Gestion du module de recherche
    $('.ui.search')
        .search({
            maxResults: 10,
            source: [
                {title: "Bureautique"},
                {title: "Graphisme"},
                {title: "Internet"},
                {title: "Loisirs"},
                {title: "Multimédia"},
                {title: "Progiciels"},
                {title: "Publication"},
                {title: "Serveurs"},
                {title: " (SIG)"},
                {title: "Système d'information géographique"},
                {title: "Traduction de textes"},
                {title: "Mathématique (y compris enseignement)"},
                {title: "Utilitaires"}
            ],
            onSelect: function(result, response) {
                location.href = "/categorie/" + result.title;
            }
        })
    ;

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

});
