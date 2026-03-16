from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Docker volume is mounted to /data
DB_DIR = "/data"
DB_PATH = os.path.join(DB_DIR, "grid.db")
DATABASE_URL = f"sqlite:////{DB_PATH.lstrip('/')}"

# Make sure the folder exists inside the container
os.makedirs(DB_DIR, exist_ok=True)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()
