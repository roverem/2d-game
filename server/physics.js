import {
    SIDE_TOP,
    SIDE_RIGHT,
    SIDE_BOTTOM,
    SIDE_LEFT
} from "./gameobject";

export function update_physics(dt, transform, rigidbody, collider) {
    if (rigidbody.isStatic) {
        return;
    }

    // New velocity
    rigidbody.velocity.x += rigidbody.acceleration.x * dt;
    rigidbody.velocity.y += rigidbody.acceleration.y * dt;

    // Air resistance
    rigidbody.velocity.x -= rigidbody.velocity.x * dt * 5;
    rigidbody.velocity.y -= rigidbody.velocity.y * dt * 5;

    // Last direction
    let vel_length = Math.sqrt(rigidbody.velocity.x * rigidbody.velocity.x + rigidbody.velocity.y * rigidbody.velocity.y);

    if (vel_length > 0) {
        rigidbody.last_direction.x = rigidbody.velocity.x / vel_length;
        rigidbody.last_direction.y = rigidbody.velocity.y / vel_length;
    }

    // New position
    transform.position.x += rigidbody.velocity.x * dt;
    transform.position.y += rigidbody.velocity.y * dt;

    // Resets
    collider.fixes[SIDE_TOP] = collider.fixes[SIDE_RIGHT] = collider.fixes[SIDE_BOTTOM] = collider.fixes[SIDE_LEFT] = 0;
    collider.gameObjects[SIDE_TOP] = collider.gameObjects[SIDE_RIGHT] = collider.gameObjects[SIDE_BOTTOM] = collider.gameObjects[SIDE_LEFT] = null;

    rigidbody.acceleration.x = 0;
    rigidbody.acceleration.y = 0;
}

export function check_overlap(dt, gameObject, otherGameObject) {
    if ((gameObject.collider.is_sensor || otherGameObject.collider.is_sensor) &&
        (gameObject.collider.category & otherGameObject.collider.mask) > 0 &&
        (otherGameObject.collider.category & gameObject.collider.mask) > 0) {

        let x = gameObject.transform.position.x;
        let y = gameObject.transform.position.y;

        let left = otherGameObject.transform.position.x - otherGameObject.collider.size.width / 2 - gameObject.collider.size.width / 2;
        let right = otherGameObject.transform.position.x + otherGameObject.collider.size.width / 2 + gameObject.collider.size.width / 2;
        let top = otherGameObject.transform.position.y - otherGameObject.collider.size.height / 2 - gameObject.collider.size.height / 2;
        let bottom = otherGameObject.transform.position.y + otherGameObject.collider.size.height / 2 + gameObject.collider.size.height / 2;

        if (x > left && x < right && y > top && y < bottom) {
            if (gameObject.collider.overlaps.indexOf(otherGameObject) < 0) {
                gameObject.collider.overlaps.push(otherGameObject);
            }
        }
    }
}

export function resolve_overlaps(dt, gameObject, onOverlap) {
    for (let i = 0; i < gameObject.collider.overlaps.length; i++) {
        onOverlap(gameObject, gameObject.collider.overlaps[i]);
    }

    gameObject.collider.overlaps.length = 0;
}

function get_x_axis_equation(x1, y1, x2, y2, y) {
    var m = (y1 - y2) / (x1 - x2),
        c = x1 - (y1 / m),
        x = (y / m) + c;

    return x;
}

function get_y_axis_equation(x1, y1, x2, y2, x) {
    var m = (y1 - y2) / (x1 - x2),
        b = y1 - (m * x1),
        y = (m * x) + b;

    return y;
}

export function check_collision(dt, gameObject, otherGameObject) {
    if (gameObject === otherGameObject ||
        gameObject.rigidbody.isStatic ||
        gameObject.collider.is_sensor ||
        otherGameObject.collider.is_sensor ||
        //(gameObject.collider.category & otherGameObject.collider.mask) === 0) {
        (otherGameObject.collider.category & gameObject.collider.mask) === 0) {
        return;
    }

    let position = gameObject.transform.position;
    let velocity = gameObject.rigidbody.velocity;
    let oldPosition = {
        x: position.x - velocity.x * dt,
        y: position.y - velocity.y * dt
    };
    let collider = gameObject.collider;

    let otherPosition = otherGameObject.transform.position;
    let otherCollider = otherGameObject.collider;

    // This is the Minkowski Addition
    let top = otherPosition.y - (collider.size.height + otherCollider.size.height) / 2;
    let right = otherPosition.x + (collider.size.width + otherCollider.size.width) / 2;
    let bottom = otherPosition.y + (collider.size.height + otherCollider.size.height) / 2;
    let left = otherPosition.x - (collider.size.width + otherCollider.size.width) / 2;

    if (position.y > top && position.x < right && position.y < bottom && position.x > left) {
        if ((collider.mask & otherCollider.category) !== 0) {
            let ix = position.x;
            let iy = position.y;

            if (position.y >= top && top >= oldPosition.y) {
                ix = get_x_axis_equation(oldPosition.x, oldPosition.y, position.x, position.y, top);
                if (left < ix && ix < right) {
                    iy = top;
                    collider.fixes[SIDE_BOTTOM] = top;
                    collider.gameObjects[SIDE_BOTTOM] = otherGameObject;
                }
            } else if (position.x <= right && right <= oldPosition.x) {
                iy = get_y_axis_equation(oldPosition.x, oldPosition.y, position.x, position.y, right);
                if (top < iy && iy < bottom) {
                    ix = right;
                    collider.fixes[SIDE_LEFT] = right;
                    collider.gameObjects[SIDE_LEFT] = otherGameObject;
                }
            } else if (position.y <= bottom && bottom <= oldPosition.y) {
                ix = get_x_axis_equation(oldPosition.x, oldPosition.y, position.x, position.y, bottom);
                if (left < ix && ix < right) {
                    iy = bottom;
                    collider.fixes[SIDE_TOP] = bottom;
                    collider.gameObjects[SIDE_TOP] = otherGameObject;
                }
            } else if (position.x >= left && left >= oldPosition.x) {
                iy = get_y_axis_equation(oldPosition.x, oldPosition.y, position.x, position.y, left);
                if (top < iy && iy < bottom) {
                    ix = left;
                    collider.fixes[SIDE_RIGHT] = left;
                    collider.gameObjects[SIDE_RIGHT] = otherGameObject;
                }
            }
        }
    }
}

export function resolve_collisions(dt, gameObject, onCollision) {
    if (gameObject.rigidbody.isStatic) {
        return;
    }

    let friction_multiplier = 40;
    let position = gameObject.transform.position;
    let velocity = gameObject.rigidbody.velocity;
    let collider = gameObject.collider;

    if (collider.fixes[SIDE_TOP] !== 0) {
        let otherCollider = collider.gameObjects[SIDE_TOP].collider;

        onCollision(gameObject, collider.gameObjects[SIDE_TOP], SIDE_TOP);

        if (velocity.y < 0) {
            velocity.y = -velocity.y * (collider.material.bounciness + otherCollider.material.bounciness);
            velocity.x -= velocity.x * Math.min(Math.max(collider.material.friction, otherCollider.material.friction), 1) * dt * friction_multiplier;
        }

        position.y = collider.gameObjects[SIDE_TOP].transform.position.y + otherCollider.size.height / 2 + collider.size.height / 2 + 0.1;
    }

    if (collider.fixes[SIDE_RIGHT] !== 0) {
        let otherCollider = collider.gameObjects[SIDE_RIGHT].collider;

        onCollision(gameObject, collider.gameObjects[SIDE_RIGHT], SIDE_RIGHT);

        if (velocity.x > 0) {
            velocity.x = -velocity.x * (collider.material.bounciness + otherCollider.material.bounciness);
            velocity.y -= velocity.y * Math.min(Math.max(collider.material.friction, otherCollider.material.friction), 1) * dt * friction_multiplier;
        }

        position.x = collider.gameObjects[SIDE_RIGHT].transform.position.x - otherCollider.size.width / 2 - collider.size.width / 2 - 0.1;
    }

    if (collider.fixes[SIDE_BOTTOM] !== 0) {
        let otherCollider = collider.gameObjects[SIDE_BOTTOM].collider;

        onCollision(gameObject, collider.gameObjects[SIDE_BOTTOM], SIDE_BOTTOM);

        if (velocity.y > 0) {
            velocity.y = -velocity.y * (collider.material.bounciness + otherCollider.material.bounciness);
            velocity.x -= velocity.x * Math.min(Math.max(collider.material.friction, otherCollider.material.friction), 1) * dt * friction_multiplier;
        }

        position.y = collider.gameObjects[SIDE_BOTTOM].transform.position.y - otherCollider.size.height / 2 - collider.size.height / 2 - 0.1;
    }

    if (collider.fixes[SIDE_LEFT] !== 0) {
        let otherCollider = collider.gameObjects[SIDE_LEFT].collider;

        onCollision(gameObject, collider.gameObjects[SIDE_LEFT], SIDE_LEFT);

        if (velocity.x < 0) {
            velocity.x = -velocity.x * (collider.material.bounciness + otherCollider.material.bounciness);
            velocity.y -= velocity.y * Math.min(Math.max(collider.material.friction, otherCollider.material.friction), 1) * dt * friction_multiplier;
        }

        position.x = collider.gameObjects[SIDE_LEFT].transform.position.x + otherCollider.size.width / 2 + collider.size.width / 2 + 0.1;
    }
}