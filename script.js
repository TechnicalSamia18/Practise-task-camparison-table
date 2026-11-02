// Adds the "Highlight differences" control to the plan comparison.
// The page works without this script: the table is complete and readable,
// and the control simply doesn't appear.
(function () {
  'use strict';

  const table = document.getElementById('comparison');
  const controls = document.getElementById('controls');
  const toggle = document.getElementById('diff-toggle');
  const status = document.getElementById('diff-status');
  if (!table || !controls || !toggle || !status) return;

  // Feature rows have a header plus three data cells; group rows have one cell.
  const featureRows = Array.from(table.tBodies)
    .flatMap((tbody) => Array.from(tbody.rows))
    .filter((row) => row.cells.length > 1);

  const valueOf = (cell) => cell.textContent.replace(/\s+/g, ' ').trim();

  // Work out which features differ from the data itself,
  // so the highlight can never disagree with the table.
  let differing = 0;
  featureRows.forEach((row) => {
    const values = Array.from(row.querySelectorAll('td'), valueOf);
    const differs = new Set(values).size > 1;
    row.classList.add(differs ? 'differs' : 'same');

    if (differs) {
      differing += 1;
      // A text label, so the highlight is not conveyed by colour alone.
      // It sits inside the row header, so screen readers hear
      // "Storage, Differs" as they move through the cells.
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.innerHTML = '<span class="visually-hidden">, </span>Differs';
      row.querySelector('th').append(badge);
    }
  });

  function setHighlight(on) {
    toggle.setAttribute('aria-pressed', String(on));
    table.classList.toggle('is-highlighting', on);
    status.textContent = on
      ? `Highlighting ${differing} of ${featureRows.length} features that differ between plans. ` +
        'Features that are the same on every plan are shown in grey.'
      : 'Highlighting off. All features are shown the same way.';
  }

  // A native <button>: Tab reaches it, Enter and Space activate it,
  // and aria-pressed announces it as a toggle with its state.
  toggle.addEventListener('click', () => {
    setHighlight(toggle.getAttribute('aria-pressed') !== 'true');
  });

  controls.hidden = false;
})();