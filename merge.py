import re

with open('src/data.js', 'r', encoding='utf-8') as f:
    data_content = f.read()

# Get everything up to the teamUps definition
match = re.search(r'export const teamUps = \[', data_content)
if match:
    prefix = data_content[:match.start()]
else:
    # Fallback
    prefix = data_content

with open('new_teamups.js', 'r', encoding='utf-8') as f:
    tu_content = f.read()

idx = tu_content.find('Authored by Craig Robinson')
if idx != -1:
    tu_content = tu_content[:idx] + "'" + "\n  }\n];\n"

with open('src/data.js', 'w', encoding='utf-8') as f:
    f.write(prefix + "\n// Season 9 Overhauled Team-Ups (Scraped 101 entries)\n" + tu_content)
