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

    # Clean up the content HTML to ensure high-res images
    content_html = doc.summary()
    content_soup = BeautifulSoup(content_html, "html.parser")

    for img in content_soup.find_all("img"):
        # Handle srcset - grab the largest one if available
        srcset = img.get("srcset") or img.get("data-srcset")
        if srcset:
            try:
                # Format: "img1.jpg 300w, img2.jpg 600w, img3.jpg 1200w"
                sources = [s.strip().split(" ") for s in srcset.split(",")]
                # Take the URL of the last source (usually the highest resolution)
                img["src"] = sources[-1][0]
            except:
                pass
        else:
            # Fallback to common lazy-loading high-res attributes
            high_res = img.get("data-src") or img.get("data-original") or img.get("data-lazy-src")
            if high_res:
                img["src"] = high_res
        
        # Remove small-scale constraints
        if img.has_attr("width"): del img["width"]
        if img.has_attr("height"): del img["height"]
        img["style"] = "width:100%; height:auto;"

    return {
        "title":title,
        "description":description,
        "image":image,
        "content": str(content_soup)
    }
