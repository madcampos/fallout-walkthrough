import { registerScrollToTopButton, registerTocMenuButton } from './buttons';
import { registerQuestCheckboxes } from './quest-checkboxes';
import { registerTableSort } from './table-sort';
import { registerTocLinksActions } from './toc';

window.addEventListener('DOMContentLoaded', () => {
	registerTableSort();
	registerQuestCheckboxes();
	registerTocMenuButton();
	registerScrollToTopButton();
	registerTocLinksActions();
});
