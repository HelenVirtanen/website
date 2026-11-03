# Сверка видео канала с контентом (AC-4): python3 -I check-videos.py <youtube.json>
# Печатает видео канала, на которые не ссылается ни один доклад или митап, и ссылки контента на
# YouTube, которых нет на канале. Код 1, если непривязанных видео больше, чем объяснено в
# UNLINKED_REASONS.
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / 'packages/content/src'
# Видео канала, которые сознательно не привязаны: id → причина.
UNLINKED_REASONS: dict[str, str] = {}


def video_id(url):
    match = re.search(r'(?:v=|youtu\.be/|/live/|/embed/)([\w-]{11})', url)
    return match.group(1) if match else None


def main():
    channel = {video['id']: video['title'] for video in json.load(open(sys.argv[1], encoding='utf-8'))}
    used = {}
    for path in ROOT.glob('*/ru/*.md'):
        for url in re.findall(r'^(?:videoUrl|recordingUrl):\s*"([^"]+)"', path.read_text(encoding='utf-8'), re.M):
            vid = video_id(url)
            if vid:
                used.setdefault(vid, []).append(str(path.relative_to(ROOT)))
    unlinked = [vid for vid in channel if vid not in used]
    unexplained = [vid for vid in unlinked if vid not in UNLINKED_REASONS]
    print(f'видео на канале: {len(channel)}, привязано: {len(channel) - len(unlinked)}')
    for vid in unlinked:
        print('НЕ ПРИВЯЗАНО', vid, channel[vid], '—', UNLINKED_REASONS.get(vid, 'без объяснения'))
    for vid in sorted(set(used) - set(channel)):
        print('НЕ С КАНАЛА', vid, used[vid])
    sys.exit(1 if unexplained else 0)


main()
