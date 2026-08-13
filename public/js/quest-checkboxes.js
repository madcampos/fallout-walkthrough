export function registerQuestCheckboxes() {
	[...(/**@type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('input[type="checkbox"]')))].forEach((checkbox) => {
		if (localStorage.getItem(checkbox.id) === 'true') {
			checkbox.checked = true;
		}

		checkbox.addEventListener('change', (event) => {
			const element = /** @type {HTMLInputElement} */ (event.target);

			localStorage.setItem(element.id, element.checked.toString());
		});
	});
}
