import requests
from bs4 import BeautifulSoup
import sys
sys.stdout.reconfigure(encoding='utf-8')

def scrape_hackerrank(username):
    url = f"https://www.hackerrank.com/profile/{username}"
    headers = {"User-Agent": "Mozilla/5.0"}

    resp = requests.get(url, headers=headers)

    if resp.status_code != 200:
        print("❌ HackerRank profile not found.")
        return

    soup = BeautifulSoup(resp.text, "html.parser")

    # Extract title
    title = soup.title.string if soup.title else "No name found"
    print(f"\n👤 HackerRank Profile: {url}")
    print(f"Title: {title.strip()}")

    # Try to find badges or public data
    badges = soup.select(".badge-title") or soup.select(".badge-name")
    print("Badges:")
    for badge in badges[:5]:
        print(" -", badge.text.strip())

# Use your actual HackerRank username here
scrape_hackerrank("devaup05")
