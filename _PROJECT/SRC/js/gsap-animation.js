gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);
ScrollTrigger.normalizeScroll({type:"touch,wheel",allowNestedScroll:true,momentum:0.8});
ScrollTrigger.config({ignoreMobileResize:true});

const fps=30;
const totalFrames=450;
const video=document.getElementById("q35video");
const mobileQuery=window.matchMedia("(max-width: 576px), (max-height: 576px)");
const isMobile=mobileQuery.matches;

video.pause();
video.currentTime=0;
video.preload="auto";
video.muted=true;
video.playsInline=true;

gsap.set(".stage",{opacity:0});
gsap.set(".text-block",{opacity:0,y:200});
gsap.set(".gallery-title",{top:"50%",x:0,xPercent:100,yPercent:-50,opacity:0});
gsap.set(".gallery-splide",{y:160,opacity:0});

const intro=gsap.from(".hero-title",{y:"120vh",duration:1.5,ease:"power3.inOut"});
intro.eventCallback("onComplete",initHeroScene);

function initHeroScene(){
	gsap.set(".hero-title",{clearProps:"transform"});
	const heroTL=gsap.timeline({
		scrollTrigger:{
			trigger:".hero-screen",
			start:"top top",
			end:"+=500%",
			scrub:isMobile?true:0.6,
			pin:true,
			invalidateOnRefresh:true
		}
	});
	heroTL.to(".hero-title",{y:-300,opacity:0,ease:"none"});
	heroTL.to(".block--overview",{opacity:1,y:0});
	heroTL.to(".block--challenge",{opacity:1,y:0});
	heroTL.to(".block--solution",{opacity:1,y:0});
	heroTL.to(".block--tools",{opacity:1,y:0});
	heroTL.to({}, {duration:0.25});
	heroTL.to(".stage",{opacity:1});
	initStageScene();
}

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
			end:"+=600%",
			scrub:true,
			pin:true,
			invalidateOnRefresh:true
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
	stageTL.to({}, {duration:0.2});
	stageTL.to(".stage",{opacity:0,duration:0.4}, "<");
	initGalleryScene();
}

function initGalleryScene(){
	const createGalleryTimeline=(titleTop,scrub)=>{
		gsap.set(".gallery-title",{top:"50%",x:0,xPercent:100,yPercent:0,opacity:0});
		gsap.set(".gallery-splide",{y:160,opacity:0});

		const galleryTL=gsap.timeline({
			scrollTrigger:{
				trigger:".gallery-screen",
				start:"top top",
				end:"+=180%",
				scrub,
				pin:true,
				invalidateOnRefresh:true
			}
		});

		galleryTL.to(".gallery-title",{x:0,xPercent:-50,opacity:1,duration:0.45,ease:"power2.out"});
		galleryTL.to(".gallery-title",{top:titleTop,yPercent:40,duration:0.35,ease:"power2.inOut"});
		galleryTL.to(".gallery-splide",{y:0,opacity:1,duration:0.55,ease:"power3.out"});

		return () => galleryTL.kill();
	};

	ScrollTrigger.matchMedia({
		"(max-width: 576px), (max-height: 576px)":()=>createGalleryTimeline("40px",true),
		"(min-width: 577px) and (min-height: 577px)":()=>createGalleryTimeline("100px",0.7)
	});
}
