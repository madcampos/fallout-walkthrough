import './toc.js';
import './table-sort.js';
import './note.js';

window.addEventListener('DOMContentLoaded', () => {
	// oxlint-disable-next-line typescript/no-unnecessary-type-assertion
	[...(/**@type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('input[type="checkbox"]')))].forEach((checkbox) => {
		if (localStorage.getItem(checkbox.id) === 'true') {
			checkbox.checked = true;
		}

		checkbox.addEventListener('change', (event) => {
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion
			const element = /** @type {HTMLInputElement} */ (event.target);

			localStorage.setItem(element.id, element.checked.toString());
		});
	});
});
