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
}