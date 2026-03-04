import json
import re

PLANNER_PATH = r'c:\Users\Noh TaeKyung\Desktop\pm\curriculumPlanner.json'

with open(PLANNER_PATH, 'r', encoding='utf-8') as f:
    planner_json = f.read()

def shift_ab_id(match):
    num = int(match.group(1))
    if num >= 204:
        return f"ab-{num - 92:04d}"
    return match.group(0)

shifted_json = re.sub(r'ab-(\d{4})', shift_ab_id, planner_json)

# We also need to update quality_checks
planner = json.loads(shifted_json)

expected_ab_count = 239 - 92
planner['quality_checks']['ab_total_expected'] = expected_ab_count
planner['quality_checks']['ab_total_mapped'] = expected_ab_count

with open(PLANNER_PATH, 'w', encoding='utf-8') as f:
    json.dump(planner, f, indent=2, ensure_ascii=False)

print("Shifted ab-ids by -92")
