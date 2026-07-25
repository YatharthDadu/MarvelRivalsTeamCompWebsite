import cloudscraper
import re
import os
import json
import urllib.parse

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

scraper = cloudscraper.create_scraper()
html = scraper.get('https://marvelrivals.fandom.com/wiki/Heroes').text

# Find all occurrences of hero images
urls = re.findall(r'https://static\.wikia\.nocookie\.net/marvel-rivals/images/[^\"]+\.png/revision/latest', html)
print(f"Found {len(urls)} URLs.")

os.makedirs('public/heroes', exist_ok=True)
downloaded = set()

for url in urls:
    if 'Icon' in url or 'Costume' in url or 'Default' in url:
        # try to guess hero name from url
        decoded = urllib.parse.unquote(url).lower()
        
        found_id = None
        for name, h_id in heroes_map.items():
            if name.replace(' ', '_') in decoded or name.replace(' ', '') in decoded or name.replace(' ', '-') in decoded:
                found_id = h_id
                break
                
        if found_id and found_id not in downloaded:
            print(f"Downloading {found_id} from {url[:50]}...")
            try:
                img_data = scraper.get(url).content
                with open(f'public/heroes/{found_id}.png', 'wb') as f:
                    f.write(img_data)
                downloaded.add(found_id)
            except Exception as e:
                print(f"Failed {found_id}: {e}")

print(f"Downloaded {len(downloaded)} hero icons.")
