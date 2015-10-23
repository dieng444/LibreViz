# LibreViz

LibreViz est une application développée par Macky Dieng (dieng444) et Baptiste Vannesson (Badacadabra) à l'université de Caen Normandie. L'objectif était initialement de mettre en œuvre les nouvelles technologies vues en cours, et en particulier de concevoir une application de A à Z sans avoir recours au trio très (trop ?) classique Apache-PHP-MySQL.

## Présentation fonctionnelle de l'application

LibreViz offre une expérience de visualisation originale et hautement interactive des logiciels libres sous GNU/Linux, à partir de données issues de Wikipédia. L'utilisateur peut configurer la zone de visualisation comme il l'entend, en choisissant ses couleurs, ses formes, le niveau de zoom, la position de la zone d'affichage, etc. Pour des raisons évidentes d'ergonomie, la plupart de ces configurations sont enregistrées temporairement (mais facilement réinitialisables) afin que l'utilisateur ait une expérience cohérente, quelle que soit la page visitée. En outre, pour le plus grand bonheur des libristes, la chanson du logiciel libre (au format Ogg !) pourra accompagner vos recherches. :D

Par défaut, au chargement de l'application, l'utilisateur peut voir le graphe qui va servir de navigation pour découvrir de nouveaux logiciels. Au tout début du processus de navigation, l'utilisateur a le choix entre un certain nombre de catégories. S'il décide de cliquer sur une catégorie en particulier, il est amené vers un nouveau graphe qui affiche toutes les sous-catégories de la catégorie sélectionnée. Si l'utilisateur sélectionne ensuite une sous-catégorie, l'application lui présente tous les logiciels présents dans cette sous-catégorie. Et enfin, si l'utilisateur clique sur un logiciel, l'application lui fournit des informations plus détaillées sur ce dernier. Bien sûr, si l'utilisateur cherche des informations sur un logiciel en particulier, il n'est pas nécessaire de naviguer de cette façon dans la hiérarchie des catégories et sous-catégories. Dans ce cas de figure, il est tout à fait possible de taper directement le nom du logiciel dans le moteur de recherche prévu à cet effet.

En dehors de la recherche de logiciels et d'informations sur ces logiciels, LibreViz donne quelques statistiques de base. En l'occurrence, l'utilisateur peut voir sur un histogramme le nombre de sous-catégories par catégorie, plutôt que de compter à la main en naviguant dans le graphe principal... L'utilisateur peut voir également sur un camembert (ou plutôt un anneau), la répartition en pourcentage des catégories, en fonction du nombre de leurs sous-catégories. On peut ainsi avoir une idée de l'envergure de chacune des catégories.

Enfin, l'application n'a pas été conçue pour les terminaux mobiles. Elle a cependant été optimisée pour les grands écrans et adaptée pour les écrans plus traditionnels en 1024 x 768.

## Présentation technique de l'application

Les principales technologies utilisées dans le cadre du développement sont :

* Scrapy (Python)
* MongoDB (NoSQL)
* Node.js (JavaScript)
* jQuery (JavaScript)
* D3.js (JavaScript)
* Semantic UI (HTML/CSS/JavaScript)

### Crawling

Pour récupérer des données, nous avons lancé un crawl avec Scrapy sur cette page [Wikipédia](https://fr.wikipedia.org/wiki/Correspondance_entre_logiciels_libres_et_logiciels_propri%C3%A9taires) qui référence un certain nombre de logiciels, triés par catégories et sous-catégories. À vrai dire, il était initialement prévu de proposer un système d'équivalence entre logiciels libres et propriétaires, mais nous avons finalement décidé de nous concentrer uniquement sur les logiciels libres disponibles sous GNU/Linux pour ne pas tout mélanger comme sur [AlternativeTo](http://alternativeto.net) (qui reste au demeurant un site intéressant pour diverses raisons). Il a donc fallu crawler des tableaux, mais aussi des pages plus traditionnelles sous Wikipédia pour récupérer des données exploitables. À l'issue de cette phase, et en utilisant les pipelines de Scrapy, nous avons été en mesure d'alimenter automatiquement notre base de données MongoDB avec du BSON.

### Back-end

Côté back-end, l'application repose entièrement sur le couple Node.js / MongoDB. À l'issue du crawl, comme nous l'avons vu, toutes les données extraites des pages sont insérées automatiquement dans MongoDB grâce aux pipelines de Scrapy. Ces données en base sont ensuite manipulées en Node.js, notamment pour fournir à D3.js des objets JSON correctement formatés. Le script serveur en Node.js s'appuie, grâce au module Express, sur un ensemble de routes qui lancent des traitements spécifiques en fonction des requêtes des utilisateurs. Le système d'encodage des URLs, fait maison, permet de garantir une navigation lisible.

### Front-end

Côté front-end, l'application s'articule autour de plusieurs technologies : D3.js pour la partie visualisation, jQuery pour une manipulation simplifiée du DOM et des événements JavaScript, et enfin Semantic UI pour les aspects purement graphiques. Dans cette application, nous avons voulu essayer D3.js sous différents angles, ce qui explique notamment l'utilisation de plusieurs layouts propres à la bibliothèque : le diagramme de force, l'histogramme, et le camembert (l'anneau, plus précisément...). Quant à Semantic UI, disponible via npm, force est d'admettre qu'il s'agit là d'une alternative sérieuse à Bootstrap pour créer des applications propres et professionnelles en un temps limité.

## Le mot de la fin

LibreViz : en route vers le logiciel libre ! :)

![GNU/Linux (FSF)](https://upload.wikimedia.org/wikipedia/commons/8/80/Gnu-and-penguin-color.png)
