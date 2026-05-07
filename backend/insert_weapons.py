import os
import psycopg2
from dotenv import load_dotenv

from load_weapons import load_weapons

load_dotenv()

conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

cursor = conn.cursor()

print("Connected to database!")

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

print("Database connection closed.")