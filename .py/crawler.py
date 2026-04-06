import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
from collections import Counter

# === CONFIG ===
BASE_URL = "https://agora-xi.vercel.app/"  # replace with your site URL
visited = set()
site_map = {}


def is_internal(link):
    """Check if a link is internal."""
    return link.startswith("/") or urlparse(link).netloc == urlparse(BASE_URL).netloc


def crawl(url):
    if url in visited:
        return
    visited.add(url)
    print("Crawling:", url)

    try:
        r = requests.get(url)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")

        links = []
        for a in soup.find_all("a", href=True):
            href = a["href"].split("#")[0]  # ignore anchors
            full_link = urljoin(BASE_URL, href)
            if is_internal(full_link):
                links.append(full_link)

        site_map[url] = links

        # Recursively crawl the found links
        for link in links:
            crawl(link)
    except requests.RequestException as e:
        print("Failed to crawl", url, e)


# === START CRAWLING ===
crawl(BASE_URL)

# === REMOVE COMMON HEADER/FOOTER LINKS ===
# Count all links
all_links = [link for links in site_map.values() for link in links]
link_counts = Counter(all_links)
num_pages = len(site_map)

# Remove links that appear on every page
for page, links in site_map.items():
    site_map[page] = [l for l in links if link_counts[l] < num_pages]

# === SAVE TO JSON ===
with open("site_map.json", "w") as f:
    json.dump(site_map, f, indent=2)

print("Crawl complete! Graph saved to site_map.json")
