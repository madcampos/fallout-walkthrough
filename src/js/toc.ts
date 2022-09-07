export function registerTocLinksActions() {
	document.querySelectorAll<HTMLAnchorElement>('#toc a').forEach((link) => {
		link.addEventListener('click', (evt) => {
			evt.preventDefault();
			const target = document.querySelector(link.hash)?.closest('article');

			if (target) {
				target.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' });
				history.pushState({}, '', link.hash);
			}

			document.querySelector<HTMLDialogElement>('#toc')?.close();
		});
	});
}
