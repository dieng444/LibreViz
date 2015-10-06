var express = require('express');
var session = require('cookie-session'); 
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var jsonfile = require('jsonfile');

var app = express();

var findCategories = function(db, callback) {
  var collection = db.collection('items');
  collection.distinct("categorie",function(err, result) {
    callback(result);
  });
}
var findSubCategories = function(category,db,callback) {
  var collection = db.collection('items');
   collection.find({categorie:category},{fonctionnalite:1}).toArray(function(err, result) {
    callback(result);
  });
}
var findSoftware = function(subCategory,db,callback) {
  var collection = db.collection('items');
   collection.find({fonctionnalite:subCategory},{logiciel_libre_linux:1}).toArray(function(err, result) {
    callback(result);
  });
}
var url = 'mongodb://localhost:27017/crawlingproject';
var items;
var links;
var subCategories = [];

/**
 * Fonction permettant de reformater 
 * le json provenant de la base
 * */
function parser(result,fileName,type,param)
{
	items = [];
	links = [];
	//console.log(result);return;
	for(var i=0, j=1; i < result.length; i++, j++) {
		if (type=="category") {
			items[i] = {"name":result[i]};
			links[i] = {"source":0,"target":j};
		}
		else if (type=="subCategory") {
			//console.log(result);return;
			items[i] = {"name":result[i].fonctionnalite[0]};
			links[i] = {"source":0,"target":j};
		} else {
			var sfw_tab = result[i].logiciel_libre_linux;
			//console.log(sfw_tab);
			//console.log(result.length);
			for (var k=0, l=1;  k < sfw_tab.length; k++,l++) {
				items[k] = {"name":sfw_tab[k]};
				links[k] = {"source":0,"target":l};
			}
		}
	}
	if (type=="category") {
		items.unshift({"name":"Catégorie"});
	} else if(type=="subCategory") {
		items.unshift({"name":param});
	} else {
		items.unshift({"name":param});
	}
		
	var data = {'nodes':items,'links':links};
	//console.log(data);
	/**
	 * Création du fichier json
	 * */
	jsonfile.writeFile(fileName, data, {spaces: 2}, function (err) {
		//console.error(err)
	});
}
/**
 * Permet de charger les données depuis MOngoDB
 * @param param : paramètre reçu de l'url 
 * **/
 var isSubCategoryLoaded = false;
 
function loadDataMongo(type, param)
{
	MongoClient.connect(url, function(err, db) {
		console.log("Connected correctly to server");
		if(type=="category") {
			findCategories(db, function(result) {
				//console.log(result);
				parser(result,'ui/data/categorie.json',"category");
				db.close();
			});
		} else {
			if (!isSubCategoryLoaded) {
				findSubCategories (param, db, function(result) {
					parser(result,'ui/data/sous_etapes.json',"subCategory",param);
					db.close();
				});
				isSubCategoryLoaded = true;
			} else {
				if(isSubCategoryLoaded) {
					findSoftware(param, db, function(result) {
						//console.log(result);
						parser(result,'ui/data/sous_etapes.json',"software",param);
						db.close();
					});
				}
				isSubCategoryLoaded = false;
			}
		}
	});
}
/**
 * Spécification du chemin des fichiers static
 * */
app.use(express.static(__dirname + '/ui/'))
/**
 * Route d'affichage des catégories
 * */
.get('/', function(req, res) {
	loadDataMongo("category");
    res.render('index.ejs', {});
})
/**
 * Route d'affichage sous étapes
 * */
.get('/:root', function(req, res) {
	 
	loadDataMongo("subStep",req.params.root);
	//loadDataMongo("software",true,req.params.root);
    res.render('index.ejs', {});
});

app.listen(8080);
