export class TableOfContents extends HTMLElement {
	static observedAttributes = ['root', 'toc-title'];

	/** @const */
	#id = crypto.randomUUID();

	/**
	 * @param {string | null} newValue
	 */
	set rootSelector(newValue) {
		if (!newValue) {
			this.removeAttribute('root');
			return;
		}

		this.setAttribute('root', newValue);
	}

	/** @returns {string} */
	get rootSelector() {
		return this.getAttribute('root') ?? 'main';
	}

	/**
	 * @param {string | null} newValue
	 */
	set tocTitle(newValue) {
		if (!newValue) {
			this.removeAttribute('toc-title');
			return;
		}

		this.setAttribute('toc-title', newValue);
	}

	/** @returns {string} */
	get tocTitle() {
		return this.getAttribute('toc-title') ?? 'Table of Contents';
	}

	/**
	 * @param {string} text
	 */
	#escapeHtml(text) {
		const template = document.createElement('template');

		template.innerHTML = text;

		[...template.content.querySelectorAll(':not(b, i, em, strong, code, s, u)')].forEach((element) => {
			if (element.matches('a:not(.header-link)')) {
				element.insertAdjacentHTML('afterend', element.innerHTML);
			}

			element.remove();
		});

		return template.innerHTML.trim();
	}

	/**
	 * @param {HTMLHeadingElement} heading
	 * @param {string} prevHeadingId
	 */
	#setHeadingId(heading, prevHeadingId) {
		if (heading.id) {
			return;
		}

		if (heading.innerText) {
			const textSlug = heading.innerText
				.toLowerCase()
				.trim()
				.replace(/[^\p{L}\p{N}\s_-]/gu, '')
				.replace(/\s+/gu, '-')
				.replace(/-+/gu, '-')
				.replace(/^-+|-+$/gu, '');
			heading.id = `${prevHeadingId ? `${prevHeadingId}--` : ''}${textSlug}`;
		} else {
			heading.id = `header-${Math.trunc(Math.random() * 1000000).toString(16)}`;
		}
	}

	/**
	 * @param {HTMLHeadingElement} heading
	 */
	#addHeadingLink(heading) {
		if (heading.querySelector('a')) {
			return;
		}

		heading.insertAdjacentHTML(
			'beforeend',
			/* html */ `
				<a class="header-link" href="#${heading.id}">
					<sr-only>(Link to here)</sr-only>
					<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" data-icon>
						<use href="#toc-icon-link" width="24" height="24" />
					</svg>
				</a>
			`
		);
	}

	/**
	 * @param {HTMLHeadingElement[]} headingList
	 * @param {string} [prevHeadingId]
	 */
	#buildHeadingLists(headingList, prevHeadingId = '') {
		let nestedHeadingList = '';

		if (headingList.length > 0) {
			let curIndex = 0;

			do {
				const curHeading = headingList[curIndex];

				if (!curHeading) {
					continue;
				}

				const headingLabel = this.#escapeHtml(curHeading.innerHTML);

				this.#setHeadingId(curHeading, prevHeadingId);
				this.#addHeadingLink(curHeading);

				// oxlint-disable-next-line no-loop-func
				const nextSameLevelIndex = headingList.findIndex((heading, index) => index > curIndex && heading.tagName === curHeading.tagName);

				// Last item
				if (nextSameLevelIndex === -1 && curHeading === headingList.at(-1)) {
					nestedHeadingList += /* html */ `<li><a href="#${curHeading.id}">${headingLabel}</a></li>`;
					break;
				}

				// Iterate next item
				if (nextSameLevelIndex === curIndex + 1) {
					nestedHeadingList += /* html */ `<li><a href="#${curHeading.id}">${headingLabel}</a></li>`;
					curIndex += 1;
				}

				// Iterate a portion of the array
				if (nextSameLevelIndex > curIndex + 1) {
					nestedHeadingList += /* html */ `
					<li>
						<details open>
							<summary><a href="#${curHeading.id}">${headingLabel}</a></summary>
							<ol>
								${this.#buildHeadingLists(headingList.slice(curIndex + 1, nextSameLevelIndex), curHeading.id)}
							</ol>
						</details>
					</li>
				`;
					curIndex = nextSameLevelIndex;
				}

				// Iterate to the end of the array
				if (nextSameLevelIndex === -1) {
					nestedHeadingList += /* html */ `
					<li>
						<details open>
							<summary><a href="#${curHeading.id}">${headingLabel}</a></summary>
							<ol>
								${this.#buildHeadingLists(headingList.slice(curIndex + 1), curHeading.id)}
							</ol>
						</details>
					</li>
				`;
					curIndex = headingList.length;
				}
			} while (curIndex < headingList.length);
		}

		return nestedHeadingList;
	}

	#renderTocList() {
		const root = document.querySelector(this.rootSelector);

		if (!root) {
			return '';
		}

		// oxlint-disable-next-line typescript/no-unnecessary-type-assertion
		const headings = [...(/** @type {NodeListOf<HTMLHeadingElement>} */ (root.querySelectorAll(':is(h2, h3, h4, h5, h6):not([data-ignore-toc])')))];
		const filteredHeadings = headings.filter((heading) => !heading.closest('table-of-contents') && !heading.closest('[data-ignore-toc]'));

		if (filteredHeadings.length === 0) {
			return /* html */ `<p>No headings found.</p>`;
		}

		return /* html */ `
			<ol>
				${this.#buildHeadingLists(filteredHeadings)}
			</ol>
		`;
	}

	#render() {
		const tocList = this.#renderTocList();

		this.innerHTML = /* html */ `
			<button
				type="button"
				popoveraction="open"
				popovertarget="toc-dialog-${this.#id}"
			>
				<sr-only>Open ${this.tocTitle}</sr-only>
				<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" data-icon>
					<use href="#toc-icon-open" width="24" height="24" />
				</svg>
			</button>

			<dialog
				id="toc-dialog-${this.#id}"
				popover
			>
				<header>
					<h2>${this.tocTitle}</h2>
					<button
						type="button"
						popoveraction="close"
						popovertarget="toc-dialog-${this.#id}"
					>
						<sr-only>Close ${this.tocTitle}</sr-only>
						<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" data-icon>
							<use href="#toc-icon-close" width="24" height="24" />
						</svg>
					</button>
				</header>
				<dialog-content>
					${tocList}
				</dialog-content>
			</dialog>
		`;
	}

	#appendSvgDefs() {
		if (document.querySelector('svg-defs#toc-icons')) {
			return;
		}

		document.body.insertAdjacentHTML(
			'beforeend',
			/* html */ `
				<svg-defs aria-hidden="true" id="toc-icons">
					<svg aria-hidden="true" role="none" width="1" height="1">
						<symbol width="1em" height="1em" viewBox="0 0 24 24" id="toc-icon-close" data-icon="pixelarticons:close">
							<path fill="currentColor" d="M7 19H5v-2h2zm12 0h-2v-2h2zM9 15v2H7v-2zm8 2h-2v-2h2zm-6-2H9v-2h2zm4 0h-2v-2h2zm-2-2h-2v-2h2zm-2-2H9V9h2zm4 0h-2V9h2zM9 9H7V7h2zm8 0h-2V7h2zM7 7H5V5h2zm12 0h-2V5h2z" />
						</symbol>
						<symbol width="1em" height="1em" viewBox="0 0 24 24" id="toc-icon-open" data-icon="pixelarticons:bulletlist">
							<path fill="currentColor" d="M10 5h12v2H10zm0 4h8v2h-8zm0 4h12v2H10zm0 4h8v2h-8zm-4-6H4V9h2zM4 9H2V7h2zm4 0H6V7h2zM6 7H4V5h2zm-2 6h2v2H4zm0 4h2v2H4zm-2 0v-2h2v2zm4 0v-2h2v2z" />
						</symbol>
					</svg>
				</svg-defs>
			`
		);
	}

	connectedCallback() {
		this.#appendSvgDefs();

		this.#render();

		const dialog = this.querySelector('dialog');
		dialog?.addEventListener('click', (evt) => {
			if (!(evt.target instanceof HTMLAnchorElement)) {
				return;
			}

			dialog.hidePopover();
		}, { passive: true });
	}

	/**
	 * @param {string} name
	 * @param {string | null} oldValue
	 * @param {string | null} newValue
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'root':
				this.rootSelector = newValue;
				break;
			case 'toc-title':
				this.tocTitle = newValue;
				break;
			default:
		}
	}
}

if (!customElements.get('table-of-contents')) {
	customElements.define('table-of-contents', TableOfContents);
}
