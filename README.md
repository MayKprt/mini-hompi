# mini hompi

A React + TypeScript browser prototype of an original Korean miniroom.

## Run

```sh
pnpm install
pnpm dev --host 0.0.0.0 --port 4173
```

Open http://localhost:4173. Click the floor to walk, mini-mi to wave, sofa to sit, lamp to toggle light, or window to switch day/night. 꾸미기 enables furniture dragging and precise directional controls. 처음으로 resets the room. Settings persist in localStorage on this origin.

## Verify

```sh
pnpm exec tsc --noEmit
node --experimental-strip-types --test tests/engine.test.mjs
pnpm build
```

See design.md for geometry, asset anchors and prototype limitations. Separate prototype sprites and the source atlas are in public/assets. No backend is required.
