export function registerTocMenuButton() {
	document.querySelector('#toc-button')?.addEventListener('click', () => {
		document.querySelector<HTMLDialogElement>('#toc')?.showModal();
	});

	document.querySelector('#toc')?.addEventListener('click', (evt) => {
		const target = evt.target as HTMLDialogElement;

		if (target.matches('dialog')) {
			target.close();
		}
	});
}

export function registerScrollToTopButton() {
	document.querySelector('#top-button')?.addEventListener('click', () => {
		document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
	});
}
