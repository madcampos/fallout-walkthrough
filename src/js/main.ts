import { registerScrollToTopButton, registerTocMenuButton } from './buttons';
import { registerLinkActions } from './links';
import { registerQuestCheckboxes } from './quest-checkboxes';
import { registerTableSort } from './table-sort';
import { registerTocLinksActions } from './toc';

window.addEventListener('DOMContentLoaded', () => {
	registerLinkActions();
	registerTableSort();
	registerQuestCheckboxes();
	registerTocMenuButton();
	registerScrollToTopButton();
	registerTocLinksActions();
});
