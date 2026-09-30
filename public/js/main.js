import './toc.js';
import './table-sort.js';

import { registerScrollToTopButton } from './buttons.js';
import { registerQuestCheckboxes } from './quest-checkboxes.js';

window.addEventListener('DOMContentLoaded', () => {
	registerQuestCheckboxes();
	registerScrollToTopButton();
});
