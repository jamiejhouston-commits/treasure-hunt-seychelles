# Chapter VI Pre-Mint Art Regeneration Guide

This guide shows how to regenerate the 20 Chapter VI cards so they match the etched style examples in `example art/`.

## 1. Source Material
- Concept spec JSON (prompts + structured metadata): `content/ch6/concept_specs/ch6_###.json`
- Style template / constraints: `content/ch6/concept_specs/STYLE_PROMPT_TEMPLATE.md`
- Target output (gallery ingests from here): `content/ch6/output/`

## 2. Generation Workflow
1. Open a concept spec (e.g. `ch6_007.json`).
2. Combine its `prompt` with the style template. Refine in your image model / tool.
3. Ensure numeric props are visually countable.
4. Export final image as **PNG** named exactly: `ch6_007.png`.
5. (Optional) Tweak description or attributes if the scene changes; update the concept spec, then rebuild output metadata (see next section).

## 3. Build Output Metadata
If you changed concept specs:
```
node scripts/generate_ch6_concepts.cjs          # regenerate concept specs (if you edited the script array)
node scripts/build_ch6_output_from_concepts.cjs # copy specs into output/ as production metadata
```
This places updated JSON in `content/ch6/output/` with cardId, description, attributes.

## 4. Validate Assets
Before ingesting:
```
node scripts/validate_ch6_premint_assets.cjs
```
Fix any reported missing images.

## 5. Ingest into Database
(Backend should be stopped or can hot-update safely.)
```
node scripts/ingest_ch6_premint.js
```
The script now prefers padded image filenames (`ch6_###.png`). It will skip cards missing images.

## 6. View in Pre-Mint Gallery
Visit: `http://localhost:3000/pre-mint`
Hard refresh (Ctrl+Shift+R) to bust cache.

## 7. Common Issues
| Symptom | Cause | Fix |
|---------|-------|-----|
| Card missing | PNG not found / name mismatch | Ensure `ch6_###.png` naming, re-run ingest |
| Old art shows | Browser cache | Hard refresh or append `?v=timestamp` |
| Wrong counts | Visual prop mismatch | Regenerate image to match metadata or adjust attributes consistently |

## 8. Updating Style Direction
Edit `STYLE_PROMPT_TEMPLATE.md` then regenerate prompts manually or add an automated prompt builder if needed.

## 9. Safety Net
Run `scripts/validate_ch6_premint_assets.cjs` before every ingest to catch missing PNGs.

---
Maintainer Notes:
- To hide the `devPrompt` from public metadata, remove the field inside `build_ch6_output_from_concepts.cjs`.
- Consider adding a phase field in DB later for filtering beyond chapter.
