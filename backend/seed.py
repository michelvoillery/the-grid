from database import SessionLocal
from models import Item

db = SessionLocal()

samples=[

Item(
title="How AI Is Changing Software Development",
url="https://medium.com",
image="https://images.unsplash.com/photo-1504639725590-34d0984388bd",
description="A deep look at how AI tools change coding",
tags="AI"
),

Item(
title="The Future of Knowledge Systems",
url="https://wired.com",
image="https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
description="Knowledge management evolution",
tags="Knowledge"
)

]

db.add_all(samples)

db.commit()
