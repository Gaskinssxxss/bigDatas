import scrapy
from pymongo import MongoClient

class BeritaSpider(scrapy.Spider):
    name = "berita"
    allowed_domains = ["dinamikambojo.net"]
    start_urls = ["https://www.dinamikambojo.net/search?updated-max=2024-10-29T20:42:00-07:00&max-results=7#PageNo=5"]
    def __init__(self, *args, **kwargs):
        super(BeritaSpider, self).__init__(*args, **kwargs)
        self.client = MongoClient("mongodb://bmblx999:indra999@ac-aitzldg-shard-00-00.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-01.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-02.uoyd2xl.mongodb.net:27017/rawData?replicaSet=atlas-vrw4js-shard-0&ssl=true&authSource=admin")
        self.db = self.client["rawData"]
        self.collection = self.db["raw_data"]

    def parse(self, response):
        articles = response.css('h2.post-title.entry-title a::attr(href)').getall()
        for article_url in articles:
            yield response.follow(article_url, self.parse_article)

    def parse_article(self, response):
        title = response.css('h1.post-title.entry-title a::text').get()
        if not title:
            title = response.css('h1.post-title.entry-title span.tl-wrapIn a::text').get()

        date = response.css('abbr.published::attr(title)').get()
        author = response.css('span.post-author::text').get() or "No author"
        content = response.css('div.post-body.entry-content').xpath("string()").get().strip()

        article_data = {
            "header": "Dinamikambojo",
            "title": title if title else "Title not found",
            "date": date,
            "author": author.strip() if author else "No author",
            "content": content if content else "Content not found"
        }
        self.collection.insert_one(article_data)

    def closed(self, reason):
        self.client.close()
