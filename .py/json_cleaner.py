import json

# === CONFIG ===
INPUT_FILE = r"C:\Users\Sreek\website\.py\cleaned_site_map.json"  # your input JSON file
OUTPUT_FILE = "xhtml_removed_cleaned_map.json"  # output file

# Load JSON
with open(INPUT_FILE, "r") as f:
    site_map = json.load(f)

# Remove .xhtml links
cleaned_map = {}
for page, links in site_map.items():
    cleaned_map[page] = [link for link in links if not link.endswith(".xhtml")]

# Save cleaned JSON
with open(OUTPUT_FILE, "w") as f:
    json.dump(cleaned_map, f, indent=2)

print(f"Done! Cleaned JSON saved to {OUTPUT_FILE}")
