def search(db,query):

    return db.execute(
    f"""
    SELECT * FROM items
    WHERE title LIKE '%{query}%'
    OR content LIKE '%{query}%'
    """
    )
