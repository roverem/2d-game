export class Player
{
    constructor(socket){
        this.socket = socket;

        this.id = socket.id;

        this.position = {x:0, y:0}
    }
}