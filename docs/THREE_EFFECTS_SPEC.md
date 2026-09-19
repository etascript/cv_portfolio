# Three.js and Motion Spec

## Goal

Add life to the virtual CV without turning it into a game or a gimmick. The site should still feel like a professional CV wrapped in a late 90s / early 2000s web interface.

## Principles

- Three.js supports the interface; it does not replace the content.
- Motion should feel immediate: 80ms, 120ms or 180ms for UI transitions.
- 3D should be small, inspectable and tied to the CV concept.
- Effects must respect `prefers-reduced-motion`.
- Mobile keeps the visual language but reduces 3D and cursor effects.
- Text, navigation and screenshots remain the priority.

## Phase 1

### Retro Globe

Location: Home decorative panel.

Behavior:

- Small Three.js canvas.
- Low-poly/wireframe globe with small orbiting pixels.
- Slow rotation.
- Responds subtly to pointer movement on desktop.
- Falls back to static logo when reduced motion is enabled.

Purpose:

- Signals "web / internet / personal site" without using a giant illustration.

### Pixel Cursor Trail

Location: global app layer.

Behavior:

- Lightweight DOM pixels following pointer movement.
- Desktop only.
- Disabled on `prefers-reduced-motion`.
- Short lifetime and low opacity.

Purpose:

- Adds tactile retro feedback without interfering with clicks or keyboard navigation.

### Window Transitions

Location: browser frame, windows, panels and cards.

Behavior:

- Slight appear animation with pixel-step timing.
- Small hover shift for cards and buttons.
- No scroll choreography or parallax.

Purpose:

- Make the Win32-inspired UI feel active rather than static.

## Phase 2 Candidates

- CRT project viewer for screenshots.
- 3D folder tree for technologies.
- Easter egg mini scene launched from the brand double-click.

## Accessibility

- All effects are decorative.
- Canvas is `aria-hidden`.
- Pointer effects use `pointer-events: none`.
- Reduced motion disables animation and cursor trail.
