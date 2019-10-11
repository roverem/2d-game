import {SOCKET, APP } from '../main.js';


export class Game{
    constructor(){
        console.log("Game Created");

        //console.log(SOCKET);
        //console.log(APP);

        let t = new PIXI.Text("some text",{fontFamily: 'Arial', fontSize: 34, fill: 0xffffff, align: 'center'});
        t.anchor.set(0.5);
        t.x = APP.renderer.width / 2;
        t.y = APP.renderer.height / 2;
        APP.stage.addChild(t);


        SOCKET.emit( "player_ready", {ready:true} );
    }
}