import os

# Configuration
root_folders = {
    "IVF": r"D:\ivf",
}
excluded_folders = {"node_modules", ".angular", ".git", ".vscode", "android", "dist"}

for name, root in root_folders.items():
    output_file = f"file_paths_{name}.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        for dirpath, dirnames, filenames in os.walk(root):
            # Exclude folders
            dirnames[:] = [d for d in dirnames if d not in excluded_folders]

            for filename in filenames:
                full_path = os.path.join(dirpath, filename)
                f.write(full_path + '\n')

    print(f"[✓] File paths saved to {output_file}")
