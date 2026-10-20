(() => {
	'use strict';

	const gallery = document.querySelector('.gallery-splide');
	if (!gallery || typeof Splide === 'undefined') return;
	const desktopQuery = window.matchMedia('(min-width: 577px) and (min-height: 769px)');

	const main = new Splide('.gallery-splide__main', {
			type: 'loop',
			perPage: 1,
			perMove: 1,
			arrows: false,
			pagination: false,
			drag: true,
			autoplay: true,
			interval: 3000,
			pauseOnHover: true,
			pauseOnFocus: true,
			resetProgress: true,
			speed: 650,
	});

	const thumbs = new Splide('.gallery-splide__thumbs', {
			type: 'loop',
			fixedWidth: '100px',
			fixedHeight: '100px',
			gap: '10px',
			focus: 'center',
			perMove: 1,
			arrows: true,
			pagination: false,
			isNavigation: true,
			updateOnMove: true,
			drag: true,
			breakpoints: {
				1279: { perPage: 9 },
				1100: { perPage: 7, arrows: false },
			},
	});

	main.sync(thumbs);
	main.mount();
	thumbs.mount();

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) main.Components.Autoplay.pause();
		else main.Components.Autoplay.play();
	});

	let resizeFrame;
	window.addEventListener('resize', () => {
		cancelAnimationFrame(resizeFrame);
		resizeFrame = requestAnimationFrame(() => {
			main.refresh();
			if (desktopQuery.matches) {
				thumbs.refresh();
				thumbs.go(main.index);
			}
		});
	});
})();
