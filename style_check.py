import urllib.request
import re
from collections import Counter

url = 'https://www.marvelrivals.com/index.html'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    css_links = re.findall(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"', html)
    
    print("Found CSS Links:")
    for link in css_links:
        if link.startswith('//'): link = 'https:' + link
        elif link.startswith('/'): link = 'https://www.marvelrivals.com' + link
        print(link)
        css = urllib.request.urlopen(urllib.request.Request(link, headers={'User-Agent': 'Mozilla'})).read().decode('utf-8')
        colors = re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}', css)
        print("CSS Colors:", Counter(colors).most_common(10))
        fonts = re.findall(r'font-family:\s*([^;}]+)', css)
        print("CSS Fonts:", Counter(fonts).most_common(5))
except Exception as e:
    print("Error:", e)
