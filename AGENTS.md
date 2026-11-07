# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Full mini hompi design decisions

- Apply the Nov 7, 2026 navigation/sidebar additions only to the full mini hompi. Keep the room-only portfolio embed and its hosted build unchanged.
- New interface labels, interaction feedback and sample content are English, while existing Korean/default and portfolio translations retain their behavior.
- Use compact nostalgic Cyworld-style right-edge Diary, Photos and Visitors tabs, with an active state; use the My Room side tab for returning, without duplicate return buttons in page headers.
- Put My Levels (Activity, Creativity, Connections sample progress) at top right with the compact music player directly below. Keep these outside the room.
- Replace the old bottom-left music area with a My Connections dropdown, omit the redundant My Room label above it (per Nov 7 browser feedback), and clearly mark room visits as coming soon until implemented.
- Stack panels/navigation on small screens; never overlay the room or hide connections on mobile.

## Diary and guestbook feedback

- The Visitors view heading is “Connections Only”; keep the existing Visitors navigation tab. This is a label change, not a claim of implemented access controls.
- Provide a guestbook message form with a submit action, a + Write diary button opening a notepad-style modal, and comments plus toggleable heart reactions beneath every sample or new diary entry.
- Save these full-view prototype entries, comments, and reactions in localStorage, and clearly say that they remain in the current browser. All new copy stays English.

## Follow-up simplification

- Omit the diary sample banner and divider above its reaction row. The comments count beside Like is the only composer toggle; clicking it opens and focuses the comment input.
- Guestbook notes use the local “You” identity; omit the optional name input and its label.
- Omit Back to My Room buttons from all extra views; retain the My Room side tab.

## Visitor characters and sticky diary action

- Guestbook visitors have distinct original pixel mini characters instead of initials; omit the guestbook sample banner and dotted dividers between notes.
- Keep + Write diary at the bottom of the diary in a sticky action row, accessible while scrolling.
- Make the existing miniroom and decorating tabs slightly more prominent with padded, softly filled buttons. Keep room assets and portfolio embed unchanged.

- Refine the miniroom/decorating controls as folder tabs joined to their baseline, with an open bottom edge for the selected tab, rather than standalone buttons. Place the diary storage note in its bottom sticky action row. Omit the Photos sample album banner.

- Show Mini Room and Decorate folder tabs only on My Room. Full hompi labels use English; preserve embedded Korean/portfolio language selection.
- Preserve existing player position and palette; add a CD spinning only during playback and gentle overflow-only title scrolling, leaving controls stationary. Visitor characters use distinct hair, outfits, colors and expressions.

- Correction: restore the pre-English-full-view baseline. Preserve existing Korean labels and all translation behavior; only room-tab visibility, visitor artwork, and scoped player refinements are authorized. Keep the same disc design at 19px (about 25% smaller); animate the actual title continuously even when it fits. Visitor artwork follows the earlier Cyworld lineup, with distinct silhouettes and clothing.

- Nov 7 latest reference: visitor heads are rounded and almost twice torso width; compact short limbs and a 40×46 pixel grid replace tall sprites. Title motion is automatic, 36px minimum, with pauses at both ends of an eight-second cycle. Verify actual page navigation and animation before reporting completion.

- Mount the entire conditionally rendered room-tab group inside #miniroom-view, using the same view state as SideTabs. No separate desktop/mobile copy. Verify My Room → Diary → Photos → Visitors → My Room at both sizes and test decorating after return.

- Room tab highlights are mutually exclusive: Miniroom when edit=false, Decorate when edit=true. Visitor sprite slots have transparent backgrounds, and their artwork should match the detail and proportions of Bomi with distinct boy/girl friends.

- Robin alone uses a transparent baby sprite in a Mickey Mouse costume; preserve all other visitor artwork and data.

- Render Jamie, Alex and Sophie on a 36×48 logical pixel grid with nearest-neighbor enlargement to give them more pronounced pixels like Robin, preserving their existing sprite designs and transparent slots.

- Enlarge Jamie/Alex/Sophie heads within the same avatar slots: head gets 44 of 64 logical rows, compact body 20. Use a 48×64 crisp grid so eyes and glints remain readable. Robin remains unchanged.
