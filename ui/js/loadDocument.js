$(document ).ready(function() {

    // Activation de la tooltip du bouton qui gère la sidebar
    var flag = true;
    $( "#power" ).tooltip( {content: "Cacher le menu"} );

    // Apparition/Disparition de la sidebar
    $( "#power" ).click(function() {
        // Si la sidebar n'est pas visible, le bouton est gris...
        if (flag == true) {
            flag = false;
            $( this ).tooltip( {content: "Afficher le menu"} );
            if ($( window ).width() >= 1400) {
                $( "#power" ).css( "background-position", "-51px 0" );
            } else {
                $( "#power" ).css( "background-position", "-43px 0" );
            }
        } else { // ... sinon il est rouge
            flag = true;
            $( "#power" ).tooltip( {content: "Cacher le menu"} );
            $( "#power" ).css( "background-position", "0 0" );
        }
        $( ".ui.sidebar" ).toggle( "slide", "slow" );
    });

    // Gestion du drag & drop pour la tablette
    $( "#viz" ).draggable({ scroll: false });

    $( "svg" ).mouseover(function() {
        $( "#viz" ).draggable( "disable" );
    });

    $( "svg" ).mouseout(function() {
        $( "#viz" ).draggable( "enable" );
    });

    // Gestion de la pop-up de logiciel (fiche de présentation)
    $( "#popup" ).click(function() {
         $('.ui.modal')
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
        increment: 0.2,
        minScale: 0.5,
        maxScale: 1.5,
        $zoomIn: $( "#zoom-in" ),
        $zoomOut: $( "#zoom-out" ),
        $reset: $( "#zoom-reset" )
    });

    // Gestion des couleurs
    $( "#colorpicker-label" ).on("input", function() {
        var labelColor = $( this ).val();
        $( "svg g text" ).css( "fill", $( this ).val() );
        Cookies.set( "labelColor", labelColor, { expires: 1 });
    });

    $( "#colorpicker-fond" ).on("input", function() {
        var backgroundColor = $( this ).val();
        $( "svg" ).css( "background-color", $( this ).val() );
        Cookies.set( "backgroundColor", backgroundColor, { expires: 1 });
    });

    $( "#colorpicker-forme" ).on("input", function() {
        var shapeColor = $( this ).val();
        $( ".node" ).css( "fill", $( this ).val() );
        Cookies.set( "shapeColor", shapeColor, { expires: 1 });
    });

    function colorpickerUpdate(pickerType, cookieName, defaultColor) {
        if (Cookies.get( cookieName ) === "undefined") {
            $( "#colorpicker-" + pickerType ).val( defaultColor );
        } else {
            $( "#colorpicker-" + pickerType ).val( Cookies.get( cookieName ) );
        }
    }

    colorpickerUpdate("label", "labelColor", "#000");
    colorpickerUpdate("fond", "backgroundColor", "F2F2F2");
    colorpickerUpdate("forme", "shapeColor", "#C0C0C0");

    // Gestion des formes
    $( "#square-picker" ).click(function() {
        Cookies.set( "shape", "square", { expires: 1 });
        location.reload();
    });

    $( "#star-picker" ).click(function() {
        Cookies.set( "shape", "star", { expires: 1 });
        location.reload();
    });

    $( "#circle-picker" ).click(function() {
        Cookies.set( "shape", "circle", { expires: 1 });
        location.reload();
    });

});
