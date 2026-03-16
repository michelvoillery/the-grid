from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import SessionLocal, engine, Base
from models import Item
from scraper import scrape_page
from urllib.parse import urlparse, parse_qs
import os
import shutil

app = FastAPI()

# Allow frontend on port 3000 to call backend on 8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

Base.metadata.create_all(bind=engine)
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
def add(url: str, item_type: str = "article"):
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
            tags="",
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
    extension = filename.split(".")[-1].lower() if "." in filename else ""
    filepath = f"{UPLOAD_DIR}/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    item_type = "image"
    if extension == "pdf":
        item_type = "pdf"

    image_path = f"http://127.0.0.1:8000/uploads/{filename}" if item_type == "image" else ""

    db = SessionLocal()
    try:
        item = Item(
            title=filename,
            url=f"http://127.0.0.1:8000/uploads/{filename}",
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