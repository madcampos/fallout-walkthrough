export class TableWrapper extends HTMLElement {
	#collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true, caseFirst: 'upper' });

	constructor() {
		super();

		this.querySelectorAll('th[aria-sort]').forEach((thCell) => {
			const span = document.createElement('span');
			const id = crypto.randomUUID();

			span.innerHTML = /* html */ `
				<label for="sort-button-${id}" id="sort-button-${id}-label"></label>
				<button type="button" id="sort-button-${id}">
					<span style="pointer-events: none;">
						<sr-only>Sort table by</sr-only>
						<sr-only aria-labelledby="sort-button-${id}-label"></sr-only>
						<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" data-icon><use href="#table-sort-icon-none" width="24" height="24" /></svg>
					</span>
				</button>
			`;

			span.querySelector('label')?.append(...thCell.childNodes);
			thCell.appendChild(span);
		});
	}

	#appendSvgDefs() {
		if (document.querySelector('svg-defs#table-sort-icons')) {
			return;
		}

		document.body.insertAdjacentHTML(
			'beforeend',
			/* html */ `
				<svg-defs aria-hidden="true" id="table-sort-icons">
					<svg aria-hidden="true" role="none" width="1" height="1">
						<symbol width="1em" height="1em" viewBox="0 0 24 24" id="table-sort-icon-none" data-icon="pixelarticons:text-align-left">
							<path fill="currentColor" d="M2 5h20v2H2zm0 6h12v2H2zm0 6h16v2H2z" />
						</symbol>
						<symbol width="1em" height="1em" viewBox="0 0 24 24" id="table-sort-icon-descending" data-icon="pixelarticons:arrow-up-narrow-wide">
							<g fill="currentColor">
								<path d="M6 21h2V3H6z" />
								<path d="M4 7h6V5H4zM2 9h10V7H2zm8 2h6v2h-6zm0 4h9v2h-9zm0 4h12v2H10z" />
							</g>
						</symbol>
						<symbol width="1em" height="1em" viewBox="0 0 24 24" id="table-sort-icon-ascending" data-icon="pixelarticons:arrow-down-wide-narrow">
							<g fill="currentColor">
								<path d="M6 3h2v18H6z" />
								<path d="M4 17h6v2H4zm-2-2h10v2H2zm8-2h6v-2h-6zm0-4h9V7h-9zm0-4h12V3H10z" />
							</g>
						</symbol>
					</svg>
				</svg-defs>
			`
		);
	}

	/**
	 * @param {Event} evt
	 */
	handleEvent(evt) {
		if (!(evt instanceof PointerEvent)) {
			return;
		}

		if (!(evt.target instanceof HTMLButtonElement) || !evt.target.matches('th[aria-sort] button')) {
			return;
		}

		evt.stopPropagation();

		const thCell = evt.target.closest('th');
		if (!thCell) {
			return;
		}

		const table = thCell.closest('table');
		const tableBody = table?.querySelector('tbody');
		const column = thCell.cellIndex;

		/** @type {'ascending' | 'descending' | 'none'} */
		let order = 'none';

		if (thCell.ariaSort === 'descending') {
			order = 'ascending';
		} else {
			order = 'descending';
		}

		table?.querySelectorAll('th[aria-sort]').forEach((header) => {
			header.querySelector('use')?.setAttribute('href', '#table-sort-icon-none');
			header.ariaSort = 'none';
		});

		evt.target.querySelector('use')?.setAttribute('href', `#table-sort-icon-${order}`);
		thCell.ariaSort = order;

		[...tableBody?.querySelectorAll('tr') ?? []]
			.sort((rowA, rowB) => {
				const columnA = rowA.children[column]?.textContent ?? '';
				const columnB = rowB.children[column]?.textContent ?? '';

				if (order === 'ascending') {
					return this.#collator.compare(columnA, columnB);
				}

				return this.#collator.compare(columnB, columnA);
			})
			.forEach((row) => tableBody?.appendChild(row));
	}

	connectedCallback() {
		this.addEventListener('click', this, { capture: true });
		this.#appendSvgDefs();
	}

	disconnectedCallback() {
		this.addEventListener('click', this);
	}
}

if (!customElements.get('table-wrapper')) {
	customElements.define('table-wrapper', TableWrapper);
}
