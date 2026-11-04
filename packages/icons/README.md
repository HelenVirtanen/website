# @moscowcss/icons

Drop raw SVGs into `src/svg/`. Run `pnpm --filter @moscowcss/icons build` to clean
them with SVGO and generate ready-to-import Astro components in
`src/generated/` (git-ignored — regenerate, never hand-edit).

```astro
---
import { ArrowLong } from '@moscowcss/icons';
---
<ArrowLong size="24" />
```

## Third-party icons

`src/svg/snowflake.svg` is the `snowflake` icon from [Lucide](https://lucide.dev), ISC license, see
`LICENSE-lucide.txt`.
