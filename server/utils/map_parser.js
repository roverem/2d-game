import { DOMParser } from "xmldom";
import { COLLECTABLES } from "../main";

export default function parse_map(raw_xml) {
    let props = [];

    let parser = new DOMParser();
    let data = parser.parseFromString(raw_xml, "text/xml");
    let elements = data.getElementsByTagName("g");

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let label = element.getAttribute("inkscape:label");
        let images;

        switch (label) {
            case "collisions":
            case "spawn_points":
                let rects = element.getElementsByTagName("rect");

                if (rects) {
                    for (let j = 0; j < rects.length; j++) {
                        let id = rects[j].getAttribute("id");
                        let transform = to_matrix(rects[j].getAttribute("transform"));

                        props.push({
                            container: label,
                            id: id,
                            a: transform.a,
                            b: transform.b,
                            c: transform.c,
                            d: transform.d,
                            tx: transform.tx,
                            ty: transform.ty
                        });
                    }
                }
                break;

            case "floor":
            case "objects":
                images = element.getElementsByTagName("image");

                if (images) {
                    for (let j = 0; j < images.length; j++) {
                        let id = images[j].getAttribute("id");
                        let href = images[j].getAttribute("xlink:href");
                        let href_arr = href.split("/");
                        let image_name = href_arr[href_arr.length - 1];
                        let transform = to_matrix(images[j].getAttribute("transform"));

                        props.push({
                            container: label,
                            id: id,
                            asset: image_name,
                            a: transform.a,
                            b: transform.b,
                            c: transform.c,
                            d: transform.d,
                            tx: transform.tx,
                            ty: transform.ty,
                            w: parseInt(images[j].getAttribute("width")), 
                            h: parseInt(images[j].getAttribute("height"))
                        });
                    }
                }
                break;
            case "interactive_objects":
                images = element.getElementsByTagName("image");

                if (images) {
                    for (let j = 0; j < images.length; j++) {
                        let id = images[j].getAttribute("id");
                        let href = images[j].getAttribute("xlink:href");
                        let href_arr = href.split("/");
                        let image_name = href_arr[href_arr.length - 1];
                        let transform = to_matrix(images[j].getAttribute("transform"));
                        let item_name = image_name.split(".")[0];

                        props.push({
                            container: label,
                            id: id,
                            asset: image_name,
                            a: transform.a,
                            b: transform.b,
                            c: transform.c,
                            d: transform.d,
                            tx: transform.tx,
                            ty: transform.ty,
                            w: parseInt(images[j].getAttribute("width")), 
                            h: parseInt(images[j].getAttribute("height")),
                            asset_view: COLLECTABLES[item_name]["asset_view"],
                            type: COLLECTABLES[item_name]["type"],
                            banner: COLLECTABLES[item_name]["banner"]
                        });
                    }
                }
                break;

            default:
                break;
        }
    }

    let svg = data.getElementsByTagName("svg");    
    let map = {
        backgroundcolor: data.getElementsByTagName("sodipodi:namedview")[0].getAttribute("pagecolor").split("#").join("0x"),
        size: {
            w: parseInt(svg[0].getAttribute("width")),
            h: parseInt(svg[0].getAttribute("height"))
        },
        props: props
    };

    return map;
}

function to_matrix(string) {
    let transform = {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        tx: 0,
        ty: 0
    };

    if (string.indexOf("scale") > -1) {
        let scale = string.split("scale(").join("").split(")").join("").split(",").map(Number);
        transform.a = scale[0];
        transform.d = scale[1];
    } else if(string.indexOf("translate") > -1) {
        let translate = string.split("translate(").join("").split(")").join("").split(",").map(Number);
        transform.tx = translate[0];
        transform.ty = translate[1];
    } else if (string.indexOf("matrix") > -1) {
        let matrix = string.split("matrix(").join("").split(")").join("").split(",").map(Number);
        transform.a = matrix[0];
        transform.b = matrix[1];
        transform.c = matrix[2];
        transform.d = matrix[3];
        transform.tx = matrix[4];
        transform.ty = matrix[5];
    }

    return transform;
}