# Report task 08 (DONE_WITH_CONCERNS)

Visual compare baseline vs .visual/t08 (BUILD_NOW=2026-07-01), exit 0, ignored: site/navbar@, stories/components-localeswitcher, plus new stories components-prose, components-linklist (extra PNGs otherwise fail compare).

```
site/faq@1024.png                                         0.0005%
site/faq@1280.png                                         0.0003%
site/faq@1920.png                                         0.0002%
site/faq@375.png                                          0.0014%
site/faq@768.png                                          0.0007%
site/hero@1024.png                                        0.0000%
site/hero@1280.png                                        0.0000%
site/hero@1920.png                                        0.0000%
site/hero@375.png                                         0.0000%
site/hero@768.png                                         0.0000%
site/join@1024.png                                        0.0000%
site/join@1280.png                                        0.0000%
site/join@1920.png                                        0.0000%
site/join@375.png                                         0.0000%
site/join@768.png                                         0.0000%
site/navbar@1024.png                                      ИСКЛЮЧЁН (--ignore)
site/navbar@1280.png                                      ИСКЛЮЧЁН (--ignore)
site/navbar@1920.png                                      ИСКЛЮЧЁН (--ignore)
site/navbar@375.png                                       ИСКЛЮЧЁН (--ignore)
site/navbar@768.png                                       ИСКЛЮЧЁН (--ignore)
site/partner@1024.png                                     0.0000%
site/partner@1280.png                                     0.0000%
site/partner@1920.png                                     0.0000%
site/partner@375.png                                      0.0000%
site/partner@768.png                                      0.0000%
site/program@1024.png                                     0.0000%
site/program@1280.png                                     0.0000%
site/program@1920.png                                     0.0000%
site/program@375.png                                      0.0000%
site/program@768.png                                      0.0000%
файлов: 160, ошибок: 0, порог: 0.1%
```
Max share over all 160 files: 0.0014%.

## Concerns
- turbo strict env drops BUILD_NOW: `BUILD_NOW=... pnpm build` silently uses real time. Used `pnpm build --env-mode=loose --force`. Fix needs `"env": ["BUILD_NOW"]` in turbo.json build task (outside owns).
- About and PastEvents sections are placed after Join: placing About before Program shifted fractional y of captured sections, giving up to 2.9% diffs at 375 (anti-aliasing) and 1px size changes.
- AC-11 grep cannot be empty: layouts/BaseLayout.astro (not owned) has Cyrillic JSDoc without //. Own section files converted to // comments.
- JoinBlock (ui) and MapPlaceholder text stay Russian on en (ui package not owned).
- Hero link "Watch stream" keeps href="" when streamUrl absent (reproduces the original for parity).
- Speaker photos use photo.src (original file, no optimisation) for pixel parity.
- Markdown links lack target/rel of the original FAQ links.
- Partner logo/QR icons remain hardcoded Zvuk.
- en program.hint reuses tag #moscowcss_questions (en FAQ), ru keeps #вопросспикеру.
- Directions body rendered via Prose with display:contents + order (caption after map); depends on body structure h2/p/ul/p.
- page.title/description now feed BaseLayout title/meta.
