# Сверка пачки митапов с таблицей докладов: python3 -I check-batch.py <sheet.csv> <slug>...
# Код 1 и список расхождений, если у митапа нет файлов на обоих языках, число докладов не совпадает
# с таблицей или доклад ссылается на спикера без файла.
import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / 'packages/content/src'
SPECIAL = {'online-2021': 'online', '19-plus': '19+'}
# 28–30 в таблице неполные; источник программы — старый сайт (у 29-го без отменённого доклада Шек).
COUNT_OVERRIDE = {'28': 3, '29': 4, '30': 3}


def frontmatter(path):
    text = path.read_text(encoding='utf-8')
    match = re.match(r'^---\n(.*?)\n---\n?(.*)$', text, re.S)
    return (match.group(1), match.group(2)) if match else ('', text)


def field(meta, name):
    match = re.search(rf'^{name}:\s*"?([^"\n]*)"?\s*$', meta, re.M)
    return match.group(1) if match else None


def speakers_of(meta):
    inline = re.search(r'^speakers:\s*\[(.*?)\]', meta, re.M)
    if inline:
        return [s.strip().strip('"') for s in inline.group(1).split(',') if s.strip()]
    block = re.search(r'^speakers:\s*\n((?:\s+-\s*.+\n?)+)', meta, re.M)
    return [s.strip().lstrip('-').strip().strip('"') for s in block.group(1).splitlines()] if block else []


def main():
    sheet, slugs = sys.argv[1], sys.argv[2:]
    rows = list(csv.DictReader(open(sheet, encoding='utf-8')))
    problems = []
    for slug in slugs:
        key = SPECIAL.get(slug, slug)
        expected = [r for r in rows if r['Митап'].strip() == key]
        for lang in ('ru', 'en'):
            event = ROOT / 'events' / lang / f'{slug}.md'
            if not event.exists():
                problems.append(f'{slug}: нет {event.relative_to(ROOT)}')
            talks = []
            for path in sorted((ROOT / 'talks' / lang).glob('*.md')):
                meta, body = frontmatter(path)
                if field(meta, 'event') == slug and field(meta, 'draft') != 'true':
                    talks.append((path, meta, body))
                    if not body.strip():
                        problems.append(f'{path.relative_to(ROOT)}: пустое описание')
                    for speaker in speakers_of(meta):
                        if not (ROOT / 'speakers' / lang / f'{speaker}.md').exists():
                            problems.append(f'{path.relative_to(ROOT)}: нет спикера {speaker}')
            want = COUNT_OVERRIDE.get(slug, len(expected))
            if want and len(talks) != want:
                problems.append(f'{slug}/{lang}: докладов {len(talks)}, ожидалось {want}')
        print(f'{slug}: строк в таблице {len(expected)}')
    for problem in problems:
        print('ОШИБКА', problem)
    sys.exit(1 if problems else 0)


main()
