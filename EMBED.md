# Portfolio miniroom embed

Public room-only URL: https://bomi-miniroom-portfolio.evenbean4.chatgpt.site/

The existing full mini hompi remains at http://localhost:4173/.
Local room-only preview: http://localhost:4173/embed/.
Iframe test pages: http://localhost:4173/embed-preview.html and http://localhost:4173/embed-public-preview.html.

## Copy into your portfolio

```html
<div style="position:relative;width:100%;aspect-ratio:47/34;">
  <iframe
    src="https://bomi-miniroom-portfolio.evenbean4.chatgpt.site/"
    title="Interactive Korean miniroom"
    loading="lazy"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;display:block;"
  ></iframe>
</div>
```

The wrapper controls the section size. The recommended ratio is 940:680 (47:34). You can instead give your own wrapper a fixed height or responsive height; the room centers and scales to fit BOTH dimensions, leaving transparent space around it when needed. The whole room remains visible. No internal scrollbars or parent-page JavaScript is needed. Do not add a sandbox without allow-scripts; the room requires JavaScript. A sandbox is not required by this embed.

If your portfolio uses a Content-Security-Policy, its frame-src directive must permit https://bomi-miniroom-portfolio.evenbean4.chatgpt.site. The public site was verified inside cross-origin iframes with no login gate.

## Preserved interactions

Click clear floor to walk with the original collision avoidance and depth ordering. Click mini-mi to wave and speak, sofa to approach/sit, lamp to toggle illumination, window to change day/night, and the bookcase/plant/table for their original speech interaction. Existing PNGs and animation frames are unchanged. Profile, hompi frame, title, tabs, editing tools, reset button and instructions are not rendered in the room-only version. An invisible live status region is retained for assistive technology.

Embed preferences use `bom-miniroom-embed-v1`; the full version keeps `bom-miniroom-v1`. They do not overwrite each other's saved preferences. Browsers may partition or block iframe storage; interactions still work in memory when storage is unavailable.

## Source and hosting

`src/App.tsx` owns one shared room scene and behavior. The `embedded` prop selects room-only rendering. `embed/index.html` is the separate local entry; the original `index.html` stays full-featured.

Run `pnpm exec node scripts/prepare-embed.mjs` (or `node scripts/prepare-embed.mjs`) from the parent project to refresh the standalone source at `portfolio-embed/`. Existing Site identity is preserved. It copies the same sprites and shared code, excluding the unused source atlas. That folder can be installed/built independently:

```sh
cd portfolio-embed
pnpm install
pnpm build
```

`portfolio-embed/dist/` is a standalone static deployment directory. It opens directly in room-only mode at `/`; it does not require an SPA rewrite or a backend. `miniroom-embed.tar.gz` is the verified archive used for the first Sites publication. Future source edits require rebuilding and redeploying to update the public URL.

Sites project: appgprj_6aea0e11737481919652965f70680e10
Published source commit: dc686be4a4095d79d97625c38543d10ecd58891e

See `embed-qa.md` for browser evidence and test results.

## English portfolio mode for Readdy

Use this exact iframe URL for friendly English text:

https://bomi-miniroom-portfolio.evenbean4.chatgpt.site/?mode=portfolio

The same URL without `?mode=portfolio` remains Korean:

https://bomi-miniroom-portfolio.evenbean4.chatgpt.site/

The parameter affects text, accessible labels, document language, and English speech-bubble wrapping/placement. Room artwork, movement, furniture, animation and saved preferences are shared unchanged. Language is never saved or inferred from your browser, so the future Korean launch remains the default. The room-only embed continues to hide all hompi chrome and editing controls.

Copy `iframe-portfolio.html` into a Readdy custom HTML/embed section, or replace the `src` in your existing iframe with the English URL above. The existing responsive wrapper still works unchanged. Local tests: `/embed/?mode=portfolio` for room-only English and `/?mode=portfolio` for the full interface in English.

English mode was published as version 2 from source commit `2c14a59da234b33c8bff2b221c0d11104ef86eb0`. Both public URL variants were verified inside cross-origin iframes. See `portfolio-language-qa.md` for language, responsive text, movement, and publication evidence.
