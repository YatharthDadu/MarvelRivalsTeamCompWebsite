import json
import re

with open('teamups.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f.readlines() if line.strip()]

team_ups = {}
current_hero = None
current_provider = None
current_tu_name = None
current_desc = []

# Hero names mapping to our JS IDs
# We will do a fuzzy match in python to get the JS ID
heroes_map = {
    'adam warlock': 'adamwarlock', 'angela': 'angela', 'black cat': 'blackcat', 
    'black panther': 'blackpanther', 'black widow': 'blackwidow', 'blade': 'blade',
    'captain america': 'captainamerica', 'cloak & dagger': 'cloakdagger', 'cyclops': 'cyclops',
    'daredevil': 'daredevil', 'deadpool': 'deadpool', 'devil dinosaur': 'devildinosaur',
    'doctor strange': 'doctorstrange', 'elsa bloodstone': 'elsabloodstone', 'emma frost': 'emmafrost',
    'gambit': 'gambit', 'groot': 'groot', 'hawkeye': 'hawkeye', 'hela': 'hela',
    'hulk': 'hulk', 'human torch': 'humantorch', 'invisible woman': 'invisiblewoman',
    'iron fist': 'ironfist', 'iron man': 'ironman', 'jeff the land shark': 'jeff',
    'jeff': 'jeff', 'jubilee': 'jubilee', 'loki': 'loki', 'luna snow': 'lunasnow',
    'magik': 'magik', 'magneto': 'magneto', 'mantis': 'mantis', 'mister fantastic': 'misterfantastic',
    'moon knight': 'moonknight', 'namor': 'namor', 'peni parker': 'peniparker',
    'phoenix': 'phoenix', 'psylocke': 'psylocke', 'rocket raccoon': 'rocket',
    'rocket': 'rocket', 'rogue': 'rogue', 'scarlet witch': 'scarletwitch',
    'spider-man': 'spiderman', 'squirrel girl': 'squirrelgirl', 'star-lord': 'starlord',
    'storm': 'storm', 'the hood': 'thehood', 'the punisher': 'punisher', 'punisher': 'punisher',
    'the thing': 'thething', 'thor': 'thor', 'ultron': 'ultron', 'venom': 'venom',
    'white fox': 'whitefox', 'winter soldier': 'wintersoldier', 'wolverine': 'wolverine'
}

def get_id(name):
    clean_name = name.lower().strip()
    return heroes_map.get(clean_name, None)

def flush_tu():
    global current_tu_name, current_provider, current_desc, team_ups, current_hero
    if current_tu_name and current_provider and current_hero:
        h1 = get_id(current_hero)
        h2 = get_id(current_provider)
        if h1 and h2:
            tu_id = current_tu_name.lower().replace(' ', '-').replace("'", "").replace(',', '')
            if tu_id not in team_ups:
                team_ups[tu_id] = {
                    'id': tu_id,
                    'name': current_tu_name,
                    'heroes': sorted([h1, h2]),
                    'description': ' '.join(current_desc)
                }
    current_tu_name = None
    current_provider = None
    current_desc = []

started = False
for line in lines:
    if line == 'Hero':
        started = True
        continue
    if not started: continue
    
    # Check if line is Hero line, e.g. "Adam Warlock (Strategist)"
    if '(Vanguard)' in line or '(Duelist)' in line or '(Strategist)' in line:
        flush_tu()
        current_hero = line.split('(')[0].strip()
        continue
    
    # Check if line is provider, e.g. "Storm provides: Cosmic Cyclone"
    match = re.match(r'(.+) provides: (.+)', line)
    if match:
        flush_tu()
        current_provider = match.group(1).strip()
        current_tu_name = match.group(2).strip()
        continue
        
    if current_tu_name:
        current_desc.append(line)

flush_tu()

# Format as JS
js_output = 'export const teamUps = [\n'
for v in team_ups.values():
    js_output += '  {\n'
    js_output += f"    id: '{v['id']}',\n"
    js_output += f"    name: {repr(v['name'])},\n"
    js_output += f"    heroes: {json.dumps(v['heroes'])},\n"
    desc = v['description'].replace('Basic:', '').replace('Enhanced:', ' | Enhanced:')
    js_output += f"    description: {repr(desc)}\n"
    js_output += '  },\n'
js_output += '];\n'

with open('new_teamups.js', 'w', encoding='utf-8') as f:
    f.write(js_output)

print(f"Extracted {len(team_ups)} team ups.")
