import { Game } from "./js/game.js";
import { SETTINGS } from "../../users/settings.js";

console.log(SETTINGS);

const options = {
	"force new connection": true,
	"reconnectionAttempts": 0,
	"timeout": 10000,
	"transports": ["websocket"],
	"path": SETTINGS.path
};

export let SOCKET = io(SETTINGS.url, options);

let _w = window.innerWidth;
let _h = window.innerHeight;

export const APP = new PIXI.Application({ 
	view: game_canvas,
	width: _w,
	height: _h,
	resolution: window.devicePixelRatio,
	autoDensity: true,

	backgroundColor: 0x061639,
	antialias: true,    
	transparent: false
});

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

document.body.appendChild(APP.view);

PIXI.utils.sayHello(type);

window.addEventListener('resize', resize);

function resize(){
	_w = window.innerWidth;
	_h = window.innerHeight;

	APP.renderer.resize(_w, _h);
}


let game = new Game();