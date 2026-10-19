# Generated Lowball pixel art

This is the active image set: **100 item PNGs + 9 utility PNGs**, all generated with `image_gen` on 19 October 2026. The artwork follows the original Lowball `big-mac.png`, `kindle-paperwhite.png`, `trophy.png`, and green-gem references: dark stepped pixel outlines, shaded materials, and small bright highlights.

`source/items-1.png` through `source/items-4.png` are the untouched generated 25-item atlases. Their reading order matches `ITEMS` in the game (left to right, then top to bottom). `source/utilities.png` contains trophy, lock, stats, green/yellow/orange/red gems, and sound-on/off images. The individual transparent 192×192 PNGs are extracted from those images, not drawn with code. Extraction preserves complete connected sprites rather than cutting through objects at approximate grid boundaries.

`manifest.json` records exact names, filenames, source atlases, cells, and source bounds. `scripts/extract-lowball-images.cjs` reproduces the PNGs using Sharp. The original atlases stay here for future reference and consistent additions.

At runtime, `item-art.js` loads these local PNGs using an explicit map. It makes no image-generation requests, needs no API key, and uses no SVG illustration fallback. To add an item, generate a matching transparent image, save it alongside the existing assets, add an explicit mapping, and extend the manifest and coverage check as needed.
