import re

def build_backlinks(db):

    items = db.query(Item).all()

    titles = {i.title:i.id for i in items}

    for item in items:

        links = re.findall(r"\[\[(.*?)\]\]",item.content)

        for link in links:

            if link in titles:

                target_id = titles[link]

                item.links.append(target_id)

    db.commit()
