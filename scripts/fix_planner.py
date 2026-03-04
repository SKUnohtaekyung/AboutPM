import json
import re
import os

PLANNER_PATH = r'c:\Users\Noh TaeKyung\Desktop\pm\curriculumPlanner.json'
CREATE_PLANNER_PATH = r'c:\Users\Noh TaeKyung\Desktop\pm\scripts\create_planner.cjs'

with open(PLANNER_PATH, 'r', encoding='utf-8') as f:
    planner = json.load(f)

# Keep chapters 1-4
new_chapters = [ch for ch in planner['chapters'] if ch['id'] in ['ch-01', 'ch-02', 'ch-03', 'ch-04']]

# Process remaining chapters: 7->5, 8->6, 9->7
mapping = {
    'ch-07': 'ch-05',
    'ch-08': 'ch-06',
    'ch-09': 'ch-07',
}

def update_prereq(prereqs):
    new_prereqs = []
    for p in prereqs:
        for old_ch, new_ch in mapping.items():
            if p.startswith(old_ch):
                p = p.replace(old_ch, new_ch)
                break
        new_prereqs.append(p)
    return new_prereqs

for ch in planner['chapters']:
    if ch['id'] in mapping:
        old_id = ch['id']
        new_id = mapping[old_id]
        
        ch['id'] = new_id
        for ls in ch['lessons']:
            ls['id'] = ls['id'].replace(old_id, new_id)
            ls['prerequisites'] = update_prereq(ls['prerequisites'])
        
        new_chapters.append(ch)

planner['chapters'] = new_chapters

# Update quality checks
for d in planner['quality_checks']['duplicates_merged_in_learning_layer']:
    for old_ch, new_ch in mapping.items():
        if d['final_lesson_id'].startswith(old_ch):
            d['final_lesson_id'] = d['final_lesson_id'].replace(old_ch, new_ch)
            break

with open(PLANNER_PATH, 'w', encoding='utf-8') as f:
    json.dump(planner, f, indent=2, ensure_ascii=False)

# Update create_planner.cjs
with open(CREATE_PLANNER_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Instead of complex regex for create_planner.cjs, let's just write back the new JSON dictionary representation
# to keep create_planner.cjs accurate.
json_str = json.dumps(planner, indent=4, ensure_ascii=False)
js_str = "const fs = require('fs');\nconst path = require('path');\n\nconst planner = " + json_str + ";\n\nfs.writeFileSync('curriculumPlanner.json', JSON.stringify(planner, null, 2));\nconsole.log('✅ curriculumPlanner.json 생성 완료');\n"

with open(CREATE_PLANNER_PATH, 'w', encoding='utf-8') as f:
    f.write(js_str)

print("Planner restructured successfully.")
