//Lesson1,2

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
//
// const path = require('node:path');
// const pathToFile= __filename;
// console.log(path.dirname(pathToFile))
//
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
//
// lesson2
//
// Створення файлу, чтение и вывод в консоль
// const fs = require('node:fs/promises');
// async function fsProm() {
//     await fs.writeFile('test.txt', 'Hello World');
//     const data=await fs.readFile('test.txt', 'utf-8');
//     console.log(data);
// }
// void fsProm();
//
// добавление данных в файл
//
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
//
// создание директории
//
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
//
// переименование файла и перенос в созданную папку + копирование
//
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
//
// работа с большими файлами
//
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
//
// Event
//
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
//
// os
//
// const os=require('node:os');
// const {exec}=require('child_process');
// async function fsProm() {
//     console.log(os.arch());
// }
// void fsProm();

//lesson 3

// get
// const express = require("express");
// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.get('/users', (req, res) => {
//     res.send('Hello World 1');
// })
// app.post('/user', (req, res) => {
//     res.send('Hello World 2');
// })
// app.listen(3000,()=>{
//     console.log('listening on port 3000');
// });

//post

// const express = require("express");
// const app = express();
//
// app.use(express.json());
// let users = [
//     { id: 1, name: 'Ivan' }
// ];
//
// app.post('/users', (req, res) => {
//     const newName = req.body.name;
//
//     const newUser = {
//         id: users.length + 1,
//         name: newName
//     };
//     users.push(newUser);
//     res.status(201).json({
//         message: 'Пользователь успешно создан!',
//         user: newUser
//     });
//     // console.log(req.body);
//     // console.log(reg.query);
//     // console.log(reg.params);
// });
//
// app.get('/users', (req, res) => {
//     res.json(users);
// });
// app.listen(3000, () => {
//     console.log('Сервер запущен: http://localhost:3000');
// });

// Create, Read, Update, Delete

// const express = require("express");
//
// const app = express();
//
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
//
// const users = [
//     {id: 1, name: 'Maksym', email: 'feden@gmail.com', password: 'qwe123'},
//     {id: 2, name: 'Alina', email: 'alindosik@gmail.com', password: 'ert345'},
//     {id: 3, name: 'Anna', email: 'ann43@gmail.com', password: 'ghj393'},
//     {id: 4, name: 'Tamara', email: 'tomochka23@gmail.com', password: 'afs787'},
//     {id: 5, name: 'Dima', email: 'taper@gmail.com', password: 'rtt443'},
//     {id: 6, name: 'Rita', email: 'torpeda@gmail.com', password: 'vcx344'},
//     {id: 7, name: 'Denis', email: 'denchik@gmail.com', password: 'sdf555'},
//     {id: 8, name: 'Sergey', email: 'BigBoss@gmail.com', password: 'ccc322'},
//     {id: 9, name: 'Angela', email: 'lala@gmail.com', password: 'cdd343'},
//     {id: 10, name: 'Irina', email: 'irka7@gmail.com', password: 'kkk222'},
// ];
//
// app.get('/users', (req, res) => {
//     try {
//         res.send(users);
//     } catch (e) {
//         res.status(500).send(e.message);
//     }
// });
//
// app.post('/users', (req, res) => {
//     try {
//         const {name, email, password} = req.body;
//         const id = users[users.length - 1].id + 1;
//         const newUser = {id, name, email, password};
//         users.push(newUser);
//         res.status(201).send(newUser);
//     } catch (e) {
//         res.status(500).send(e.message);
//     }
// });
//
// app.get('/users/:userId', (req, res) => {
//     try {
//         const userId = Number(req.params.userId);
//         const user = users.find(user => user.id === userId);
//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e.message);
//     }
// });
//
// app.put('/users/:userId', (req, res) => {
//     try {
//         const userId = Number(req.params.userId);
//         const userIndex = users.findIndex(user => user.id === userId);
//         if (userIndex === -1) {
//             return res.status(404).send('User not found');
//         }
//         const {name, email, password} = req.body;
//         //TODO validate data
//         // users[userIndex] = {...users[userIndex], name, email, password};
//         users[userIndex].name = name;
//         users[userIndex].email = email;
//         users[userIndex].password = password;
//         res.status(201).send(users[userIndex]);
//     } catch (e) {
//         res.status(500).send(e.message);
//     }
// });
//
// app.delete('/users/:userId', (req, res) => {
//     try {
//         const userId = Number(req.params.userId);
//         const userIndex = users.findIndex(user => user.id === userId);
//         if (userIndex === -1) {
//             return res.status(404).send('User not found');
//         }
//         users.splice(userIndex, 1);
//         res.sendStatus(204);
//     } catch (e) {
//         res.status(500).send(e.message);
//     }
// });
// app.listen(3000,()=>{
//     console.log('listening on port 3000');
// });