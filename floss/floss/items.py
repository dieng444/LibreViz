# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class FramasoftItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    name = scrapy.Field()
    category = scrapy.Field()
    subcategory = scrapy.Field()
    os = scrapy.Field()
    langage = scrapy.Field()
    code = scrapy.Field()
    size = scrapy.Field()
    license = scrapy.Field()
    version = scrapy.Field()
    description = scrapy.Field()

class WikipediaItem(scrapy.Item):
    categorie = scrapy.Field()
    fonctionnalite = scrapy.Field()
    logiciel_proprietaire = scrapy.Field()
    logiciel_libre_windows = scrapy.Field()
    logiciel_libre_linux = scrapy.Field()
    logiciel_libre_mac = scrapy.Field()
    logiciel_libre_bsd = scrapy.Field()
