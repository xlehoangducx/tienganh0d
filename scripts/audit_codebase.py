import re
import os

print("=== 1. AUDITING HTML & JS ID REFERENCES ===")
with open(r'd:\WEB_HOC_TIENG_ANH_AI\dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract IDs from HTML
html_ids = set(re.findall(r'id=["\']([^"\']+)["\']', html))
print(f"Total IDs found in dashboard.html: {len(html_ids)}")

with open(r'd:\WEB_HOC_TIENG_ANH_AI\js\app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

with open(r'd:\WEB_HOC_TIENG_ANH_AI\js\curriculum-data.js', 'r', encoding='utf-8') as f:
    curr_js = f.read()

# Find all getElementById in app.js
js_get_ids = set(re.findall(r'getElementById\(["\']([^"\']+)["\']\)', app_js))
print(f"Total getElementById calls in app.js: {len(js_get_ids)}")

# Extract dynamically rendered IDs in app.js (like `id="btn-${mod.id}"` or inside template literals)
dynamic_ids = set(re.findall(r'id=["\']([^"\'$]+)["\']', app_js))

all_known_ids = html_ids.union(dynamic_ids)

missing_ids = []
for jid in sorted(js_get_ids):
    if jid not in all_known_ids and not jid.startswith("btn-") and not jid.startswith("tabBtn-") and not jid.startswith("card-") and not jid.startswith("quiz-"):
        missing_ids.append(jid)

print(f"IDs queried in app.js not directly found in static HTML or dynamic template strings ({len(missing_ids)}):")
for mid in missing_ids:
    print(f"  - {mid}")

print("\n=== 2. AUDITING ONCLICK FUNCTIONS IN DASHBOARD.HTML ===")
onclick_calls = re.findall(r'onclick=["\']([^"\']+)["\']', html)
fn_names = set()
for call in onclick_calls:
    # get function name before (
    m = re.match(r'([a-zA-Z0-9_]+)\s*\(', call.strip())
    if m:
        fn_names.add(m.group(1))

print(f"Found {len(fn_names)} distinct functions called via onclick in dashboard.html:")
for fn in sorted(fn_names):
    # Check if defined in app.js
    is_defined = (f"window.{fn} =" in app_js) or (f"function {fn}(" in app_js) or (f"const {fn} =" in app_js) or (f"window.{fn}=" in app_js)
    status = "OK" if is_defined else "MISSING / NOT DEFINED IN APP.JS"
    print(f"  [{status}] {fn}")

print("\n=== 3. AUDITING ONCLICK FUNCTIONS GENERATED DYNAMICALLY IN APP.JS ===")
dynamic_onclicks = re.findall(r'onclick=\\?["\']([a-zA-Z0-9_]+)\(', app_js)
dyn_fn_names = set(dynamic_onclicks)
for fn in sorted(dyn_fn_names):
    is_defined = (f"window.{fn} =" in app_js) or (f"function {fn}(" in app_js) or (f"const {fn} =" in app_js) or (f"window.{fn}=" in app_js)
    status = "OK" if is_defined else "MISSING / NOT DEFINED IN APP.JS"
    if not is_defined:
        print(f"  [{status}] {fn}")

print("\n=== 4. AUDITING CURRICULUM DATA STRUCTURE & AUDIO FILES ===")
# Check for audio files referenced in curriculum-data.js
audio_files = re.findall(r'audioFile:\s*["\']([^"\']+)["\']', curr_js)
print(f"Found {len(audio_files)} audio file references in curriculum-data.js")
missing_audio = []
for af in audio_files:
    full_path = os.path.join(r'd:\WEB_HOC_TIENG_ANH_AI', af.replace('/', '\\'))
    if not os.path.exists(full_path):
        missing_audio.append(af)

print(f"Missing audio files on disk ({len(missing_audio)}):")
for ma in missing_audio:
    print(f"  - {ma}")

print("\n=== 5. CHECKING LUCIDE ICONS USED IN HTML & APP.JS ===")
lucide_html = re.findall(r'data-lucide=["\']([^"\']+)["\']', html)
lucide_js = re.findall(r'data-lucide=\\?["\']([^"\'${}]+)\\?["\']', app_js)
all_icons = set(lucide_html).union(set(lucide_js))
print(f"Total distinct Lucide icons used: {len(all_icons)}")
print("Sample icons:", sorted(list(all_icons))[:15])

print("\nAudit completed successfully!")
