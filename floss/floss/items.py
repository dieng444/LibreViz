# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy

class FramasoftItem(scrapy.Item):
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

class WikipediaRowItem(scrapy.Item):
    categorie = scrapy.Field()
    fonctionnalite = scrapy.Field()
    logiciels_proprietaires = scrapy.Field()
    logiciels_libres_windows = scrapy.Field()
    logiciels_libres_linux = scrapy.Field()
    logiciels_libres_mac = scrapy.Field()
    logiciels_libres_bsd = scrapy.Field()

class WikipediaSoftwareItem(scrapy.Item):
    nom = scrapy.Field()
    image_urls = scrapy.Field()
    images = scrapy.Field()
    developpeurs = scrapy.Field()
    version = scrapy.Field()
    technologies = scrapy.Field() 
    langues = scrapy.Field()
    licences = scrapy.Field()
    site = scrapy.Field()
    description = scrapy.Field()
