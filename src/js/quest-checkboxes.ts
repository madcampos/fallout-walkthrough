export function registerQuestCheckboxes() {
	[...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].forEach((checkbox) => {
		if (localStorage.getItem(checkbox.id) === 'true') {
			checkbox.checked = true;
		}

		checkbox.addEventListener('change', (event) => {
			const element = event.target as HTMLInputElement;

			localStorage.setItem(element.id, element.checked.toString());
		});
	});
}
