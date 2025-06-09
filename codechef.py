import requests
from bs4 import BeautifulSoup
import sys
sys.stdout.reconfigure(encoding='utf-8')  # for emojis and UTF-8 in Windows

def scrape_codechef(username):
    url = f"https://www.codechef.com/users/{username}"
    headers = {"User-Agent": "Mozilla/5.0"}

    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print("❌ CodeChef profile not found.")
        return

    soup = BeautifulSoup(resp.text, "html.parser")
    print(f"\n👨‍🍳 CodeChef Profile: {url}")

    # DEBUG: Uncomment to inspect structure
    # print(soup.prettify()[:1000])

    # Rating
    rating_tag = soup.find("div", class_="rating-number")
    if rating_tag:
        rating = rating_tag.text.strip()
        print(f"Rating: {rating}")
    else:
        print("Rating: Not found")

    # Stars
    stars_tag = soup.find("span", class_="rating")
    if stars_tag:
        print(f"Stars: {stars_tag.text.strip()}")
    else:
        print("Stars: Not found")

    # Highest rating (in <small>)
    highest_tag = soup.find("small")
    if highest_tag:
        print(f"Highest Rating: {highest_tag.text.strip()}")
    else:
        print("Highest Rating: Not found")

    # Ranks
    ranks = soup.select("ul.inline-list li")
    if ranks:
        print("Ranks:")
        for rank in ranks:
            print(" -", rank.text.strip())
    else:
        print("Ranks: Not found")

# ✅ Use your actual CodeChef username
scrape_codechef("optimal_solver")
