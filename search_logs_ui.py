import os
import json

brain_dir = r"C:\Users\shard\.gemini\antigravity\brain"
transcripts = []

for root, dirs, files in os.walk(brain_dir):
    for f in files:
        if f == "transcript.jsonl":
            transcripts.append(os.path.join(root, f))

terms = ["testimon", "recommend", "slider", "spotlight", "hover", "hidden", "mind", "flicker", "showed"]

print(f"Found {len(transcripts)} transcript files.")

with open("testimonies_found.txt", "w", encoding="utf-8") as out:
    for t in transcripts:
        conv_id = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(t))))
        print(f"Scanning conversation: {conv_id}")
        
        matches = []
        with open(t, 'r', encoding='utf-8', errors='ignore') as f:
            for i, line in enumerate(f):
                if any(term in line.lower() for term in terms) or "USER_INPUT" in line:
                    matches.append((i, line))
        
        if matches:
            out.write(f"=== Conversation {conv_id} ({t}) ===\n")
            for line_no, m in matches: # write ALL matches for thoroughness
                try:
                    data = json.loads(m)
                    if data.get('type') == 'USER_INPUT':
                        out.write(f"Line {line_no} [USER_INPUT] : {data.get('content','')}\n")
                    elif any(term in str(data.get('content','')).lower() for term in terms):
                        out.write(f"Line {line_no} [{data.get('type','?')}/{data.get('source','?')}]: {str(data.get('content',''))[:500]}\n")
                except:
                    # if it's not JSON, write raw line
                    if any(term in m.lower() for term in terms):
                        out.write(f"Line {line_no} (Raw): {m[:500]}\n")
            out.write("-" * 50 + "\n\n")

print("Done writing to testimonies_found.txt")
