const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const app = express();
const dbPath = path.join(__dirname, 'users.json');

app.use(express.json());

async function readDB() {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
}

async function writeDB(data) {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

app.get('/users', async (req, res) => {
    try {
        const users = await readDB();
        res.send(users);
    } catch (e) {
        res.status(500).send("Ошибка чтения базы данных");
    }
});


app.post('/users', async (req, res) => {
    try {
        const { name, email, password} = req.body;
        const users = await readDB();

        if (!name || name.length <= 3) {
            return res.status(400).send("Имя должно быть длиннее 3 символов");
        }

        const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        const newUser = { id, name, email, password};

        users.push(newUser);
        await writeDB(users);

        res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


app.get('/users/:userId', async (req, res) => {
    try {
        const users = await readDB();
        const user = users.find(u => u.id === Number(req.params.userId));

        if (!user) return res.status(404).send("Пользователь не найден");

        res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


app.put('/users/:userId', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const users = await readDB();
        const index = users.findIndex(u => u.id === Number(req.params.userId));

        if (index === -1) return res.status(404).send("Пользователь не найден");

        if (name && name.length <= 3) return res.status(400).send("Новое имя слишком короткое");



        users[index] = {
            ...users[index],
            name: name || users[index].name,
            email: email || users[index].email,
            password: password || users[index].password
        };

        await writeDB(users);
        res.send(users[index]);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


app.delete('/users/:userId', async (req, res) => {
    try {
        let users = await readDB();
        const userId = Number(req.params.userId);

        const exists = users.some(u => u.id === userId);
        if (!exists) return res.status(404).send("Некого удалять, юзер не найден");

        users = users.filter(u => u.id !== userId);
        await writeDB(users);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(3000, () => console.log('Server OK on port 3000'));