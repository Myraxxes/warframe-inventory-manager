from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import get_connection

app = FastAPI()

# Enable CORS so React frontend can make requests to FastAPI backend without getting blocked
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/weapons")
def get_weapons(type: str = None, search: str = None):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT id, name, weapon_type, category,
               image_name, mastery_req,
               is_prime, description
        FROM weapons
    """

    conditions = []
    params = []

    # Exclude weapons without a description
    # This is used for excluding Zaw components from list of weapons
    conditions.append("description IS NOT NULL")
    conditions.append("description <> ''")

    # Filter by type (primary/secondary/melee)
    if type:
        conditions.append("weapon_type = %s")
        params.append(type)

    # Search for a weapon (can be any type)
    if search:
        conditions.append("LOWER(name) LIKE %s")
        params.append(f"%{search.lower()}%")

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()

    weapons = []

    for row in rows:
        weapons.append({
            "id": row[0],
            "name": row[1],
            "weapon_type": row[2],
            "category": row[3],
            "image_name": row[4],
            "image_url": f"https://cdn.warframestat.us/img/{row[4]}",
            "mastery_req": row[5],
            "is_prime": row[6],
            "description": row[7]
        })

    cursor.close()
    conn.close()

    return weapons