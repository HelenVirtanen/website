# Deploy

The site is deployed to GitHub Pages by `.github/workflows/deploy.yml`.

- Target repository: `moscowcss-meetup/website`.
- Production URL: `https://css.moscow`.
- Every push to `master` runs the full check (`pnpm lint`, `pnpm test`, `pnpm build`,
  `pnpm --filter website check:seo`, `pnpm build:storybook`) and, if it passes, deploys
  `apps/website/dist`. Pull requests run the same checks without deploying.
- Node comes from `.nvmrc`; pnpm comes from the `packageManager` field in `package.json`.

## One-time GitHub setup (done by a human)

1. Push this repository to `moscowcss-meetup/website`.
2. Settings -> Pages -> Build and deployment -> Source: **GitHub Actions**.
3. Settings -> Pages -> Custom domain: `css.moscow`, then enable **Enforce HTTPS**
   (available once the certificate is issued, usually within minutes of DNS resolving).

No `CNAME` file is needed: when a site is published from a custom Actions workflow, GitHub
ignores it. See
[Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## DNS for the apex domain `css.moscow`

| Type | Name | Value |
| ---- | ---- | ----- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA (optional) | `@` | `2606:50c0:8000::153` |
| AAAA (optional) | `@` | `2606:50c0:8001::153` |
| AAAA (optional) | `@` | `2606:50c0:8002::153` |
| AAAA (optional) | `@` | `2606:50c0:8003::153` |

Verify with `dig css.moscow +noall +answer -t A`.
