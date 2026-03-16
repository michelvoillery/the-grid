import requests
from bs4 import BeautifulSoup
from readability import Document


def scrape_page(url):

    html = requests.get(url).text

    doc = Document(html)

    title = doc.title()

    soup = BeautifulSoup(html,"html.parser")

    desc_tag = soup.find("meta",attrs={"name":"description"})

    description = ""

    if desc_tag:
        description = desc_tag.get("content","")

    img_tag = soup.find("meta",property="og:image")

    image=""

    if img_tag:
        image = img_tag.get("content","")

    return {
        "title":title,
        "description":description,
        "image":image
    }
