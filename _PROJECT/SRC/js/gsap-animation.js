gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.normalizeScroll({type: "touch,wheel", allowNestedScroll: true, momentum: 0.8});
ScrollTrigger.config({ignoreMobileResize: true});

const fps = 30;
const totalFrames = 450;
const video = document.getElementById("q35video");
const isMobile = window.matchMedia("(pointer:coarse)").matches;

video.pause();
video.currentTime = 0;
video.preload = "auto";
video.muted = true;
video.playsInline = true;
video.disableRemotePlayback = true;
video.addEventListener("loadedmetadata", () => { video.currentTime = 0; });

gsap.set(".stage", {force3D: true, opacity: 0});

const intro = gsap.from(".hero-title", {y: "120vh", duration: 1.6, ease: "power3.out"});
intro.eventCallback("onComplete", initHeroScroll);

function initHeroScroll() {
	gsap.set(".hero-title", {y: 0, opacity: 1});
	gsap.set(".text-block", {opacity: 0, y: 300});
	const heroTL = gsap.timeline({
		scrollTrigger: {
			trigger: ".hero-screen",
			start: "top top",
			end: "+=700%",
			scrub: isMobile ? true : 0.6,
			pin: true,
			pinSpacing: true,
			anticipatePin: 1
		}
	});
	heroTL.to(".hero-title", {y: -300, opacity: 0, ease: "none"});
	heroTL.to(".block--overview", {opacity: 1, y: 0, ease: "none"});
	heroTL.to(".block--challenge", {opacity: 1, y: 0, ease: "none"});
	heroTL.to(".block--solution", {opacity: 1, y: 0, ease: "none"});
	heroTL.to(".block--tools", {opacity: 1, y: 0, ease: "none"});
	heroTL.to({}, {duration: 0.25});
	heroTL.to(".hero-text", {y: -100, opacity: 0, ease: "none"});
	heroTL.to(".stage", {opacity: 1, ease: "none"});
}

ScrollTrigger.create({
	trigger: ".stage-screen", start: "top+=1 top", onEnter: () => {
		document.querySelector(".stage").style.pointerEvents = "auto";
		initVideoScroll();
	}
});


function initVideoScroll() {

	function start() {
		let targetFrame = 0;
		let smoothFrame = 0;
		const damping = isMobile ? 0.16 : 0.12;
		let lastFrame = -1;

		function update() {
			smoothFrame += (targetFrame - smoothFrame) * damping;
			const frame = Math.round(smoothFrame);
			if (frame !== lastFrame) {
				video.currentTime = frame / fps;
				lastFrame = frame;
			}
			requestAnimationFrame(update);
		}
		update();

		ScrollTrigger.create({
			trigger: ".stage-screen", start: "top top", end: "bottom bottom", scrub: true, onUpdate: self => {
				let progress = self.progress;
				if (isMobile) {
					progress *= 1.2;
				}
				progress = Math.max(0, Math.min(1, progress));
				targetFrame = progress * (totalFrames - 1);
			}
		});

	}

	if (video.readyState >= 1) {
		start();
	} else {
		video.addEventListener("loadedmetadata", start);
	}

}