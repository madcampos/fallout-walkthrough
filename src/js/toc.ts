export function registerTocLinksActions() {
	document.querySelectorAll<HTMLAnchorElement>('#toc a').forEach((link) => {
		link.addEventListener('click', (evt) => {
			evt.preventDefault();

			document.querySelector<HTMLDialogElement>('#toc')?.close();
		});
	});
}
