const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const ipAddresses = ['89.123.1.41', '34.48.240.111'];
global.pice = '';

ipAddresses.forEach((data) => {

    const rs = fs.createReadStream(path.join(__dirname, 'access.log'));

    const ts = new Transform({
        transform(chunk, encoding, callback) {
            const reg = new RegExp('[0-9]{1,3}[\.][0-9]{1,3}[\.][0-9]{1,3}[\.][0-9]{1,3}', 'g');
            let chunkArr = chunk.toString().split('\n');

            chunkArr[0] = global.pice + chunkArr[0];
            global.pice = chunkArr[chunkArr.length - 1];
            let stringOut = '';

            chunkArr.forEach(string => {
                const ip = string.match(reg);

                if (ip == data) {
                    stringOut += string + '\n';
                }

            });
            this.push(stringOut);
            callback();

        }
    });
    const ws = fs.createWriteStream(path.join(__dirname, data + '_requests.log'), 'utf8');

    rs.pipe(ts).pipe(ws);

    ws.on('close', () => {
        console.log('Запись завершена');
    });
});