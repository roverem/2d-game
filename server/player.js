export class Player
{
    constructor(socket){
        this.socket = socket;

        this.id = socket.id;
    }
}