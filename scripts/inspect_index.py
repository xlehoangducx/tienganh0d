with open(r'd:\WEB_HOC_TIENG_ANH_AI\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\']', text)
print("Sections in index.html:", sections)
print("Total lines in index.html:", len(text.splitlines()))

# Print head and main structure
for line in text.splitlines()[:40]:
    print(line)
