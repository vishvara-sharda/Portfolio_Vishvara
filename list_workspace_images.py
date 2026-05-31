import os

workspace_dir = "."
image_files = []

for root, dirs, files in os.walk(workspace_dir):
    if "node_modules" in root or "dist" in root or ".git" in root or ".claude" in root:
        continue
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
            image_files.append(os.path.join(root, f))

print(f"Found {len(image_files)} image files in workspace:")
for img in image_files:
    print(img)
