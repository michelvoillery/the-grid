from sqlalchemy import Column, Integer, String, Text
from database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    url = Column(String)
    image = Column(String)
    description = Column(Text)
    tags = Column(String)
    item_type = Column(String, default="article")
