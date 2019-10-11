import { COLLIDER_PLAYER, COLLIDER_WALL, GameObject } from "./gameobject";
import { Player } from "./player";

let object_counter = 0;

export function create_wall(x, y, w, h) {
    let gobj = new GameObject(x, y, w, h);
    gobj.id = "wall" + (object_counter++);

    gobj.rigidbody.isStatic = true;

    gobj.collider.material.bounciness = 0.0;
    gobj.collider.category = COLLIDER_WALL;
    gobj.collider.mask = COLLIDER_PLAYER;

    return gobj;
}

export function create_player(name, id, sp) {
    let gobj = new Player(sp.x, sp.y);
    gobj.username = name;
    gobj.id = id;

    gobj.collider.material.bounciness = 0.0;
    gobj.collider.category = COLLIDER_PLAYER;
    gobj.collider.mask = COLLIDER_WALL;

    return gobj;
}