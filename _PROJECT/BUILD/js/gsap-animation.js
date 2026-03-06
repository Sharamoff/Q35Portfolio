gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.normalizeScroll(true);

const fps = 30;
const totalFrames = 450;

const video = document.getElementById("q35video");

video.pause();
video.currentTime = 0;

video.addEventListener("loadeddata",()=>{
	video.currentTime = 0.001;
});



const intro = gsap.from(".hero-title",{y:"120vh",duration:1.6,ease:"power3.out"});
intro.eventCallback("onComplete",initHeroScroll);



function initHeroScroll(){

	gsap.set(".hero-title",{y:0,opacity:1});
	gsap.set(".text-block",{opacity:0,y:300});

	const heroTL = gsap.timeline({
		scrollTrigger:{
			trigger:".hero-screen",
			start:"top top",
			end:"+=700%",
			scrub:true,
			pin:true,
			anticipatePin:1
		}
	});

	heroTL.to(".hero-title",{y:-300,opacity:0,ease:"none"});
	heroTL.to(".block--overview",{opacity:1,y:0,ease:"none"});
	heroTL.to(".block--challenge",{opacity:1,y:0,ease:"none"});
	heroTL.to(".block--solution",{opacity:1,y:0,ease:"none"});
	heroTL.to(".block--tools",{opacity:1,y:0,ease:"none"});
	heroTL.to({}, {duration:1});
	heroTL.to(".hero-text",{y:-300,opacity:0,ease:"none"});
	heroTL.to(".stage",{opacity:1,ease:"none"});

}



ScrollTrigger.create({
	trigger:".stage-screen",
	start:"top top",
	once:true,
	onEnter:()=>{
		document.querySelector(".stage").style.pointerEvents="auto";
		initVideoScroll();
	}
});



function initVideoScroll(){

	function start(){

		const frameProxy = {frame:0};

		ScrollTrigger.create({
			trigger:".stage-screen",
			start:"top top",
			end:"bottom bottom",
			scrub:true,
			onUpdate:(self)=>{

				const targetFrame = Math.floor(self.progress * (totalFrames-1));

				gsap.to(frameProxy,{
					frame:targetFrame,
					duration:0.08,
					ease:"power1.out",
					overwrite:true,
					onUpdate:()=>{
						video.currentTime = frameProxy.frame / fps;
					}
				});

			}
		});

	}

	if(video.readyState >= 1){
		start();
	}else{
		video.addEventListener("loadedmetadata",start);
	}

}