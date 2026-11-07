# Background cutout

Removes the background from a portrait and writes a transparent PNG. The organizer cards draw a
pink octagon behind the photo (`color.speakerAccent`), so an organizer photo must be a cut-out
silhouette: an opaque photo hides the octagon. The same works for review and speaker portraits.

It wraps [rembg](https://github.com/danielgatis/rembg) (MIT) in a small script with the settings
that worked on our photos. Like `tools/visual`, it is not a workspace package and `pnpm lint` does
not cover it.

```
tools/cutout/
├── cutout.py         # the cutout itself: rembg + crop + resize + edge clean-up
├── run.mjs           # pnpm entry point: finds or creates the Python environment, runs cutout.py
├── requirements.txt  # exact versions of rembg[cpu] and everything it pulls in
└── .venv/            # the Python environment, created by --setup (git-ignored)
```

## Setup (once per machine)

Needs Python 3.11 or newer on the `PATH` (`python` on Windows, `python3` on macOS and Linux).

```bash
pnpm cutout --setup
```

This creates `tools/cutout/.venv` and installs `requirements.txt` into it (about 300 MB with
`onnxruntime` and `scipy`). Nothing is installed globally.

On the first cutout rembg downloads the model into `~/.u2net/` (`u2net_human_seg`, about 170 MB) and
reuses it afterwards. Set `U2NET_HOME` to keep the models elsewhere.

## Usage

```bash
pnpm cutout <input> <output.png> [--crop x,y,side] [--size 498] [--model name] [--edge 0.8] [--preview]
```

| Option | Default | What it does |
|---|---|---|
| `--crop x,y,side` | none | Square in pixels of the **original** photo to keep: left, top, side. |
| `--size N` | `498` | Side of the resulting square. Organizer photos are 498×498 (2x of the card). `0` keeps the size. |
| `--model name` | `u2net_human_seg` | rembg model. `isnet-general-use` is the alternative for objects and odd poses. |
| `--edge px` | `0.8` | Shrinks the mask by a pixel and blurs its edge by this radius: removes the dark fringe of the old background. `0` turns it off. |
| `--preview` | off | Also writes `<output>.preview.png`: the cutout on the organizer pink, to check the edge by eye. Do not commit it. |

Example, the photo of a new organizer:

```bash
pnpm cutout "design/организаторы/Дарина Паирель/photo.jpg" packages/content/src/organizers/assets/darina-pairel.png --crop 85,140,540 --preview
```

Then open the preview, and if the edge is clean, delete it and reference the PNG from the content
file (`photo: ../assets/darina-pairel.png`).

## Why these settings

- **The whole photo is cut first, then cropped and resized.** On a small crop the model sees less of
  the person and the mask comes out jagged.
- **No alpha matting.** On a dark background rembg's alpha matting turned the hair edge into
  visible steps. `post_process_mask` plus the small edge blur gives a smooth outline instead.
- **`u2net_human_seg` by default.** It is trained on people, and on our portraits it kept the hair
  outline cleaner than `isnet-general-use`.

Always look at the preview: hair against a background of the same colour can still lose strands.
If it does, try `--model isnet-general-use` or ask for a photo on a lighter background.

## Updating rembg

`requirements.txt` pins every package, so the result does not change between machines. To update:

```bash
tools/cutout/.venv/Scripts/python -m pip install --upgrade "rembg[cpu]"   # macOS/Linux: .venv/bin/python
tools/cutout/.venv/Scripts/python -m pip freeze > tools/cutout/requirements.txt
```

Keep the first comment line of `requirements.txt`, recut one known portrait and compare the edge
before committing.
