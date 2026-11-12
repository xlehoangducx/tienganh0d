import os
import re

for filename in ['index.html', 'tracks.html']:
    filepath = os.path.join(r'd:\WEB_HOC_TIENG_ANH_AI', filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"=== Checking {filename} ===")
    scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', content)
    for s in scripts:
        if not s.startswith('http'):
            clean_s = s.split('?')[0]
            exists = os.path.exists(os.path.join(r'd:\WEB_HOC_TIENG_ANH_AI', clean_s.replace('/', '\\')))
            print(f"  Script {s}: {'EXISTS' if exists else 'MISSING'}")
    
    links = re.findall(r'<link[^>]*href=["\']([^"\']+)["\']', content)
    for l in links:
        if not l.startswith('http'):
            clean_l = l.split('?')[0]
            exists = os.path.exists(os.path.join(r'd:\WEB_HOC_TIENG_ANH_AI', clean_l.replace('/', '\\')))
            print(f"  CSS/Asset {l}: {'EXISTS' if exists else 'MISSING'}")
