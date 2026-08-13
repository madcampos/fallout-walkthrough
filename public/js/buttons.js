export function registerScrollToTopButton() {
	document.querySelector('#top-button')?.addEventListener('click', () => {
		document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
	});
}
