const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true, caseFirst: 'upper' });

function compareRowsByColumn(rowA: HTMLTableRowElement, rowB: HTMLTableRowElement, column: number, order: 'ascending' | 'descending' = 'ascending') {
	const columnA = rowA.children[column]?.textContent ?? '';
	const columnB = rowB.children[column]?.textContent ?? '';

	if (order === 'ascending') {
		return collator.compare(columnA, columnB);
	}

	return collator.compare(columnB, columnA);
}

function sortByColumn(event: MouseEvent) {
	event.stopPropagation();

	const thCell = event.target as HTMLTableCellElement;
	const table = thCell.closest('table') as HTMLTableElement;
	const tbody = table.querySelector('tbody') as HTMLTableSectionElement;
	const column = thCell.cellIndex;

	let order: 'ascending' | 'descending' = 'ascending';

	if (thCell.dataset['order'] === 'descending') {
		order = 'ascending';
	} else {
		order = 'descending';
	}

	table.querySelectorAll('th').forEach((thEl) => {
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete thEl.dataset['order'];
	});

	thCell.dataset['order'] = order;

	[...tbody.querySelectorAll('tr')].sort((first, last) => compareRowsByColumn(first, last, column, order)).forEach((row) => tbody.appendChild(row));
}

export function registerTableSort() {
	[...document.querySelectorAll('table')].forEach((table) => {
		[...table.querySelectorAll<HTMLTableCellElement>('thead th:not([data-no-order])')].forEach((thEl) => {
			thEl.addEventListener('click', sortByColumn, true);
		});
	});
}
