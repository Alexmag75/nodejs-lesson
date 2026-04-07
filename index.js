//Lesson1

// const http = require('node:http');
//
// // Create a local server to receive data from
// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({
//         data: 'Hello World!',
//     }));
// });
//
// server.listen(8000);

// const path = require('node:path');
// const pathToFile= __filename;
// console.log(path.dirname(pathToFile))

// const readline = require('node:readline/promises');
//
// const rlInstance = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// async function startSurvey() {
//     try {
//         const name = await rlInstance.question('Как тебя зовут? ');
//         const age = await rlInstance.question('Сколько тебе лет? ');
//
//
//         console.log(`--- Результат ---`);
//         console.log(`Привет, ${name}! Ого, тебе уже ${age}.`);
//
//     } catch (error) {
//         console.error('Произошла ошибка:', error);
//     } finally {
//         rlInstance.close();
//     }
// }
// startSurvey();

//lesson2
