import { optimizeValue } from "./utils/misc";
import { V2 } from "./utils/vector2d";

export const COLLIDER_NONE                  = 0b00000000;
export const COLLIDER_PLAYER                = 0b00000001;
export const COLLIDER_WALL                  = 0b00000010;
export const COLLIDER_INTERACTIVE_OBJECT    = 0b00000100;
export const COLLIDER_DEFAULT               = 0b11111111;

export const SIDE_TOP = 0;
export const SIDE_RIGHT = 1;
export const SIDE_BOTTOM = 2;
export const SIDE_LEFT = 3;


export const OBJECT_TYPE_BASE = 0;
export const OBJECT_TYPE_COLLECTABLE = 1;
export const OBJECT_TYPE_INSTANT_COLLECTABLE = 2;
export const OBJECT_TYPE_NPC = 3;

export class GameObject {
    constructor(x = 0, y = 0, w = 0, h = 0) {

        this.sendable = false;

        this.id = "";
        this.stats = {};

        this.transform = {
            position: V2.create(x, y)
        };

        this.rigidbody = {
            velocity: V2.create(),
            new_direction: V2.create(),
            last_direction: V2.create(),
            acceleration: V2.create(),
            isStatic: false
        };

        this.collider = {
            size: {
                width: w,
                height: h
            },
            is_sensor: false,
            material: {
                bounciness: 0.5,
                friction: 0,
                mass: 1
            },
            category: COLLIDER_NONE,
            mask: COLLIDER_NONE,
            fixes: new Array(),
            gameObjects: new Array(),
            overlaps: new Array()
        };

        this.killed = false;
        this.destroy = false;

        this.object_type = OBJECT_TYPE_BASE;
    }

    update(dt) {
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
        return obj;
    }

    get_stats(obj = {}) {
        obj.id = this.id;
        return obj;
    }
}