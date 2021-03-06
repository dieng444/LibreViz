# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo

from scrapy.conf import settings
from floss.items import WikipediaRowItem
from floss.items import WikipediaSoftwareItem

# Pipeline chargé de stocker des listes de logiciels dans MongoDB
# (Nos listes sont stockées sous forme de lignes de tableaux.)
class RowsItemsPipeline(object):
    def __init__(self):
        connection = pymongo.MongoClient(settings['MONGODB_SERVER'], settings['MONGODB_PORT'])
        db = connection[settings['MONGODB_DB']]
        self.collection = db[settings['MONGODB_ROWS_COLLECTION']] # On utilise la collection de lignes (listes de logiciels)

    def process_item(self, item, spider):
        if not isinstance(item,WikipediaRowItem):
            return item # Si ce n'est pas un objet WikipediaRowItem, on transmet le traitement à l'autre pipeline
        self.collection.insert(dict(item))

# Pipeline chargé de stocker les fiches détaillées de chaque logiciel dans MongoDB
# (En fait, on aspire la page de détails de chacun des logiciels sur Wikipédia.)
class SofwareItemsPipeline(object):
    def __init__(self):
        connection = pymongo.MongoClient(settings['MONGODB_SERVER'], settings['MONGODB_PORT'])
        db = connection[settings['MONGODB_DB']]
        self.collection = db[settings['MONGODB_SOFTWARE_COLLECTION']] # On utilise la collection de logiciels (fiches d'identité)

    def process_item(self, item, spider):
        if not isinstance(item,WikipediaSoftwareItem):
            return item # Si ce n'est pas un objet WikipediaSoftwareItem, on transmet le traitement à l'autre pipeline
        self.collection.insert(dict(item))
