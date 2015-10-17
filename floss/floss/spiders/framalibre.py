# -*- coding: utf-8 -*-
import scrapy

from floss.items import FramasoftItem

class FramalibreSpider(scrapy.Spider):
    name = "framalibre"
    allowed_domains = ["framasoft.net"]
    start_urls = (
        "http://framasoft.net/rubrique2.html",
    )

    def parse(self, response):
        for href in response.xpath("ul/li/a/@href"):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url, callback=self.parse_dir_contents)

    def parse_dir_contents(self, response):
        for href in response.xpath("//div[@id='c-centre']/div[@class='bloc']/ul[@class='liste']/li/dl/dt/a/@href"):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url, callback=self.parse_software)
        
    def parse_software(self, response):
        for sel in response.xpath("//div[@id='c-centre']/div[@class='bloc']"):
            item = FramasoftItem()
            item['name'] = response.xpath("h1/text()").extract()
            item['category'] = response.xpath("ul[@class='meta-pub']/li[@class='fil']/a[2]/text()").extract()
            item['subcategory'] = response.xpath("ul/[@class='meta-pub']/li[@class='fil']/a[2]/text()").extract()
            item['os'] = response.xpath("ul[@class='meta']/li[strong='OS.......:']/a/text()").extract()
            item['langage'] = response.xpath("ul[@class='meta']/li[strong='Langue...:']/a/text()").extract()
            item['code'] = response.xpath("ul[@class='meta']/li[strong='Code.....:']/a/text()").extract()
            item['size'] = response.xpath("ul[@class='meta']/li[strong='Taille...:']/a/text()").extract()
            item['licence'] = response.xpath("ul[@class='meta']/li[strong='Licence..:']/a/text()").extract()
            item['version'] = response.xpath("ul[@class='meta']/li[strong='Version..:']/a/text()").extract()
            item['description'] = response.xpath("p/text()").extract()
            yield item

