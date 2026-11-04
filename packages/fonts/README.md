# @moscowcss/fonts

`@font-face` declarations + font files. Import once at the app root:

```astro
import '@moscowcss/fonts';
```

## TTF files for OpenGraph cards

`montserrat/Montserrat-Regular.ttf`, `Montserrat-SemiBold.ttf` and `Montserrat-Bold.ttf` are not
used by the browser. `@moscowcss/og` reads them to draw the OpenGraph and Twitter cards, because
satori cannot read WOFF2. They are exported from `package.json` as `./montserrat-regular.ttf`,
`./montserrat-semibold.ttf` and `./montserrat-bold.ttf`.

Source: the official Montserrat repository, `JulietaUla/Montserrat` (`fonts/ttf/`, commit
`555facf`), under the same SIL Open Font License 1.1 as the WOFF2 set (see
`montserrat/LICENSE.txt`). To refresh them, take the files from that repository and keep the
export names unchanged.

## Jost, Golos Text, JetBrains Mono Light

Added for the designer components. All three are licensed under the SIL Open Font License 1.1;
each folder keeps the upstream `LICENSE.txt` next to the files.

| Family | Weight | Folder | Files |
| --- | --- | --- | --- |
| Jost | 400 | `jost/` | `jost-{cyrillic,latin}-400-normal.woff2` |
| Golos Text | 400 | `golos/` | `golos-text-{cyrillic,latin}-400-normal.woff2` |
| JetBrains Mono | 300 | `jetbrains/` | `jetbrains-mono-{cyrillic,latin}-300-normal.woff2` |

Source: the `@fontsource/jost`, `@fontsource/golos-text` and `@fontsource/jetbrains-mono` npm
packages, version 5.3.0 (the `files/*-normal.woff2` subsets and the `LICENSE` of each package).
They were installed in a temporary directory outside the repository and only the files were
copied; no dependency was added to this workspace. The `unicode-range` of every `@font-face` is
taken from the same packages' CSS, so the browser downloads the Cyrillic and Latin subsets
separately and only when a page needs them. The other JetBrains Mono weights are full, unsubsetted
files and carry no `unicode-range`. To refresh a set, repeat the same steps and keep the family
names `Jost` and `Golos Text`: the design tokens refer to them.
