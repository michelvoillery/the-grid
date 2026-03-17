from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Collection(Base):
    __tablename__ = "collections"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    color = Column(String, default="")
    icon = Column(String, default="")
    items = relationship("Item", back_populates="collection")

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    color = Column(String, default="")
    icon = Column(String, default="")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    url = Column(String)
    image = Column(String)
    description = Column(Text)
    content = Column(Text)
    tags = Column(String) # comma-separated tags
    item_type = Column(String, default="article")
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=True)
    collection = relationship("Collection", back_populates="items")
