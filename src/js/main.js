import { registerScrollToTopButton } from './buttons.js';
import { registerQuestCheckboxes } from './quest-checkboxes.js';
import { registerTableSort } from './table-sort.js';

window.addEventListener('DOMContentLoaded', () => {
	registerTableSort();
	registerQuestCheckboxes();
	registerScrollToTopButton();
});
