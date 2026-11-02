# Plan comparison table

A page comparing three plans (Starter, Team, Business) across 15 features,
with a control that highlights only the features where the plans differ.

No build step and no dependencies. Open `index.html` in a browser, or serve
the folder with any static server (e.g. `npx serve .`).

## Keyboard operation

The page has one interactive element, the **Highlight differences** button.

| Key | What happens |
| --- | --- |
| `Tab` | Moves focus to **Highlight differences**. The next `Tab` leaves the page. |
| `Shift` + `Tab` | Moves focus back. |
| `Enter` or `Space` | Turns highlighting on or off while the button has focus. |
| Arrow keys, `Space`, `Page Up/Down` | Scroll the page when the button does not have focus. |

- **Tab order matches visual order.** The button comes first in the source and
  first on screen at every width. No `tabindex`, CSS `order` or positioning
  is used to rearrange anything.
- **Focus is always visible.** `:focus-visible` draws a 3px blue outline with
  a 3px offset. It appears for keyboard focus and not on mouse clicks. The
  default outline is replaced, never removed.
- **The control is a native `<button>`** with `aria-pressed`. Screen readers
  announce it as "Highlight differences, toggle button, not pressed".
- The table contains no links or buttons by design, so there is nothing
  inside it to tab to. Screen-reader users move through it with their table
  navigation commands.

## The highlight control

When it is on:

- Each feature that differs gets a **"Differs"** text label, a tinted
  background and a thick left border. The label means the state is not
  conveyed by colour alone, and it still shows in Windows High Contrast mode.
- Features that are the same on every plan **stay in place**, in grey text
  that still meets 4.5:1 contrast. Nothing is hidden or reordered, so the
  comparison stays intact and you can still read the shared features.
- A status message (`role="status"`) says how many features differ, so
  screen-reader users hear the result of pressing the button.
- The label sits inside the row header, so a screen reader announces it with
  every cell in that row ("Storage, Differs").

Which rows differ is calculated from the cell contents, so the highlight
cannot drift out of sync with the data.

Without JavaScript the control does not appear, and the full table still works.

## Narrow-screen treatment

**Below 40em (640px at default text size), each feature becomes a two-line
block. The feature name sits on the first line. The three plan values sit
side by side underneath, in fixed columns under a plan-name header that
stays pinned to the top of the screen.**

Options I considered:

1. **Keep the wide table and let it scroll sideways.** Rejected. Horizontal
   scrolling at 320px is a defect, and two of the three plans would be off
   screen at any moment.
2. **One card per plan, stacked.** Rejected. It is the common pattern, but it
   destroys the comparison: to compare storage you have to remember the
   Starter value, scroll past 14 rows, then find it again on the Team card.
3. **A picker that shows one or two plans at a time.** Rejected. It hides
   information behind an extra interaction and adds more keyboard stops.
4. **Feature-first reflow with a sticky plan header (chosen).** The thing
   being compared is one feature across three plans, so that is the unit
   kept together. All three values stay visible and aligned in the same
   columns, so you compare by reading across, just as on desktop.

This works because every value is short (at most "Unlimited"). Columns use
`minmax(0, 1fr)` and cells use `overflow-wrap: anywhere`, so a longer value
would wrap inside its cell rather than push the page wider.

The breakpoint is in `em`, so it also triggers when someone enlarges the
text, not only on small screens. 320px is also what a 640px-wide desktop
window becomes at 200% zoom, so the same layout serves zoom users.

## Table structure for assistive technology

- A real `<table>` with a `<caption>`, `<th scope="col">` for plans,
  `<th scope="row">` for features, and one `<tbody>` per group with a
  `<th scope="rowgroup">` group header.
- On narrow screens the table elements get `display: block` / `grid` for the
  reflow. Some browsers (notably Safari) drop table semantics when that
  happens, so every element also has its explicit ARIA role (`table`,
  `rowgroup`, `row`, `columnheader`, `rowheader`, `cell`). The structure is
  exposed the same way at every width.
- Ticks and dashes are `aria-hidden`; each cell carries visually hidden text,
  "Included" or "Not included", so the meaning is spoken, not just drawn.
- The "Feature" column header and the caption are hidden with a
  visually-hidden utility, **not** `display: none`, so they are still
  announced. `display: none` is used only for the "Differs" labels when
  highlighting is off, because they are genuinely irrelevant then.

## How to verify

1. Load the page, press `Tab`: focus lands on the button with a clear outline.
   `Space` and `Enter` both toggle it. `Tab` again leaves the page.
2. Set the viewport to 320px wide in DevTools: there should be no horizontal
   scrollbar. Scroll and confirm the plan names stay pinned.
3. Zoom a desktop browser to 400%: the narrow layout should take over.
4. Use a screen reader (VoiceOver, NVDA) in table mode at both widths: moving
   between cells should announce the plan and feature headers.
5. Turn on highlighting with Windows High Contrast / forced colours: the
   "Differs" labels and the button state should still be visible.
