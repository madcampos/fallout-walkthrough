/**
 * @typedef {Map<HTMLHeadingElement, HeadingLevel>} HeadingLevel
 */

/**
 * @param {HTMLHeadingElement} heading
 * @param {string} prevHeadingId
 */
function setHeadingId(heading, prevHeadingId) {
	let headingId = heading.id;

	if (!headingId) {
		if (heading.textContent) {
			const textSlug = heading.textContent.trim().toLowerCase().replace(/\s+/gu, '-');
			headingId = `${prevHeadingId ? `${prevHeadingId}--` : ''}${textSlug}`;
		} else {
			headingId = `header-${Math.trunc(Math.random() * 1000000).toString(16)}`;
		}
	}

	heading.id = headingId;
}

/**
 * @param {HTMLHeadingElement} heading
 */
function addHeadingLink(heading) {
	heading.insertAdjacentHTML('beforeend', `<a class="header-link" href="#${heading.id}">🔗</a>`);
}

/**
 * @param {HTMLHeadingElement[]} headingList
 * @param {string} [prevHeadingId='']
 */
function buildHeadingLevels(headingList, prevHeadingId = '') {
	let nestedHeadingList = '';

	if (headingList.length > 0) {
		let curIndex = 0;

		do {
			const curHeading = /** @type {HTMLHeadingElement} */ (headingList[curIndex]);
			const headingLabel = curHeading.textContent ?? '';

			setHeadingId(curHeading, prevHeadingId);
			addHeadingLink(curHeading);

			// eslint-disable-next-line @typescript-eslint/no-loop-func
			const nextSameLevelIndex = headingList.findIndex((heading, index) => index > curIndex && heading.tagName === curHeading.tagName);

			// Last item
			if (nextSameLevelIndex === -1 && curHeading === headingList.at(-1)) {
				nestedHeadingList += `<li><a href="#${curHeading.id}">${headingLabel}</a></li>`;
				break;
			}

			// Iterate next item
			if (nextSameLevelIndex === curIndex + 1) {
				nestedHeadingList += `<li><a href="#${curHeading.id}">${headingLabel}</a></li>`;
				curIndex += 1;
			}

			// Iterate a portion of the array
			if (nextSameLevelIndex > curIndex + 1) {
				nestedHeadingList += `
					<li>
						<details open>
							<summary><a href="#${curHeading.id}">${headingLabel}</a></summary>
							<ol>
								${buildHeadingLevels(headingList.slice(curIndex + 1, nextSameLevelIndex), curHeading.id)}
							</ol>
						</details>
					</li>
				`;
				curIndex = nextSameLevelIndex;
			}

			// Iterate to the end of the array
			if (nextSameLevelIndex === -1) {
				nestedHeadingList += `
					<li>
						<details open>
							<summary><a href="#${curHeading.id}">${headingLabel}</a></summary>
							<ol>
								${buildHeadingLevels(headingList.slice(curIndex + 1), curHeading.id)}
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

export function buildTableOfContents() {
	const headings = /** @type {HTMLHeadingElement[]} */ ([...document.body.querySelectorAll('main :is(h2, h3, h4, h5, h6)')]);

	document.querySelector('#toc nav')?.insertAdjacentHTML('beforeend', `<ol>${buildHeadingLevels(headings)}</ol>`);
}

export function handleTableOfContents() {
	const tocDialog = /** @type {HTMLDialogElement} */ (document.querySelector('#toc'));

	tocDialog?.addEventListener('click', (evt) => {
		// eslint-disable-next-line @typescript-eslint/prefer-destructuring
		const target = /** @type {HTMLElement} */ (evt.target);

		if (target.matches('a')) {
			tocDialog.hidePopover();
		}
	}, { passive: true });
}
