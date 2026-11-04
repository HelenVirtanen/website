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
