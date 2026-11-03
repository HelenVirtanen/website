# Report 14
Status: DONE (concern: docs/ ignored by global gitignore, use `git add -f docs/deploy.md`)
Verified 2026-11-03 via curl (WebFetch not used): nodejs.org/dist/index.json first lts entry v26.13.0 Lithium -> .nvmrc = 26;
github.com/<repo>/releases/latest redirects: actions/checkout v7.0.1, pnpm/action-setup v6.1.0, actions/setup-node v7.1.0,
actions/upload-pages-artifact v5.0.0, actions/deploy-pages v5.0.1 -> used @v7/@v6/@v7/@v5/@v5.
Done-when: all 5 pass (full local sequence exit 0; turbo served cached results). YAML valid via PyYAML.
Changes: pages/id-token permissions moved to deploy job only; concurrency per ref.
contract: 621371f0
