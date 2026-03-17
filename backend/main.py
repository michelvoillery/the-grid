from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import SessionLocal, engine, Base
from models import Item, Collection, Tag
from scraper import scrape_page
from urllib.parse import urlparse, parse_qs
import os
import shutil

app = FastAPI()

# Relaxed CORS for development/portability
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

Base.metadata.create_all(bind=engine)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

def extract_youtube_video_id(url: str) -> str:
    try:
        parsed = urlparse(url)
        host = (parsed.netloc or "").lower()
        path = parsed.path or ""

        if "youtu.be" in host:
            return path.strip("/")

        if "youtube.com" in host:
            if path == "/watch":
                return parse_qs(parsed.query).get("v", [""])[0]

            if path.startswith("/shorts/"):
                return path.split("/shorts/")[1].split("/")[0]

            if path.startswith("/embed/"):
                return path.split("/embed/")[1].split("/")[0]
    except Exception:
        return ""

    return ""

def is_youtube_url(url: str) -> bool:
    host = (urlparse(url).netloc or "").lower()
    return "youtube.com" in host or "youtu.be" in host

def is_image_url(url: str) -> bool:
    lower_url = (url or "").lower()
    return (
        lower_url.endswith(".jpg") or
        lower_url.endswith(".jpeg") or
        lower_url.endswith(".png") or
        lower_url.endswith(".webp") or
        lower_url.endswith(".gif")
    )

@app.get("/items")
def get_items():
    db = SessionLocal()
    try:
        return db.query(Item).all()
    finally:
        db.close()

@app.get("/add")
@app.post("/add")
def add(url: str, item_type: str = "article", tags: str = ""):
    normalized_type = (item_type or "article").lower().strip()

    if is_youtube_url(url):
        normalized_type = "youtube"

    if is_image_url(url):
        normalized_type = "image"

    if normalized_type == "pdf" or url.lower().endswith(".pdf"):
        data = {
            "title": url.split("/")[-1] or "PDF Document",
            "description": "Saved PDF document",
            "image": ""
        }
        normalized_type = "pdf"

    elif normalized_type == "image":
        filename = url.split("/")[-1] or "Image"
        data = {
            "title": filename,
            "description": "Saved image",
            "image": url
        }

    elif normalized_type == "youtube":
        video_id = extract_youtube_video_id(url)
        thumbnail = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg" if video_id else ""
        data = {
            "title": "YouTube Video",
            "description": "Saved YouTube video",
            "image": thumbnail
        }

    else:
        data = scrape_page(url)

    db = SessionLocal()
    try:
        item = Item(
            title=data.get("title", "Untitled"),
            url=url,
            image=data.get("image", ""),
            description=data.get("description", ""),
            content=data.get("content", ""),
            tags=tags,
            item_type=normalized_type
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return {"status": "ok", "id": item.id}
    finally:
        db.close()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename or "upload"
    filepath = f"{UPLOAD_DIR}/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extension = filename.split(".")[-1].lower() if "." in filename else ""
    item_type = "image" if extension in ["jpg", "jpeg", "png", "webp", "gif"] else "pdf"
    
    image_path = f"/uploads/{filename}" if item_type == "image" else ""

    db = SessionLocal()
    try:
        item = Item(
            title=filename,
            url=f"/uploads/{filename}",
            image=image_path,
            description="Uploaded file",
            tags="",
            item_type=item_type
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return {"status": "ok", "id": item.id}
    finally:
        db.close()

@app.get("/items/{item_id}")
def get_item(item_id: int):
    db = SessionLocal()
    try:
        item = db.query(Item).filter(Item.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    finally:
        db.close()

from pydantic import BaseModel
from typing import Optional, List

class ItemUpdate(BaseModel):
    tags: Optional[str] = None
    collection_id: Optional[int] = None

class CollectionCreate(BaseModel):
    name: str
    color: Optional[str] = ""
    icon: Optional[str] = ""

class CollectionUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class TagCreate(BaseModel):
    name: str
    color: Optional[str] = ""
    icon: Optional[str] = ""

class TagUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

@app.patch("/items/{item_id}")
def update_item(item_id: int, update: ItemUpdate):
    db = SessionLocal()
    try:
        item = db.query(Item).filter(Item.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        if update.tags is not None:
            item.tags = update.tags
        if update.collection_id is not None:
            # If collection_id is 0, it means "no collection"
            item.collection_id = update.collection_id if update.collection_id > 0 else None
            
        db.commit()
        db.refresh(item)
        return item
    finally:
        db.close()

@app.get("/collections")
def get_collections():
    db = SessionLocal()
    try:
        return db.query(Collection).all()
    finally:
        db.close()

@app.post("/collections")
def create_collection(collection: CollectionCreate):
    db = SessionLocal()
    try:
        new_col = Collection(name=collection.name, color=collection.color, icon=collection.icon)
        db.add(new_col)
        db.commit()
        db.refresh(new_col)
        return new_col
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Collection already exists or error.")
    finally:
        db.close()

@app.patch("/collections/{col_id}")
def update_collection(col_id: int, update: CollectionUpdate):
    db = SessionLocal()
    try:
        col = db.query(Collection).filter(Collection.id == col_id).first()
        if not col:
            raise HTTPException(status_code=404, detail="Collection not found")
        
        if update.name is not None:
            col.name = update.name
        if update.color is not None:
            col.color = update.color
        if update.icon is not None:
            col.icon = update.icon
            
        db.commit()
        db.refresh(col)
        return col
    finally:
        db.close()

@app.get("/tags")
def get_tags():
    db = SessionLocal()
    try:
        return db.query(Tag).all()
    finally:
        db.close()

@app.post("/tags")
def create_tag(tag: TagCreate):
    db = SessionLocal()
    try:
        new_tag = Tag(name=tag.name, color=tag.color, icon=tag.icon)
        db.add(new_tag)
        db.commit()
        db.refresh(new_tag)
        return new_tag
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Tag already exists or error.")
    finally:
        db.close()

@app.patch("/tags/{tag_id}")
def update_tag(tag_id: int, update: TagUpdate):
    db = SessionLocal()
    try:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        old_name = tag.name
        if update.name is not None and update.name != old_name:
            # Update all items with this tag string
            items = db.query(Item).filter(Item.tags.contains(old_name)).all()
            for item in items:
                tag_list = [t.strip() for t in (item.tags or "").split(",") if t.strip()]
                if old_name in tag_list:
                    tag_list = [update.name if t == old_name else t for t in tag_list]
                    item.tags = ",".join(tag_list)
            tag.name = update.name

        if update.color is not None:
            tag.color = update.color
        if update.icon is not None:
            tag.icon = update.icon
            
        db.commit()
        db.refresh(tag)
        return tag
    finally:
        db.close()

@app.delete("/tags/{tag_id}")
def delete_tag(tag_id: int):
    db = SessionLocal()
    try:
        tag = db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        old_name = tag.name
        # Remove tag name from all items
        items = db.query(Item).filter(Item.tags.contains(old_name)).all()
        for item in items:
            tag_list = [t.strip() for t in (item.tags or "").split(",") if t.strip()]
            if old_name in tag_list:
                tag_list = [t for t in tag_list if t != old_name]
                item.tags = ",".join(tag_list)

        db.delete(tag)
        db.commit()
        return {"status": "ok"}
    finally:
        db.close()

@app.delete("/collections/{col_id}")
def delete_collection(col_id: int):
    db = SessionLocal()
    try:
        col = db.query(Collection).filter(Collection.id == col_id).first()
        if not col:
            raise HTTPException(status_code=404, detail="Collection not found")
        # Remove reference from items
        db.query(Item).filter(Item.collection_id == col_id).update({Item.collection_id: None})
        db.delete(col)
        db.commit()
        return {"status": "ok"}
    finally:
        db.close()

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    db = SessionLocal()
    try:
        item = db.query(Item).filter(Item.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        db.delete(item)
        db.commit()
        return {"status": "ok"}
    finally:
        db.close()

# Mount frontend at the root. MUST BE LAST.
# Expects frontend files in a folder named 'static' in the same directory as main.py
app.mount("/", StaticFiles(directory="static", html=True), name="static")
