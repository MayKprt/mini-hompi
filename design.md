# 봄이의 미니홈피 — first-room design

## Visual rules
Original room inspired by the supplied early-2000s Cyworld screenshots, not a reproduction of their characters or UI. Cream wallpaper, warm honey wood, dusty pink textiles, dark brown sprite outlines and a quiet sage hompi frame. The room is the primary surface; compact Korean controls sit outside it. Desktop includes a nostalgic profile column; narrow screens prioritize the room.

## Assets
Separate transparent PNGs live in public/assets: sofa, table, lamp, shelf, plant and mini. The original AI-generated atlas and its prompt are retained for replacement. These are prototype sprites, not a final hand-pixeled animation set. Target logical sizes: sofa 93×73, table 58×49, lamp 31×77, shelf 56×63, plant 34×50, mini-mi 36×61. Assets are reduced to logical resolution and displayed with nearest-neighbor pixel rendering. Furniture and mini-mi share roughly a two-display-pixel grid at the base room size. The original mini-mi has chestnut bob hair, a pink clip, expressive eyes, oversized head and pink cardigan. Replace assets by keeping filenames, transparent margins tight, and the same ground-contact anchor. No furnished background is flattened into an image.

## Room geometry
Scene is 940×680, scaled as a single responsive coordinate system. Floor coordinates are x,y in [0,10]. Projection: screenX=470+37(x−y), screenY=235+18.5(x+y). Thus the floor is a 2:1 diamond. Two 225px-high walls meet at the rear corner. Floor boards, wallpaper, window, rug and picture frames are deterministic canvas scenery. The window remains independently interactive; furniture and character are separate DOM sprites.

Furniture footpoints are their center ground anchor. Width/depth footprints are defined in src/engine.ts. Rendering sorts objects by x+y+front-footprint-depth, with the character sorted by its feet. This allows the character to pass behind and in front of furniture.

## Behavior
- Empty floor click: inverse projection then 0.25-unit eight-neighbor breadth-first routing. Block room boundary and expanded furniture footprints. Diagonal corner cutting is forbidden. Character speed 2.7 units/sec; requestAnimationFrame is frame-rate independent. Walking uses alternating leg motion and body bob.
- Character click: stop path, wave for about 3 seconds and display a Korean speech bubble.
- Sofa click: find a clear approach point, walk there, enter a seated pose. Clicking clear floor exits sitting along a collision-safe path.
- Lamp click: toggle warm illumination. Window click: toggle sky and room day/night palette.
- Decorating: stops movement and hides mini-mi, allows furniture drag on the floor with 0.25-unit snapping. Reject overlaps and positions outside the floor. Selection and directional buttons support precise keyboard-accessible adjustments. Leaving decorating returns mini-mi to an open floor point if required.
- Furniture coordinates, day/night and lamp state persist to versioned localStorage. Parse and validate saved data; fall back to defaults for invalid data. Save errors are disclosed in the interface.
- Reset immediately restores original furniture and lighting, stops movement and resets mini-mi. Short instructions remain below the room.

## Prototype limitations
Single room and single character only. Sprite animation is assembled from the initial PNG; replace with individually drawn walking, waving, and sitting frames for production. Music is decorative and explicitly labeled as imagined playback. Visitor counts are nostalgic sample content. No account, backend, audio playback or publishing is included.

## Portfolio embed variant
The full version stays at `/`. A separate `/embed/` entry reuses the same scene and handlers, renders only room/character/furniture, and omits every surrounding interface and decorating control. Transparent full-viewport styling centers the 940×680 scene and fits both container dimensions. The standalone `portfolio-embed/` build opens this mode at its root and is publicly hosted. Embed storage is isolated from full-version preferences. See EMBED.md for the live URL and responsive iframe snippet.

## URL-selected language
`?mode=portfolio` enables English through `src/locale.ts`; all other modes/defaults remain Korean. It affects display and accessible text only, with no persisted locale. The original Korean strings are preserved verbatim. English speech is a separate text overlay anchored above the existing character and clamped inside the room, moving below the feet only when there is insufficient headroom. Wrapping and a resizing observer accommodate longer text without changing sprites, movement geometry or Korean bubbles.

## Full mini hompi navigation and panels (Nov 7, 2026)
Full view only: right-edge My Room, Diary, Photos and Visitors navigation uses muted teal tabs and a cream active tab. Diary/Photos/Visitors display clearly labeled English sample content, with explicit return-to-room controls. The room stays mounted while hidden so character state and furniture interactions survive navigation. No new tabs or panels render in embed mode.

Desktop uses profile / room / slim tools columns. My Levels has sample Activity 72%, Creativity 88%, Connections 46% progress bars. My Playlist sits immediately below it. Tablet puts tools below the room in two columns. At 700px and below, navigation becomes a top row, tools and connections stack below the main view, and the profile reduces to its connections area. No panel overlays the room.

The old decorative music widget is replaced by a compact sample-melody player: Afternoon Sunshine and A Little Daydream, with previous, play/pause, next and mute controls. A quiet original synthesized loop starts only on explicit play; it is labeled as a sample melody. No audio autoplays and no original song recording was available in the prior widget.

My Connections replaces the old music area under a preserved My Room label. English sample friends can be selected; Visit Room gives an explicit coming-soon message. The photo album remains a sample view, with uploads marked as coming soon. Diary entries, comments, heart reactions and guestbook messages now work locally (see the social forms update below). No changes were deployed to the portfolio embed, and its standalone source snapshot remains unchanged.

## Diary and guestbook forms update
The Visitors page heading is now Connections Only, retaining the existing Visitors navigation tab. This is a requested label, with no account-based access control added. The redundant My Room label above My Connections was removed. A + Write diary action opens a responsive native dialog styled as a lined notepad, with title, text and mood fields, Save and Cancel controls, autofocus, keyboard focus containment and Escape dismissal. Each sample and new diary entry has a toggleable outline-heart Like reaction and an Add a comment form. Guestbook notes accept an optional name and a message. All submitted content and reactions persist under the full-view-only full-hompi-social-v1 localStorage key; the interface clearly says nothing is posted online. Room interactions and portfolio source/build are unchanged.
