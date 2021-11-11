const socket = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

const server = http
    .createServer(((req, res) => {
        const indexPath = path.join(__dirname, 'index.html');
        const readStream = fs.createReadStream(indexPath);

        readStream.pipe(res);
    }));

const io = socket(server);
let usersList = [];
let delUsersList = [];

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

io.on('connection', client => {
    // console.log(client.id);
    // console.log('new connection');
    client.on('NewPlayer', name => {
        let user = {
            name: '',
            color: '',
            id: ''
        }
        let index = delUsersList.findIndex(function(user, index) {
            if (user.name === name) {
                return true;
            };
        })
        if (index > -1) {
            oldUser = delUsersList.splice(index, 1);
            usersList.push(oldUser[0]);
            console.log('\nС возвращением: '.green + oldUser[0].name);
        } else {
            user.name = name;
            user.color = getRandomColor();
            user.id = client.id;
            usersList.push(user);
            console.log('\nНовый подключенный клиент: '.green + name);
        }

        console.log(colors.yellow('Список онлайн клиентов'));
        usersList.forEach(userOne => {
            console.log(`${userOne.name}`);
        });

    });
    client.on('disconnect', name => {
        let index = usersList.findIndex(function(user, index) {
            if (user.id === client.id) {
                return true;
            }
        });
        delUser = usersList.splice(index, 1);
        delUsersList.push(delUser[0])
        console.log('\nКлиент отключен: '.red + delUser[0].name);
        console.log(colors.yellow('Список онлайн клиентов'));
        usersList.forEach(userOne => {
            console.log(`${userOne.name}`);
        });


    });
    client.on('client-msg', data => {
        const payload = {
            message: data.message,
        };

        client.broadcast.emit('server-msg', payload);
        client.emit('server-msg', payload);
    });
});

server.listen(5555);