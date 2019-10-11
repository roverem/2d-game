import { optimizeValue } from "./utils/misc";
import { GameObject } from "./gameobject";

export class Player extends GameObject {
    constructor(socket, x = 0, y = 0) {
        super(x, y, 64, 64);

        this.socket = socket;
        this.sendable = true;
    }

    update(dt) {
        super.update(dt);
    }

    get_literal(obj = {}) {
        obj.t = Date.now() / 1000;
        obj.x = optimizeValue(this.transform.position.x, 1);
        obj.y = optimizeValue(this.transform.position.y, 1);
        obj.w = optimizeValue(this.collider.size.width, 1);
        obj.h = optimizeValue(this.collider.size.height, 1);
        obj.vx = optimizeValue(this.rigidbody.velocity.x, 1);
        obj.vy = optimizeValue(this.rigidbody.velocity.y, 1);
        obj.id = this.id;
        obj.name = this.username;
        obj.purified_username = this.purified_username;
        return obj;
    }
}