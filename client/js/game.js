import {SOCKET, APP } from '../main.js';


export class Game{
    constructor(){
        console.log("Game Created");

        SOCKET.on( "update", this.update.bind(this) );

        //console.log(SOCKET);
        //console.log(APP);

        this.arena = new PIXI.Container();
        this.arena.x = APP.renderer.width / 2;
        this.arena.y = APP.renderer.height / 2;
        

        
        APP.stage.addChild(this.arena);

        this.t = new PIXI.Text("some text",{fontFamily: 'Arial', fontSize: 34, fill: 0xffffff, align: 'center'});
        this.t.anchor.set(0.5, 0.5)
        this.arena.addChild(this.t);


        SOCKET.on("world_initial_data", this._on_world_initial_data.bind(this) )
        SOCKET.emit( "player_ready" );
    }

    _on_world_initial_data(data){
        console.log("_on_world_initial_data");

        let square = new PIXI.Graphics()
            .beginFill(0x000000)
            .drawRect(0, 0, data.width, data.height)
            .endFill();
        this.arena.addChildAt( square, 0 );
        this.arena.pivot.x = data.width / 2;
        this.arena.pivot.y = data.height / 2;
    }

    update(data){
        this.t.x = data.x;
        this.t.y = data.y;
    }
}