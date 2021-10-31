#!/usr/local/bin/node

const fs = require('fs').promises;
const { lstatSync } = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const yargs = require('yargs');

const options = yargs
    .positional('d', {
        describe: 'path to dir',
        default: process.cwd()
    })
    .positional('p', {
        describe: 'pattern',
        default: ''
    }).argv;

let currentDir = options.d;

const isFile = async(path) => (await fs.lstat(path)).isFile();

class ListItem {
    constructor(path, filename) {
        this.path = path;
        this.filename = filename;
    }
    get isDir() {
        return lstatSync(this.path).isDirectory();
    }
}
const run = async() => {
    const list = await fs.readdir(currentDir);
    const items = list.map(filename => new ListItem(path.join(currentDir, filename), filename));

    const item = await inquirer
        .prompt([{
            name: 'fileName',
            type: 'list',
            message: `Choose file: ${currentDir}`,
            choices: items.map(item => ({ name: item.filename, value: item })),
        }])
        .then(answer => answer.fileName);

    if (item.isDir) {
        currentDir = item.path;
        return await run()
    } else {
        const data = await fs.readFile(item.path, 'utf-8');
        if (options.p === null) {
            console.log(data);
        } else {
            const lines = data.split('\n');
            lines.forEach(line => {
                const regex = new RegExp(options.p);
                if (regex.test(line)) {
                    console.log(line);
                }
            });
        }
        return;
    }
}

run();