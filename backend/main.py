from fastapi import FastAPI
from database import SessionLocal, engine, Base
from models import Item
from scraper import scrape_page

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/items")
def get_items():
    db = SessionLocal()
    try:
        return db.query(Item).all()
    finally:
        db.close()


@app.get("/add")
@app.post("/add")
def add(url: str, item_type: str = "article"):
    normalized_type = (item_type or "article").lower().strip()

    # Simple PDF handling for v1:
    # do not scrape the page as HTML, just save it as a PDF item
    if normalized_type == "pdf" or url.lower().endswith(".pdf"):
        data = {
            "title": url.split("/")[-1] or "PDF Document",
            "description": "Saved PDF document",
            "image": ""
        }
        normalized_type = "pdf"
    else:
        data = scrape_page(url)

    db = SessionLocal()
    try:
        item = Item(
            title=data.get("title", "Untitled"),
            url=url,
            image=data.get("image", ""),
            description=data.get("description", ""),
            tags="",
            item_type=normalized_type
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return {"status": "ok", "id": item.id}
    finally:
        db.close()
