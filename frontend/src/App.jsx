import { useEffect, useState } from "react";

function App() {
  const [selectedType, setSelectedType] = useState("all");
  const [weapons, setWeapons] = useState([]);
  const [mastered, setMastered] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [locked, setLocked] = useState({});


  useEffect(() => {
    fetch("http://127.0.0.1:8000/weapons")
      .then((res) => res.json())
      .then((data) => setWeapons(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handles marking a weapon as mastered or unmastered
  const toggleMastered = (id) => {
    const isCurrentlyMastered = mastered[id];

    if (isCurrentlyMastered) {
      const confirmUnmaster = window.confirm(
        "Are you sure you want to unmark this weapon as mastered?"
      );

      if (!confirmUnmaster) return;

      setMastered((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      return;
    }

    setMastered((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // Toggle weapon lock state
  const toggleLocked = (id) => {
    setLocked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Weapons shown in main grid
  const filteredWeapons =
    (selectedType === "all"
      ? weapons
      : weapons.filter((w) => w.weapon_type === selectedType)
    )
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

  // Search results (always searches ALL weapons)
  const searchResults =
    searchTerm.trim() === ""
      ? []
      : weapons
          .filter((weapon) =>
            weapon.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

  return (
    <div>
      <h1>Warframe Inventory Manager</h1>

      {/* Tabs */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        {["all", "primary", "secondary", "melee"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: "12px 22px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              borderRadius: "6px",
              backgroundColor:
                selectedType === type ? "#4caf50" : "#333",
              color: "white",
              minWidth: "120px",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "400px",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder="Search weapons..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowDropdown(true);
              }
            }}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #666",
            }}
          />

          {/* Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#222",
                border: "1px solid #555",
                borderRadius: "6px",
                marginTop: "4px",
                maxHeight: "220px",
                overflowY: "auto",
                overflowX: "hidden",
                zIndex: 1000,
              }}
            >
              {searchResults.map((weapon) => (
                <div
                  key={weapon.id}
                  onClick={() => {
                    setSelectedType(weapon.weapon_type);
                    setSearchTerm("");
                    setShowDropdown(false);
                  }}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #626262",
                    color: "white",
                  }}
                >
                  {weapon.name} (
                  {weapon.weapon_type.charAt(0).toUpperCase() +
                    weapon.weapon_type.slice(1)}
                  )
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weapon Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "15px",
          padding: "12px",
        }}
      >
        {filteredWeapons.map((weapon) => (
          <div
            key={weapon.id}
            style={{
              border: "1px solid #626262",
              padding: "12px",
              height: "200px",
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {/* Lock icon */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleLocked(weapon.id);
              }}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
            {locked[weapon.id] ? "🔒" : "🔓"}
          </div>
              
            {/* Mastery requirement */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                padding: "4px 6px",
                border: "1px solid #555",
              }}
            >
              MR {weapon.mastery_req}
            </div>

          {/* Weapon image */}
          <img
            src={weapon.image_url}
            style={{
              width: "110px",
              height: "110px",
              objectFit: "contain",
            }}
          />

          <div>{weapon.name}</div>
          
          {/* Mastery toggle button */}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMastered(weapon.id);
              }}
              style={{
                padding: "10px 14px",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: mastered[weapon.id]
                  ? "green"
                  : "#444",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {mastered[weapon.id]
                ? "Mastered"
                : "Mark as Mastered"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;