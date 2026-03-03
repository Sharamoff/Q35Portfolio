gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("glcanvas");
const loader = document.getElementById("loader");
const loaderProgress = document.getElementById("loaderProgress");
const canvasWrapper = document.querySelector(".canvas-wrapper");

const gl = canvas.getContext("webgl", {
	antialias: true,
	alpha: false,
	powerPreference: "high-performance"
});


// ---------------- CONFIG ----------------
const totalFrames = 450;
const initialLoadFrames = 450;
const pixelsPerFrame = 30;


// ---------------- STATE ----------------
let currentFrame = 1;


// ---------------- STORAGE ----------------
const textures = new Array(totalFrames + 1);
const loaded = new Array(totalFrames + 1).fill(false);


// ---------------- RESIZE (RETINA SAFE) ----------------
function resizeCanvas() {
	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	canvas.width = Math.round(rect.width * dpr);
	canvas.height = Math.round(rect.height * dpr);
	gl.viewport(0, 0, canvas.width, canvas.height);
	render();
}
window.addEventListener("resize", resizeCanvas);


// ---------------- SHADERS ----------------
const vertexShaderSource = `
attribute vec2 position;
varying vec2 uv;
void main(){
    uv = position * 0.5 + 0.5;
    gl_Position = vec4(position,0,1);
}
`;
const fragmentShaderSource = `
precision mediump float;
uniform sampler2D tex;
varying vec2 uv;
void main(){
    gl_FragColor = texture2D(tex,uv);
}
`;

function createShader(type, source){
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	return shader;
}

const program = gl.createProgram();
gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexShaderSource));
gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentShaderSource));
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
	-1,-1, 1,-1,
	-1, 1, 1, 1
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const position = gl.getAttribLocation(program,"position");
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


// ---------------- TEXTURE LOADER ----------------
function loadTexture(index){
	return new Promise(resolve => {
		const img = new Image();
		img.src = `animation/${String(index).padStart(4,"0")}.webp`;
		img.onload = ()=>{
			const tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				img
			);
			textures[index] = tex;
			loaded[index] = true;
			resolve();
		};
	});
}


// ---------------- INITIAL LOADER ----------------
async function preloadInitialFrames(){
	let loadedCount = 0;
	for(let i=1;i<=initialLoadFrames;i++){
		await loadTexture(i);
		loadedCount++;
		const progress = loadedCount / initialLoadFrames;
		loaderProgress.style.strokeDashoffset = 283 * (1 - progress);
	}
	startExperience();
}


// ---------------- START EXPERIENCE ----------------
function startExperience(){
	resizeCanvas();
	currentFrame = 1;
	render();
	gsap.to(loader, {
		opacity: 0,
		duration: 0.6,
		ease: "power2.out",
		onComplete: () => {
			loader.style.display = "none";
		}
	});
	gsap.to(canvasWrapper, {
		opacity: 1,
		duration: 0.8,
		ease: "power2.out",
		delay: 0.2
	});
	gsap.to(".scroll-indicator", {
		opacity: 0.33,
		delay: 0.5
	});
	initScroll();
}


// ---------------- RENDER ----------------
function render(){
	const tex = textures[currentFrame];
	if(!tex) return;
	gl.clearColor(0,0,0,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}


// ---------------- PIXEL PERFECT SCROLL ----------------
function initScroll(){
	ScrollTrigger.create({
		trigger: ".scroll-container",
		start: "top top",
		end: "bottom bottom",
		scrub: false,
		onUpdate: () => {
			const frame = Math.floor(window.scrollY / pixelsPerFrame) + 1;
			const clamped = Math.max(
				1,
				Math.min(totalFrames, frame)
			);
			if(clamped !== currentFrame){
				currentFrame = clamped;
				render();
			}
		}
	});
}

preloadInitialFrames();