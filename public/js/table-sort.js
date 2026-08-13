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

export function registerTableSort() {
	document.addEventListener('click', (evt) => {
		// eslint-disable-next-line @typescript-eslint/prefer-destructuring
		const target = /** @type {HTMLElement}*/ (evt.target);

		if (!target.matches('th[aria-sort]')) {
			return;
		}

		evt.stopPropagation();

		const thCell = /** @type {HTMLTableCellElement}*/ (target);
		const table = thCell.closest('table');
		const tbody = table?.querySelector('tbody');
		const column = thCell.cellIndex;

		/** @type {'ascending' | 'descending'} */
		let order = 'ascending';

		if (thCell.ariaSort === 'descending') {
			order = 'ascending';
		} else {
			order = 'descending';
		}

		table?.querySelectorAll('th[aria-sort]').forEach((thEl) => {
			thEl.ariaSort = 'none';
		});

		thCell.ariaSort = order;

		[...tbody?.querySelectorAll('tr') ?? []]
			.sort((first, last) => compareRowsByColumn(first, last, column, order))
			.forEach((row) => tbody?.appendChild(row));
	});
}
