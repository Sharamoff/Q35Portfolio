gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

ScrollTrigger.normalizeScroll({type:"touch,wheel",allowNestedScroll:true,momentum:0.8});
ScrollTrigger.config({ignoreMobileResize:true});

const fps=30;
const totalFrames=450;
const video=document.getElementById("q35video");
const isMobile=window.matchMedia("(pointer:coarse)").matches;

video.pause();
video.currentTime=0;
video.preload="auto";
video.muted=true;
video.playsInline=true;

gsap.set(".stage",{opacity:0});
gsap.set(".text-block",{opacity:0,y:200});
gsap.set(".gallery-screen",{opacity:0});
gsap.set(".gallery-title",{x:800,opacity:0});
gsap.set(".gallery-renders",{y:100,opacity:0});
gsap.set(".gallery-comingsoon",{x:300,opacity:0});



/* HERO INTRO */
const intro=gsap.from(".hero-title",{y:"120vh",duration:1.5,ease:"power3.inOut"});
intro.eventCallback("onComplete",initHeroScene);


/* HERO */
function initHeroScene(){

	gsap.set(".hero-title",{clearProps:"transform"});

	const heroTL=gsap.timeline({
		scrollTrigger:{
			trigger:".hero-screen",
			start:"top top",
			end:"+=500%",
			scrub:isMobile?true:0.6,
			pin:true
		}
	});

	heroTL.to(".hero-title",{y:-300,opacity:0,ease:"none"});
	heroTL.to(".block--overview",{opacity:1,y:0});
	heroTL.to(".block--challenge",{opacity:1,y:0});
	heroTL.to(".block--solution",{opacity:1,y:0});
	heroTL.to(".block--tools",{opacity:1,y:0});
	heroTL.to({}, {duration:0.5});
	heroTL.to(".stage",{opacity:1});

	initStageScene();

}


/* STAGE */
function initStageScene(){

	let targetFrame=0;
	let smoothFrame=0;
	let lastFrame=-1;
	const damping=isMobile?0.16:0.12;

	function updateVideo(){
		smoothFrame+=(targetFrame-smoothFrame)*damping;
		const frame=Math.round(smoothFrame);
		if(frame!==lastFrame){
			video.currentTime=frame/fps;
			lastFrame=frame;
		}
		requestAnimationFrame(updateVideo);
	}
	updateVideo();

	const stageTL=gsap.timeline({
		scrollTrigger:{
			trigger:".stage-screen",
			start:"top top",
			end:"+=700%",
			scrub:true,
			pin:true
		}
	});

	stageTL.to({},{
		duration:5,
		onUpdate:function(){
			let p=this.progress();
			if(isMobile)p*=1.2;
			p=Math.max(0,Math.min(1,p));
			targetFrame=p*(totalFrames-1);
		}
	});

	stageTL.to({}, {duration:0.5});

	stageTL.to(".gallery-screen",{opacity:1});

	initGalleryScene();

}


/* GALLERY */
function initGalleryScene(){

	const galleryTL=gsap.timeline({
		scrollTrigger:{
			trigger:".gallery-screen",
			start:"top top",
			end:"+=300%",
			scrub:isMobile?true:0.6,
			pin:true
		}
	});

	galleryTL.to(".gallery-title",{x:0,opacity:1});
	galleryTL.to(".gallery-comingsoon",{x:0,opacity:1});

	/*
	galleryTL.to(".gallery-title",{y:-100,opacity:0},"+=0.5");
	galleryTL.to(".gallery-renders",{y:0,opacity:1});
	*/
}