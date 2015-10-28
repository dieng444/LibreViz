# -*- coding: utf-8 -*-
import scrapy

from floss.items import WikipediaRowItem
from floss.items import WikipediaSoftwareItem

class WikipediaSpider(scrapy.Spider):
    name = "wikipedia"
    allowed_domains = ["wikipedia.org"]
    start_urls = (
        "https://fr.wikipedia.org/wiki/Correspondance_entre_logiciels_libres_et_logiciels_propriétaires",
    )

    def parse(self, response):
        # On construit d'abord des listes de logiciels en fonction des catégories et des sous-catégories
        for categorie in response.xpath("//table/tr[position() > 2]"):
            ligne = WikipediaRowItem()
            ligne['categorie'] = "".join(categorie.xpath("../preceding-sibling::h3[1]/span[@class='mw-headline']//text()").extract())
            ligne['fonctionnalite'] = "".join(categorie.xpath("th//text()").extract())
            ligne['logiciels_proprietaires'] = categorie.xpath("td[1]/ul/li/a[1]/text()").extract()
            ligne['logiciels_libres_windows'] = categorie.xpath("td[2]/ul/li/a[1]/text()").extract()
            ligne['logiciels_libres_linux'] = categorie.xpath("td[3]/ul/li/a[1]/text()").extract()
            ligne['logiciels_libres_mac'] = categorie.xpath("td[4]/ul/li/a[1]/text()").extract()
            ligne['logiciels_libres_bsd'] = categorie.xpath("td[5]/ul/li/a[1]/text()").extract()
            yield ligne
        # On construit ensuite les fiches d'identité de tous les logiciels (GNU/Linux uniquement)
        for lien in response.xpath("//table/tr[position() > 2]/td[3]/ul/li/a[1]"):
            logiciel = WikipediaSoftwareItem()
            url_brute = str(lien.xpath("@href").extract()) # La conversion est obligatoire, sinon ça renvoie une liste
            url_traitee = url_brute[3:len(url_brute)-2] # On enlève les [u'...']
            logiciel['nom'] = "".join(lien.xpath("text()").extract())
            url = response.urljoin(url_traitee)
            yield scrapy.Request(url, callback=self.parse_software, meta={'logiciel': logiciel}, dont_filter=True)

    def parse_software(self, response):
        logiciel = response.meta.get('logiciel', None)
        # On doit transformer les URLs relatives en URLs absolues pour que Scrapy puisse les aspirer
        liste_urls_relatives = response.xpath("//table[@class='infobox_v2']/tr/td/a[@class='image']/img/@src").extract()
        liste_urls_absolues = []
        for url_relative in liste_urls_relatives:
            liste_urls_absolues.append('https:' + url_relative)
        logiciel['image_urls'] = liste_urls_absolues
        logiciel['developpeurs'] = response.xpath("//table[@class='infobox_v2']/tr/th/a[@href='/wiki/D%C3%A9veloppeur']/../../td//text()").extract()
        logiciel['version'] = "".join(response.xpath("//table[@class='infobox_v2']/tr/th/a[@href='/wiki/Version_d%27un_logiciel']/../../td//text()").extract())
        logiciel['technologies'] = response.xpath("//table[@class='infobox_v2']/tr/th/a[@title='Langage de programmation']/../../td/a/text()").extract() 
        logiciel['langues'] = response.xpath("//table[@class='infobox_v2']/tr/th/a[@title='Internationalisation (informatique)']/../../td/a/text()").extract()
        logiciel['licences'] = response.xpath("//table[@class='infobox_v2']/tr/th/a[@title='Licence de logiciel']/../../td/a/text()").extract()
        logiciel['site'] = "".join(response.xpath("//table[@class='infobox_v2']/tr/th/a[@title='Site web']/../../td/a[1]/text()").extract())
        logiciel['description'] = "".join(response.xpath("//div[@id='mw-content-text']/p[1]//text()").extract())
        yield logiciel
