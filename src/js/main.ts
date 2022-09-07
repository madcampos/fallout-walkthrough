export type Placeholder = unknown;

const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true, caseFirst: 'upper' });

function compareRowsByColumn(rowA: HTMLTableRowElement, rowB: HTMLTableRowElement, column: number, order: 'ascending' | 'descending' = 'ascending') {
	const columnA = rowA.children[column].textContent ?? '';
	const columnB = rowB.children[column].textContent ?? '';

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

	if (thCell.dataset.order === 'descending') {
		order = 'ascending';
	} else {
		order = 'descending';
	}

	table.querySelectorAll('th').forEach((thEl) => {
		delete thEl.dataset.order;
	});

	thCell.dataset.order = order;

	[...tbody.querySelectorAll('tr')].sort((first, last) => compareRowsByColumn(first, last, column, order)).forEach((row) => tbody.appendChild(row));
}

window.addEventListener('DOMContentLoaded', () => {
	[...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].forEach((checkbox) => {
		if (localStorage.getItem(checkbox.id) === 'true') {
			checkbox.checked = true;
		}

		checkbox.addEventListener('change', (event) => {
			const element = event.target as HTMLInputElement;

			localStorage.setItem(element.id, element.checked.toString());
		});
	});

	[...document.querySelectorAll('#items table')].forEach((table) => {
		[...table.querySelectorAll<HTMLTableCellElement>('thead th')].forEach((thEl) => {
			thEl.addEventListener('click', sortByColumn, true);
		});
	});
});
