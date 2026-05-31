import os

brain_dir = r"C:\Users\shard\.gemini\antigravity\brain"
overviews = []

for root, dirs, files in os.walk(brain_dir):
    for f in files:
        if f == "overview.txt":
            overviews.append(os.path.join(root, f))

terms = ["testimon", "recommend", "slider", "carousel", "quote"]

print(f"Found {len(overviews)} overview files.")
for o in overviews:
    conv_id = os.path.basename(os.path.dirname(os.path.dirname(o)))
    with open(o, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        if any(term in content.lower() for term in terms):
            print(f"=== MATCH in overview for {conv_id} ===")
            # print lines that match
            for line in content.split('\n'):
                if any(term in line.lower() for term in terms):
                    print(line[:300])
            print("-" * 50)
