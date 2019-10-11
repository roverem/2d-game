import {readFile} from 'fs';

export default function load_files(files, folder, filenames, onload) {
    let c = 0;

    if (!files[folder]) {
        files[folder] = {};
    }

    for (let i = 0; i < filenames.length; i++) {
        readFile(folder + "/" + filenames[i], {
            encoding: 'utf-8'
        }, function (err, data) {
            if (!err) {
                c ++;

                let name = filenames[i].split(".")[0];
                let extension = filenames[i].split(".")[filenames[i].split(".").length - 1];

                if (extension === "json") {
                    files[folder][name] = JSON.parse(data);
                } else {
                    files[folder][name] = data;
                }

                if (c === filenames.length) {
                    onload();
                }
            }
        });
    }
}


