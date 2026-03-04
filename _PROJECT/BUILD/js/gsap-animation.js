gsap.registerPlugin(ScrollTrigger);

const canvas=document.getElementById("glcanvas");
const loader=document.getElementById("loader");
const loaderProgress=document.getElementById("loaderProgress");
const canvasWrapper=document.querySelector(".canvas-wrapper");

const gl=canvas.getContext("webgl",{antialias:true,alpha:false,powerPreference:"high-performance"});

const totalFrames=450;
const initialLoadFrames=60;
const frameBuffer=30;

let currentFrame=1;

const textures=new Array(totalFrames+1);
const loaded=new Array(totalFrames+1).fill(false);



const intro=gsap.from(".hero-title",{y:"120vh",duration:1.6,ease:"power3.out"});
intro.eventCallback("onComplete",initHeroScroll);



function initHeroScroll(){
	gsap.set(".hero-title",{y:0,opacity:1});
	gsap.set(".text-block",{opacity:0,y:120});
	const heroTL=gsap.timeline({
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
	heroTL.to(".overview",{opacity:1,y:0,ease:"none"});
	heroTL.to(".challenge",{opacity:1,y:0,ease:"none"});
	heroTL.to(".solution",{opacity:1,y:0,ease:"none"});
	heroTL.to({}, {duration:1});
	heroTL.to(".hero-text",{y:-300,opacity:0,ease:"none"});
	heroTL.to(".stage",{opacity:1,ease:"none"});
}



ScrollTrigger.create({
	trigger:".stage-section",
	start:"top top",
	once:true,
	onEnter:()=>{
		document.querySelector(".stage").style.pointerEvents="auto";
		startExperience();
	}
});



function resizeCanvas(){
	const rect=canvas.getBoundingClientRect();
	const dpr=window.devicePixelRatio||1;
	canvas.width=Math.round(rect.width*dpr);
	canvas.height=Math.round(rect.height*dpr);
	gl.viewport(0,0,canvas.width,canvas.height);
	render();
}

window.addEventListener("resize",resizeCanvas);



const vertexShaderSource=`
attribute vec2 position;
varying vec2 uv;
void main(){
uv=position*0.5+0.5;
gl_Position=vec4(position,0,1);
}
`;

const fragmentShaderSource=`
precision mediump float;
uniform sampler2D tex;
varying vec2 uv;
void main(){
gl_FragColor=texture2D(tex,uv);
}
`;



function createShader(type,source){
	const shader=gl.createShader(type);
	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	return shader;
}



const program=gl.createProgram();
gl.attachShader(program,createShader(gl.VERTEX_SHADER,vertexShaderSource));
gl.attachShader(program,createShader(gl.FRAGMENT_SHADER,fragmentShaderSource));
gl.linkProgram(program);
gl.useProgram(program);



const vertices=new Float32Array([-1,-1,1,-1,-1,1,1,1]);

const buffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);



const position=gl.getAttribLocation(program,"position");
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);



function loadTexture(index){
	return new Promise(resolve=>{
		const img=new Image();
		img.src=`animation/${String(index).padStart(4,"0")}.webp`;
		img.onload=()=>{
			const tex=gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D,tex);
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
			gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
			textures[index]=tex;
			loaded[index]=true;
			resolve();
		};
	});
}



function ensureFrames(targetFrame){
	const start=Math.max(1,targetFrame-frameBuffer);
	const end=Math.min(totalFrames,targetFrame+frameBuffer);
	for(let i=start;i<=end;i++){
		if(!loaded[i]) loadTexture(i);
	}
}



async function preloadInitialFrames(){
	let loadedCount=0;
	for(let i=1;i<=initialLoadFrames;i++){
		await loadTexture(i);
		loadedCount++;
		const progress=loadedCount/initialLoadFrames;
		loaderProgress.style.strokeDashoffset=283*(1-progress);
	}
}



function startExperience(){
	resizeCanvas();
	currentFrame=1;
	render();
	gsap.to(loader,{opacity:0,duration:0.6,onComplete:()=>loader.style.display="none"});
	gsap.to(canvasWrapper,{opacity:1,duration:0.8,delay:0.2});
	gsap.to(".scroll-indicator",{opacity:0.33,delay:0.5});
	initScroll();
}



function render(){
	const tex=textures[currentFrame];
	if(!tex) return;
	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.bindTexture(gl.TEXTURE_2D,tex);
	gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}



function initScroll(){
	ScrollTrigger.create({
		trigger:".stage-section",
		start:"top top",
		end:"bottom bottom",
		scrub:true,
		onUpdate:(self)=>{
			const progress=self.progress;
			const frame=Math.floor(progress*(totalFrames-1))+1;
			if(frame!==currentFrame){
				currentFrame=frame;
				ensureFrames(frame);
				render();
			}
		}
	});
}



window.addEventListener("load",()=>{
	preloadInitialFrames();
});