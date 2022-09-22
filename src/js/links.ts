export function registerLinkActions() {
	document.addEventListener('click', (evt) => {
		const target = evt.target as HTMLAnchorElement;

		if (target.matches('a')) {
			const href = target.getAttribute('href');

			if (href?.startsWith('#')) {
				evt.preventDefault();

				const linkTarget = document.querySelector(href);

				if (linkTarget?.closest('details')) {
					linkTarget.closest('details')?.setAttribute('open', '');
				}

				linkTarget?.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' });
				history.pushState({}, '', target.hash);
			}
		}
	});
}
