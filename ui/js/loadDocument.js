var shape = "circle";

$( document ).ready(function() {

    // Gestion du comportement de la sidebar
    $( "#power" ).click(function() {
        // Si la sidebar n'est pas visible, le bouton est gris...
        if ($( ".ui.sidebar" ).attr( "style" ) != "display: none;") {
            $( "#power" ).attr( "title", "Afficher le menu" );
            if ($( window ).width() >= 1366) {
                $( "#power" ).css( "background-position", "-51px 0" );
            } else {
                $( "#power" ).css( "background-position", "-43px 0" );
            }
        } else { // ... sinon il est rouge
            $( "#power" ).attr( "title", "Cacher le menu" );
            $( "#power" ).css( "background-position", "0 0" );
        }
        $( ".ui.sidebar" ).toggle( "slide", "slow");
    });

    // Gestion du comportement de la tablette
    $( "#viz" ).draggable({ scroll: false });

    $( "svg" ).mouseover(function() {
        $( "#viz" ).draggable({ disabled: true });
    });

    $( "svg" ).mouseout(function() {
        $( "#viz" ).draggable( "enable" );
    });

    // Activation des tooltips
    $( document ).tooltip();

    // Gestion du module de recherche
    $('.ui.search')
      .search({

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
        ]
      })
    ;

    // Gestion des labels
    $('.ui.checkbox').checkbox({
        onChecked: function() {
            $( "svg g text" ).fadeOut();
        },
        onUnchecked: function() {
            $( "svg g text" ).fadeIn();
        }
    });

    // Gestion des couleurs
    $( "#colorpicker-fond" ).on("input", function() {
        $( "svg" ).css( "background-color", $( this ).val() );
    });

    $( "#colorpicker-forme" ).on("input", function() {
        $( ".node" ).css( "fill", $( this ).val() );
    });

    // Gestion des formes
    $( "#square-picker" ).click(function() {
        $( "svg" ).remove();
        shape = "rectangle";
        loadGraph("data/categorie.json");
        $( "svg" ).mouseover(function() {
            $( ".pusher" ).draggable({ disabled: true });
        });

        $( "svg" ).mouseout(function() {
            $( ".pusher" ).draggable( "enable" );
        });
    });

    $( "#circle-picker" ).click(function() {
        $( "svg" ).remove();
        shape = "circle";
        loadGraph("data/categorie.json");
        $( "svg" ).mouseover(function() {
            $( ".pusher" ).draggable({ disabled: true });
        });

        $( "svg" ).mouseout(function() {
            $( ".pusher" ).draggable( "enable" );
        });
    });

});
