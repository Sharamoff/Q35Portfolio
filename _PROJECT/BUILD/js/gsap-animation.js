gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);
ScrollTrigger.normalizeScroll({type:"touch,wheel",allowNestedScroll:true,momentum:0.8});
ScrollTrigger.config({ignoreMobileResize:true});

const fps=30;
const totalFrames=450;
const video=document.getElementById("q35video");
const mobileQuery=window.matchMedia("(max-width:576px)");
const isMobile=mobileQuery.matches;

video.pause();
video.currentTime=0;
video.preload="auto";
video.muted=true;
video.playsInline=true;

gsap.set(".stage",{opacity:0});
gsap.set(".text-block",{opacity:0,y:200});
gsap.set(".gallery-title",{x:800,opacity:0});
gsap.set(".gallery-renders",{y:100,opacity:0});
gsap.set(".gr__item",{opacity:0});

function preloadImages(selector){
	const images=document.querySelectorAll(selector);
	const promises=[];
	images.forEach(img=>{
		const src=img.getAttribute("src");
		const image=new Image();
		const p=new Promise(res=>{
			image.onload=res;
			image.onerror=res;
		});
		image.src=src;
		promises.push(p);
	});
	return Promise.all(promises);
}

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
	preloadImages(".gallery-renders img").then(()=>{
		initGalleryScene();
	});
}

function initGalleryScene(){
	const items=gsap.utils.toArray(".gr__item");
	const steps=items.length+2;

	const tl=gsap.timeline({
		scrollTrigger:{
			trigger:".gallery-screen",
			start:"top top",
			end:() => "+=" + items.length*120 + "%",
			scrub:1.2,
			pin:true,
			invalidateOnRefresh:true,
			snap:{
				snapTo:1/steps,
				duration:{min:0.2,max:0.4},
				ease:"power2.out"
			}
		}
	});

	tl.to(".gallery-title",{x:0,opacity:1});
	tl.to(".gallery-title",{y:-100,opacity:0},"+=0.5");
	tl.to(".gallery-renders",{opacity:1,y:0,duration:0.3}, "<");

	items.forEach((item,i)=>{
		const prev=items[i-1];
		const vw=window.innerWidth;
		const side=i%2===0?-1:1;
		const baseOffset=vw*0.22;
		const randomJitter=gsap.utils.random(-vw*0.08,vw*0.08);
		const startX=side*(baseOffset+randomJitter);
		const depthScaleIn=gsap.utils.random(0.95,0.98);
		const depthScaleOut=1;
		const zIn=10+i;
		const zOut=1;

		tl.fromTo(item,{
			y:140,
			x:startX,
			opacity:0,
			scale:depthScaleIn,
			zIndex:zIn
		},{
			y:0,
			x:0,
			opacity:1,
			scale:1,
			ease:"expo.out",
			duration:0.5
		});

		if(prev){
			tl.to(prev,{
				opacity:0,
				zIndex:zOut,
			},"<");
		}

		tl.to({}, {duration:0.5});
	});
}