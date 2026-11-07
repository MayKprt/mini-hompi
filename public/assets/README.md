# Prototype sprite assets

Original AI-generated pixel-art sprites produced with the built-in ImageGen tool, inspired by the supplied Cyworld references. These are replaceable prototype artwork, not final hand-authored animation sprites.

Source prompt: “Original early-2000s Korean Cyworld isometric pixel art, thin dark brown pixel outlines, crisp small pixels, peach cream dusty rose and warm honey wood palette. Separate pink lace-cushion two-seat sofa, oak tea table with teacup/book, tall brass pink pleated lamp, oak bookcase/radio, terracotta leafy plant, original front-view mini-mi girl with oversized chestnut bob head/pink hairclip/pink cardigan/cream skirt/brown shoes. Transparent background, no text.”

Background removal was requested in a second built-in edit. Actual alpha was verified. Source-atlas.png retains the generated output. Individual cells were cropped, alpha thresholded, and nearest-neighbor reduced to a shared logical pixel grid. Walking, waving and sitting frames reuse cropped body/limb pixels and are temporary; replace the mini-*.png files with finished matched sprites.

visitor-friends.png: original four-cell transparent visitor sheet generated using mini.png as the style reference. Cells are selected in CSS; existing room sprites remain unchanged.

robin-baby.svg: original code-drawn pixel-grid baby in a Mickey Mouse costume, transparent, used only for Robin. Generated bitmap attempts were unavailable; this standalone sprite is easy to replace.
