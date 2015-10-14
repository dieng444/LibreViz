$( document ).ready(function() {

    // Le canevas sera différent selon la définition d'écran
    var width, height, titleFontSize, subtitleFontSize, labelFontSize, pieInnerRadius, pieOuterRadius;

    if ($( window ).width() >= 1400) {
        width = 782;
        height = 620;
        titleFontSize = 35;
        subtitleFontSize = 15;
        labelFontSize = 15;
        pieInnerRadius = "73%";
        pieOuterRadius = "80%";
    } else {
        width = 570;
        height = 451;
        titleFontSize = 30;
        subtitleFontSize = 13;
        labelFontSize = 12;
        pieInnerRadius = "83%";
        pieOuterRadius = "77%";
    }

    // Construction de l'anneau
    var pie = new d3pie("screen", {
        "header": {
            "title": {
                "text": "Catégories",
                "fontSize": titleFontSize,
                "font": "courier"
            },
            "subtitle": {
                "text": "Quelles sont les plus fournies ? *",
                "color": "#999999",
                "fontSize": subtitleFontSize,
                "font": "courier"
            },
            "location": "pie-center",
            "titleSubtitlePadding": 10
        },
        "footer": {
            "text": "* Déterminé à partir du nombre de sous-catégories",
            "color": "#999999",
            "fontSize": 15,
            "font": "courier",
            "location": "bottom-center"
        },
        "size": {
            "canvasHeight": height,
            "canvasWidth": width,
            "pieInnerRadius": pieInnerRadius,
            "pieOuterRadius": pieOuterRadius
        },
        "data": {
            "sortOrder": "label-asc",
            "content": [
                {
                    "label": "Bureautique",
                    "value": 9,
                    "color": "#2383c1"
                },
                {
                    "label": "Graphisme",
                    "value": 7,
                    "color": "#64a61f"
                },
                {
                    "label": "Internet",
                    "value": 10,
                    "color": "#7b6788"
                },
                {
                    "label": "Loisirs",
                    "value": 2,
                    "color": "#a05c56"
                },
                {
                    "label": "Multimédia",
                    "value": 7,
                    "color": "#961919"
                },
                {
                    "label": "Progiciels",
                    "value": 3,
                    "color": "#d8d239"
                },
                {
                    "label": "Publication",
                    "value": 5,
                    "color": "#e98125"
                },
                {
                    "label": "Serveurs",
                    "value": 5,
                    "color": "#d0743c"
                },
                {
                    "label": "SIG",
                    "value": 1,
                    "color": "#6ada6a"
                },
                {
                    "label": "Traduction",
                    "value": 1,
                    "color": "#0b6197"
                },
                {
                    "label": "Mathématiques",
                    "value": 2,
                    "color": "#7c9058"
                },
                {
                    "label": "Utilitaires",
                    "value": 11,
                    "color": "#207f32"
                }
            ]
        },
        "labels": {
            "outer": {
                "format": "label-percentage1",
                "pieDistance": 20
            },
            "inner": {
                "format": "none"
            },
            "mainLabel": {
                "fontSize": labelFontSize
            },
            "percentage": {
                "color": "#999999",
                "fontSize": 13,
                "decimalPlaces": 0
            },
            "value": {
                "color": "#cccc43",
                "fontSize": 13
            },
            "lines": {
                "enabled": true,
                "color": "#777777"
            },
            "truncation": {
                "enabled": true
            }
        },
        "tooltips": {
            "enabled": true,
            "type": "placeholder",
            "string": "{label}: {value}, {percentage}%"
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "speed": 400,
                "size": 10
            }
        },
        "misc": {
            "colors": {
                "segmentStroke": "#000000"
            }
        }
    });

});
