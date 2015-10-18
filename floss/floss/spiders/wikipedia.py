# -*- coding: utf-8 -*-
import scrapy

from floss.items import WikipediaItem

class WikipediaSpider(scrapy.Spider):
    name = "wikipedia"
    allowed_domains = ["wikipedia.org"]
    start_urls = (
        "https://fr.wikipedia.org/wiki/Correspondance_entre_logiciels_libres_et_logiciels_propriétaires",
    )

    def parse(self, response):
        """
        Parcours vertical du tableau

        for sel in response.xpath("//div[@id='mw-content-text']"):
            item = WikipediaItem()
            item['categorie'] = sel.xpath("h3/span[@class='mw-headline']/text()") .extract()
            item['fonctionnalite'] = sel.xpath("table/tr[position() > 2]/th[@scope='row']/a/text()").extract()
            item['logiciel_proprietaire'] = sel.xpath("table/tr[position() > 2]/td[1]/ul/li/a/text()").extract()
            item['logiciel_libre_windows'] = sel.xpath("table/tr[position() > 2]/td[2]/ul/li/a/text()").extract()
            item['logiciel_libre_linux'] = sel.xpath("table/tr[position() > 2]/td[3]/ul/li/a/text()").extract()
            item['logiciel_libre_mac'] = sel.xpath("table/tr[position() > 2]/td[4]/ul/li/a/text()").extract()
            item['logiciel_libre_bsd'] = sel.xpath("table/tr[position() > 2]/td[5]/ul/li/a/text()").extract()
            yield item
        """
        # Parcours horizontal du tableau
        for categorie in response.xpath("//table/tr[position() > 2]"):
            ligne = WikipediaItem()
            ligne['categorie'] = categorie.xpath("(../preceding-sibling::h3[1]/span[@class='mw-headline']/text()) | (../preceding-sibling::h3[1]/span[@class='mw-headline']/a/text())").extract()
            ligne['fonctionnalite'] = categorie.xpath("(th/a/text()) | (th/text())").extract()
            ligne['logiciel_proprietaire'] = categorie.xpath("td[1]/ul/li/a/text()").extract()
            ligne['logiciel_libre_windows'] = categorie.xpath("td[2]/ul/li/a/text()").extract()
            ligne['logiciel_libre_linux'] = categorie.xpath("td[3]/ul/li/a/text()").extract()
            ligne['logiciel_libre_mac'] = categorie.xpath("td[4]/ul/li/a/text()").extract()
            ligne['logiciel_libre_bsd'] = categorie.xpath("td[5]/ul/li/a/text()").extract()
            yield ligne
