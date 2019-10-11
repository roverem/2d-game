import {SOCKET, APP } from '../main.js';


export class Game{
    constructor(){
        console.log("Game Created");

        SOCKET.on( "update", this.update.bind(this) );

        //console.log(SOCKET);
        //console.log(APP);

        this.t = new PIXI.Text("some text",{fontFamily: 'Arial', fontSize: 34, fill: 0xffffff, align: 'center'});
        this.t.anchor.set(0.5);
        this.t.x = APP.renderer.width / 2;
        this.t.y = APP.renderer.height / 2;
        APP.stage.addChild(this.t);


        SOCKET.emit( "player_ready", {ready:true} );
    }

    update(data){
        this.t.x = data.x;
        this.t.y = data.y;
    }
}