# site_map_crawler.py
import scrapy
from scrapy.crawler import CrawlerProcess
from urllib.parse import urljoin, urlparse
from collections import Counter
import json
import time
from threading import Thread

# === CONFIG ===
BASE_URL = "https://agora-xi.vercel.app/"  # Replace with your site
ALLOWED_DOMAIN = urlparse(BASE_URL).netloc


class SiteMapSpider(scrapy.Spider):
    name = "site_map"
    start_urls = [BASE_URL]

    custom_settings = {
        "DEPTH_LIMIT": 4,  # Limit crawl depth
        "ROBOTSTXT_OBEY": False,
        "CONCURRENT_REQUESTS": 16,  # Faster crawling
        "LOG_LEVEL": "INFO",
    }

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.site_map = {}
        self.links_seen = []
        self.pages_crawled = 0
        self._running = True

        # Background logger: logs progress every 60 seconds
        def log_progress():
            while self._running:
                self.logger.info(f"Crawled {self.pages_crawled} pages so far...")
                time.sleep(60)

        Thread(target=log_progress, daemon=True).start()

    def parse(self, response):
        self.pages_crawled += 1
        page = response.url

        # Extract internal links only
        links = []
        for href in response.css("a::attr(href)").getall():
            href = href.split("#")[0]  # ignore anchors
            full_link = urljoin(BASE_URL, href)
            parsed = urlparse(full_link)
            if parsed.netloc == ALLOWED_DOMAIN:
                links.append(full_link)

        self.site_map[page] = links
        self.links_seen.extend(links)

        # Follow links recursively
        for link in links:
            if link not in self.site_map:
                yield response.follow(link, self.parse)

    def closed(self, reason):
        self._running = False  # stop background logger

        # Remove common header/footer links
        all_counts = Counter(self.links_seen)
        num_pages = len(self.site_map)
        cleaned = {
            page: [l for l in links if all_counts[l] < num_pages]
            for page, links in self.site_map.items()
        }

        with open("site_map.json", "w") as f:
            json.dump(cleaned, f, indent=2)

        self.logger.info("Saved cleaned site_map.json")


# === RUN CRAWLER ===
if __name__ == "__main__":
    process = CrawlerProcess()
    process.crawl(SiteMapSpider)
    process.start()
