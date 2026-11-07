"""Вырезает фон портрета: прозрачный PNG для фото организаторов и авторов отзывов."""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageFilter
from rembg import new_session, remove

# Модель для людей: на портретах контур волос у неё ровнее, чем у общих моделей.
DEFAULT_MODEL = 'u2net_human_seg'
# Цвет подложки организатора (speakerAccent): превью показывает фото так, как на карточке.
PREVIEW_BACKGROUND = (255, 78, 141, 255)


def parse_crop(value: str) -> tuple[int, int, int]:
    try:
        left, top, size = (int(part) for part in value.split(','))
    except ValueError as error:
        raise argparse.ArgumentTypeError('кроп задаётся как x,y,сторона, например 85,140,540') from error
    if size <= 0:
        raise argparse.ArgumentTypeError('сторона кропа должна быть больше нуля')
    return left, top, size


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Вырезать фон портрета в прозрачный PNG.')
    parser.add_argument('input', type=Path, help='исходное фото (jpg, png, webp)')
    parser.add_argument('output', type=Path, help='куда сохранить PNG')
    parser.add_argument('--crop', type=parse_crop, help='квадрат x,y,сторона в пикселях исходника')
    parser.add_argument('--size', type=int, default=498, help='сторона итогового квадрата; 0 — без уменьшения')
    parser.add_argument('--model', default=DEFAULT_MODEL, help=f'модель rembg, по умолчанию {DEFAULT_MODEL}')
    parser.add_argument('--edge', type=float, default=0.8, help='размытие края в пикселях; 0 — без подрезки края')
    parser.add_argument('--preview', action='store_true', help='сохранить рядом превью на розовой подложке')
    return parser.parse_args(argv)


def cut_out(image: Image.Image, model: str, edge: float) -> Image.Image:
    # Без alpha matting: на тёмном фоне он даёт ступеньки по волосам, а post_process_mask сглаживает маску.
    cut = remove(image, session=new_session(model), post_process_mask=True)
    if edge > 0:
        # Подрезаем край на пиксель и смягчаем: уходит тёмная кайма исходного фона.
        alpha = cut.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(edge))
        cut.putalpha(alpha)
    return cut


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    if not args.input.is_file():
        print(f'cutout: нет файла {args.input}', file=sys.stderr)
        return 1
    # Режем исходник целиком и только потом уменьшаем: на маленьком кадре маска выходит зубчатой.
    cut = cut_out(Image.open(args.input).convert('RGB'), args.model, args.edge)
    if args.crop:
        left, top, side = args.crop
        cut = cut.crop((left, top, left + side, top + side))
    if args.size:
        side = min(cut.size)
        cut = cut.crop((0, 0, side, side)) if cut.width != cut.height else cut
        cut = cut.resize((args.size, args.size), Image.LANCZOS)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    cut.save(args.output)
    print(f'cutout: {args.output} {cut.width}x{cut.height}')
    if args.preview:
        preview = Image.new('RGBA', cut.size, PREVIEW_BACKGROUND)
        preview.alpha_composite(cut)
        path = args.output.with_name(f'{args.output.stem}.preview.png')
        preview.save(path)
        print(f'cutout: превью {path}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
