# Motion and Sound Specification

## Reference translation

The saved Daniel Chhetri reference is a 49.9-second, 60 fps, 1920×1080 motion
piece with continuous narration and roughly eleven idea beats. Its usable
language is large kinetic type, translucent floating cards, shallow depth,
controlled blur, cursor-led UI, central composition, and transitions that
reuse the previous scene's geometry. It also changes the visual metaphor every
two to five seconds: role cards, product UI, alerts, comparison cards, and a
minimal CTA. Ekos should borrow that grammar while replacing abstract feature
claims with the real website, process, engine, and products.

## Animation system

- Canvas: near-black `#000000`; primary accent `#3663FF`; white text.
- Type: use the site's Inter/Instrument Serif pairing. Avoid monospace as a
  decorative style.
- Cards: translucent charcoal with a 1px white border at 8–12% opacity and a
  soft blue edge light. Keep blur behind cards, not over readable content.
- Entrances: cards move 24–48 px with opacity and slight scale. Avoid unrelated
  objects flying in from every edge.
- Camera: slow 2.5D push, 2–4 degrees of tilt, and parallax between browser,
  cards, and background. One camera move should bridge adjacent scenes.
- Cursor: use it as a guide only when an actual interaction happens: selecting
  an ICP, opening a branch, switching configurations, or toggling Products.
- Keywords: give one phrase per sentence the reference's giant-type treatment.
  Use `CUSTOM`, `MAP`, `BUILD`, `RUN`, and `SCALE`; never place a paragraph in
  the kinetic-type layer.
- Process: Diagnose → Strategise → Build & Run must assemble sequentially and
  then connect into the engine. The viewer should see causality.
- Engine: branches populate from Context outward. Channel logos enter only when
  their branch activates. A bright trace follows the winning route; weak routes
  fade rather than explode.
- Products: reveal the real Pocket CMO and Remy screenshots inside browser
  planes. Do not invent dashboards or labels.
- Captions: burn in sentence-level captions, maximum two lines, with the active
  phrase highlighted in blue. Keep Eshaan and essential text inside the central
  safe area in case short excerpts are cropped vertically later.
- End card: stop the camera. Motion reduces to a subtle logo glow and CTA pulse.

## Sound design

- Opening: four dry broadcast cuts saying "AI", separated by sub-bass impacts.
- Talking head: music remains low and stable; no UI sounds under important words.
- Ekos reveal: one tonal bloom plus a short low-frequency rise, not a generic
  cinematic boom.
- Cards: soft glass ticks with different pitches for Diagnose, Strategise, and
  Build & Run.
- Engine: quiet routing clicks, one directional sweep as the data trace moves,
  and a restrained confirmation tone when the winning path resolves.
- Product reveal: two distinct but related chimes, one per product.
- Brand close: music resolves; remove busy percussion and let the final line
  breathe.

## Quality rules

- Show a real product or website surface within four seconds of the Remotion
  handoff.
- Never leave a static frame longer than three seconds unless it is the CTA.
- Every animated object must explain hierarchy, flow, state, or causality.
- Use motion blur on camera movement and card transitions; keep UI text sharp.
- Render and inspect a still from every scene before the first full render.
- Test the master at phone size with sound off before approval.
