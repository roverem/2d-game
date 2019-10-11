export const V2 = {};

V2.create = (x = 0, y = 0) => {
    return {x: x, y: y};
};

V2.createFromArray = (array) => {
    return {x: array[0], y: array[1]};
}

V2.add = (a, b, out) => {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
};

V2.subtract = (a, b, out) => {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
};

V2.scale = (a, v, out) => {
    out.x = a.x * v;
    out.y = a.y * v;
};

V2.length = (a) => {
    return Math.sqrt(a.x * a.x + a.y * a.y);
};

V2.normalize = (a, out) => {
    let length = V2.length(a);

    if (length > 0) {
        out.x = a.x / length;
        out.y = a.y / length;
    } else {
        out.x = 0;
        out.y = 0;
    }
};

V2.clone = (a, out) => {
    out.x = a.x;
    out.y = a.y;
};

V2.eq = (a, b) => {
    return a.x == b.x && a.y == b.y;
};
