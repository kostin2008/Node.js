const colors = require('colors');
const isNumber = require("isnumber");
const isPrime = require('is-prime-value');
const firstNumber = +process.argv[2] || 0;
const endNumber = +process.argv[3] || 100;

let prime = [];

if (!isNumber(firstNumber) || !isNumber(endNumber) || firstNumber > endNumber) {
    console.log(colors.red('Введите числовой диапазон от меньшего к большему'));
    return;
}

for (let i = firstNumber; i <= endNumber; i++) {
    if (isPrime(i)) {
        prime.push(i);
    }
}

if (prime.length == 0) {
    console.log(colors.red('В указанном диапазоне простых чисел нет'));
    return;
}

for (j = 0; j < prime.length; j += 3) {
    console.log(colors.green(prime[j]), colors.yellow(prime[j + 1] || ''), colors.red(prime[j + 2] || ''));
}