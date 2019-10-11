import { IO } from "./main";

export class World
{
    constructor(width, height){
        this.width = width;
        this.height = height;

        this.players = {};

    }

    addPlayer(player){


        this.players[player.id] = player;

        console.log("player added");
        console.log(this.players);
    }

    removePlayer(socketId){

        delete this.players[socketId];

        console.log("player removed");
        console.log(this.players);
    }

    update(dt){
        console.log("updating", dt);

        this.data = {
            x: Math.floor( Math.random() * this.width ),
            y: Math.floor( Math.random() * this.height )
        }
    }

    emit(){
        IO.emit("update", this.data);
    }
}