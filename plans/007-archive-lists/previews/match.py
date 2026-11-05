# Сопоставляет доклады с картинками анонсов из экспорта Telegram: картинка поста, в тексте
# которого названа фамилия спикера, не раньше чем за 60 дней до митапа. Пишет CSV для проверки глазами.
import csv, html, re, sys
from datetime import datetime, timedelta
from pathlib import Path

export, content, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
raw = (export / 'messages.html').read_text(encoding='utf8')

posts = []
for chunk in raw.split('<div class="message default clearfix')[1:]:
    date = re.search(r'title="(\d\d\.\d\d\.\d{4} \d\d:\d\d:\d\d)', chunk)
    photos = re.findall(r'href="(photos/[^"]+\.jpg)"', chunk)
    text = re.search(r'<div class="text">(.*?)</div>', chunk, re.S)
    if not (date and photos):
        continue
    body = html.unescape(re.sub('<[^>]+>', ' ', text.group(1))) if text else ''
    posts.append((datetime.strptime(date.group(1), '%d.%m.%Y %H:%M:%S'), photos[0], body))

def front(path):
    text = path.read_text(encoding='utf8').split('---')[1]
    return {k: v.strip().strip('"') for k, v in re.findall(r'^(\w+):\s*(.*)$', text, re.M)}, text

names = {p.stem: front(p)[0]['name'] for p in (content / 'speakers/ru').glob('*.md')}
dates = {p.stem: datetime.strptime(front(p)[0]['date'], '%Y-%m-%d') for p in (content / 'events/ru').glob('*.md')}

def stem(name):
    surname = name.split()[-1]
    return surname[: max(4, len(surname) - 2)].lower()

rows = []
for path in sorted((content / 'talks/ru').glob('*.md')):
    data, text = front(path)
    block = re.search(r'^speakers:\n((?:\s+-.*\n?)+)', text, re.M)
    speakers = re.findall(r'-\s+"?([a-z0-9-]+)"?', block.group(1)) if block else []
    event = dates.get(data.get('event', ''))
    stems = [stem(names[s]) for s in speakers if s in names]
    found = []
    if event and stems:
        for when, photo, body in posts:
            low = body.lower()
            if event - timedelta(days=60) <= when <= event + timedelta(days=1) and all(s in low for s in stems):
                others = sum(1 for n in names.values() if stem(n) in low and stem(n) not in stems)
                found.append((others, abs((event - when).days), photo))
    found.sort()
    rows.append({'talk': path.stem, 'event': data.get('event'), 'speakers': ' '.join(speakers),
                 'photo': found[0][2] if found else '', 'others': found[0][0] if found else '',
                 'candidates': len(found)})

with out.open('w', newline='', encoding='utf8') as file:
    writer = csv.DictWriter(file, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
print(sum(1 for r in rows if r['photo']), 'of', len(rows), 'talks matched')
