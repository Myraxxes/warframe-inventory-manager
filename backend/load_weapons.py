import json

weapon_files = {
    "primary": "../data/Primary.json",
    "secondary": "../data/Secondary.json",
    "melee": "../data/Melee.json"
}

def load_weapons():

    clean_weapons = []

    for weapon_type, path in weapon_files.items():

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for item in data:

            clean_weapon = {
                "name": item.get("name"),
                "type": weapon_type,
                "category": item.get("category"),
                "image_name": item.get("imageName"),
                "mastery_req": item.get("masteryReq", 0),
                "is_prime": item.get("isPrime", False),
                "description": item.get("description", "")
            }

            clean_weapons.append(clean_weapon)

    return clean_weapons