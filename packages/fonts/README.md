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
