const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true, caseFirst: 'upper' });

/**
 * @param {HTMLTableRowElement} rowA
 * @param {HTMLTableRowElement} rowB
 * @param {number} column
 * @param {'ascending' | 'descending'} [order='ascending']
 */
function compareRowsByColumn(rowA, rowB, column, order = 'ascending') {
	const columnA = rowA.children[column]?.textContent ?? '';
	const columnB = rowB.children[column]?.textContent ?? '';

	if (order === 'ascending') {
		return collator.compare(columnA, columnB);
	}

	return collator.compare(columnB, columnA);
}

/**
 * @param {MouseEvent} event
 */
function sortByColumn(event) {
	event.stopPropagation();

	const thCell = /** @type {HTMLTableCellElement}*/ (event.target);
	const table = thCell.closest('table');
	const tbody = table?.querySelector('tbody');
	const column = thCell.cellIndex;

	/** @type {'ascending' | 'descending'} */
	let order = 'ascending';

	if (thCell.dataset['order'] === 'descending') {
		order = 'ascending';
	} else {
		order = 'descending';
	}

	table?.querySelectorAll('th').forEach((thEl) => {
		delete thEl.dataset['order'];
	});

	thCell.dataset['order'] = order;

	[...tbody?.querySelectorAll('tr') ?? []].sort((first, last) => compareRowsByColumn(first, last, column, order)).forEach((row) => tbody?.appendChild(row));
}

export function registerTableSort() {
	[...document.querySelectorAll('table')].forEach((table) => {
		[...(/**@type {NodeListOf<HTMLTableCellElement>} */ (table.querySelectorAll('thead th:not([data-no-order])')))].forEach((thEl) => {
			thEl.addEventListener('click', sortByColumn, true);
		});
	});
}
