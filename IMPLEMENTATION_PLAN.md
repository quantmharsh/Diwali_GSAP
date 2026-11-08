# Diwali Cinematic Experience

## Implementation status

The cinematic upgrade request is implemented as a six-scene, scroll-driven static website. The original `index.html` prototype is preserved; the active Next.js experience lives in `app/` and `components/`.

## Scene order

1. **Magical opening:** night sky, moon, clouds, sequential diya lighting, particle-built DIWALI title, and a gold wipe.
2. **Palace of lights:** inline SVG palace with windows illuminating in sequence, floating lanterns, and marigold petals.
3. **Rangoli:** SVG mandala draws and turns into view, surrounded by diyas and a radial transition.
4. **River of lights:** layered water and reflections, travelling diya, and rising sparks.
5. **Fireworks:** canvas fireworks above a silhouetted skyline with a staged greeting reveal.
6. **Finale:** converging gold particles, a split-letter Happy Diwali reveal, Hindi greeting, closing wish, and replay control.

## Motion and implementation choices

- GSAP ScrollTrigger owns the scene timelines. The opening, rangoli, river, and finale pin on desktop; other scenes follow normal document scrolling. Mobile uses unpinned timelines.
- Canvas effects are used for title particles, fireworks, and finale particles. Their animation loops stop while offscreen and use a reduced-motion static mode.
- Ambient CSS motion adds a breathing moon glow, swinging palace lanterns, a slow rangoli orbit, moving water highlights, a breathing fireworks haze, and a pulsing finale light.
- SVG and CSS create the palace, rangoli, diyas, lighting, water, and skyline without remote visual assets.
- The site honors `prefers-reduced-motion`; replay returns visitors to the opening.
- No backend, tracking, or user data is required.

## Latest polish

- The finale timeline now ends at the document bottom on unpinned screens, so the title reveal reaches its clear final state on short viewports.
- The finale copy uses tighter small-screen spacing and type sizing; the Happy Diwali greeting, Hindi blessing, signoff, and replay link fit at 390 × 844.
- The replay control is a native `#top` link, and the opening headline remains visible on first load and replay.
- Widened the palace and river copy blocks at desktop widths to preserve the intended two-line headlines.
- GSAP scene setup uses a breakpoint-aware context and rebuilds when crossing the desktop breakpoint or changing the reduced-motion preference.

## Quality checks

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- Local browser preview at `http://localhost:3000/` — all six scenes reviewed while scrolling; four desktop scenes pin, and canvas effects initialize.
- At 390 × 844, the finale reached `data-final-progress=1` at the bottom with its full greeting visible; replay returned to the opening.
- Use `localhost` for the dev preview. The `127.0.0.1` origin is blocked from Next dev resources by the current server configuration.
- Production build and real-device mobile review remain outstanding.
