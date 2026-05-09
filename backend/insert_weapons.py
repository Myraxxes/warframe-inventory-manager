from db import get_connection
from load_weapons import load_weapons

conn = get_connection()
cursor = conn.cursor()

# Load cleaned weapon data
weapons = load_weapons()

# Insert weapons into PostgreSQL
for weapon in weapons:

    cursor.execute(
        """
        INSERT INTO weapons
        (name, weapon_type, category, image_name, mastery_req, is_prime, description)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (
            weapon["name"],
            weapon["type"],
            weapon["category"],
            weapon["image_name"],
            weapon["mastery_req"],
            weapon["is_prime"],
            weapon["description"]
        )
    )

conn.commit()

print(f"Inserted {len(weapons)} weapons successfully!")

cursor.close()
conn.close()