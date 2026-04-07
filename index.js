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

// Створення файлу, чтение и вывод в консоль
// const fs = require('node:fs/promises');
// async function fsProm() {
//     await fs.writeFile('test.txt', 'Hello World');
//     const data=await fs.readFile('test.txt', 'utf-8');
//     console.log(data);
// }
// void fsProm();

// добавление данных в файл

// const path = require('node:path');
// const pathToFile=path.join(__dirname,'test.txt');
// const fs = require('node:fs/promises');
// async function fsProm() {
//     await fs.writeFile(pathToFile, 'Hello World ');
//     const data=await fs.readFile('test.txt', 'utf-8');
//     console.log(data);
//     await fs.appendFile(pathToFile,'Hello World 2');
//     await fs.mkdir(path.join(__dirname, 'new-folder', 'new2'),{recursive:true});
//     // await fs.rm(path.join(__dirname, 'new-folder', 'new2'),{recursive:true});
//     // await fs.rm(path.join(__dirname, 'new-folder'),{recursive:true});
// }
// void fsProm();

//создание директории

// const fs = require('node:fs/promises');
// const path = require('node:path');
// async function checkAndCreateDir() {
//     const dirPath = path.join(__dirname, 'new-folder');
//     try {
//         await fs.access(dirPath);
//         console.log('Папка уже существует, ничего делать не нужно.');
//     } catch {
//         console.log('Папки нет. Создаю...');
//         await fs.mkdir(dirPath);
//         console.log('Папка успешно создана!');
//     }
// }
// void checkAndCreateDir();

//переименование файла и перенос в созданную папку + копирование

// const path = require('node:path');
// const pathToFile=path.join(__dirname,'test.txt');
// const fs = require('node:fs/promises');
// async function fsProm() {
//     await fs.writeFile(pathToFile, 'Hello World ');
//     await fs.readFile('test.txt', 'utf-8');
//     await fs.mkdir(path.join(__dirname, 'new-folder'), { recursive: true });
//     //await fs.rename(pathToFile,path.join(__dirname,'new-folder','test2.txt'));
//     //await fs.copyFile(pathToFile,path.join(__dirname,'new-folder','test2.txt'));
//
//     const stat=await fs.stat(pathToFile);
//     console.log(stat.isFile());
// }
// void fsProm();

//работа с большими файлами

// const path = require('node:path');
// const pathToFile=path.join(__dirname,'8-inform-korshunova.pdf');
// const fs = require('node:fs');
// async function fsProm() {
//
//     const readStream=fs.createReadStream(pathToFile);
//     const writeStream=fs.createWriteStream(path.join(__dirname,'8-inform.pdf'));
//
//     readStream.on('data', (chunk) => {
//         console.log('chunk', chunk.length);
//         writeStream.write(chunk);
//
//     })
//        //readStream.pipe(writeStream);
// }
// void fsProm();

// Event

// const EventEmitter=require('node:events');
// const emitter = new EventEmitter();
//
// async function fsProm() {
//
//     // emitter.on('event', ()=>{
//     //     console.log('event happened');
//     // })
//
//     // emitter.once('event', ()=>{
//     //     console.log('event 1 happened');
//     // })
//     emitter.on('event', ()=>{
//         console.log('event 2 happened');
//     })
//     emitter.emit('event');
//
// }
// void fsProm();

//os

// const os=require('node:os');
// const {exec}=require('child_process');
// async function fsProm() {
//     console.log(os.arch());
// }
// void fsProm();

