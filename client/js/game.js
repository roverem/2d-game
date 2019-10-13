import {SOCKET, APP } from '../main.js';


export class Game{
    constructor(){
        console.log("Game Created");

        SOCKET.on( "update", this.update.bind(this) );

        //console.log(SOCKET);
        //console.log(APP);

        this.arena = new PIXI.Container();
        this.arena.x = Math.ceil( APP.renderer.width / 2 );
        this.arena.y = Math.ceil( APP.renderer.height / 2 );
        
        this.arena.interactive = true;
        this.arena.buttonMode = true;

        this.arena.addListener('pointerdown', (event)=>{
            
            let click_pos = {};
            click_pos.x = event.data.global.x - this.arena.x + this.arena.pivot.x;
            click_pos.y = event.data.global.y - this.arena.y + this.arena.pivot.y;

            console.log("click on square", click_pos);

            SOCKET.emit("player_move", click_pos )
        });
        
        APP.stage.addChild(this.arena);

        this.t = new PIXI.Text("some text",{fontFamily: 'Arial', fontSize: 34, fill: 0xffffff, align: 'center'});
        this.t.anchor.set(0.5, 0.5);
        this.arena.addChild(this.t);


        SOCKET.on("world_initial_data", this._on_world_initial_data.bind(this) )
        SOCKET.emit( "player_ready" );
    }

    _on_world_initial_data(data){
        console.log("_on_world_initial_data");

        console.log(data);

        let square = new PIXI.Graphics()
            .beginFill(0x000000)
            .drawRect(0, 0, data.map_data.width, data.map_data.height)
            .endFill();
        this.arena.addChildAt( square, 0 );

        this.arena.pivot.x = data.map_data.width / 2;
        this.arena.pivot.y = data.map_data.height / 2;
    }

    update(data){
        /*this.t.x = data.x;
        this.t.y = data.y;*/

        console.log(data[0].x);

        this.t.x = data[0].x;
        this.t.y = data[0].y

        /*for (var sId in data.players){
            if (data.players[sId].position){
                this.t.x = data.players[sId].position.x;
                this.t.y = data.players[sId].position.y;
            }
        }*/
    }
}