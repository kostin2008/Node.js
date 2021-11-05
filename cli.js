#!/usr/local/bin/node

const http = require("http");
const { join } = require("path");
const fs = require('fs');

const isFile = (path) => fs.lstatSync(path).isFile();

(async() => {
    http.createServer((req, res) => {
        const filePath = join(process.cwd(), req.url.replace(/\[\.\.]/gi, '..'));
        if (!fs.existsSync(filePath)) {
            return res.end("Not found");
        }
        if (isFile(filePath)) {
            return fs.createReadStream(filePath, 'utf8').pipe(res);
        }
        const links = fs.readdirSync(filePath)
            .map(filename => [join(req.url, filename), filename])
            .map(([filepath, filename]) => `<li><a href="${filepath}">${filename}</a></li>`)
            .concat([
                `<li><a href="[..]/">..</a></li>`
            ])
            .join("");
        const html = fs
            .readFileSync(join(__dirname, "index.html"), "utf8")
            .replace(/#links/gi, links);
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(html);
    }).listen(5555);
})();