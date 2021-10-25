const EventEmitter = require('events');
const emitter = new EventEmitter();

const timeFirst = process.argv[2];
const reg = new RegExp('[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}$');

function diffSubtract(date1, date2) {
    return date2 - date1;
}

class Timer {

    static getDelta(payload) {
        let now = new Date();
        let date = new Date(payload);
        let ms_left = diffSubtract(now, date);
        if (ms_left <= 0) {
            clearInterval(timerStart);
            console.log("Время закончилось");
        } else {
            let res = new Date(ms_left);
            console.log('До завершения осталось: ', `${res.getUTCFullYear() - 1970} years ${res.getUTCMonth()} months ${res.getUTCDate() - 1} days ${res.getUTCHours()} hours ${res.getUTCMinutes()} minutes ${res.getUTCSeconds()} seconds`);
        }
    }
}

if (reg.test(timeFirst)) {
    let dateFirst = timeFirst.split('-');
    let timerFirst = new Date(dateFirst[0], (dateFirst[1] - 1), dateFirst[2], dateFirst[3], dateFirst[4]);
    timerStart = setInterval(() => {
        emitter.emit('getDelta', timerFirst);
    }, 1000);
} else {
    console.log('Введите дату и время в формате: 2022-10-25-21-11');
}

emitter.on('getDelta', Timer.getDelta);