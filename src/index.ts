import express, { Request, Response } from "express";
import { IUser } from "./interfaces/user.interface";
import {handleError} from "./errors/errors";
import {read, write} from "./fs.service";

const app = express();
app.use(express.json());

app.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await read();
        res.send(users);
    } catch (e) {
        handleError(res, e, "Ошибка чтения базы данных");
    }
});

app.post('/users', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const users = await read();

        if (!name || name.length <= 3) {
            return res.status(400).send("Имя должно быть длиннее 3 символов");
        }
        const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        const newUser: IUser = { id, name, email, password };

        users.push(newUser);
        await write(users);

        res.status(201).send(newUser);
    } catch (e) {
        handleError(res, e, "Ошибка при создании пользователя");
    }
});

app.get('/users/:userId', async (req: Request, res: Response) => {
    try {
        const users = await read();
        const user = users.find(u => u.id === Number(req.params.userId));

        if (!user) return res.status(404).send("Пользователь не найден");

        res.send(user);
    } catch (e) {
        handleError(res, e, "Ошибка при поиске пользователя");
    }
});

app.put('/users/:userId', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const users = await read();
        const index = users.findIndex(u => u.id === Number(req.params.userId));

        if (index === -1) return res.status(404).send("Пользователь не найден");

        if (name && name.length <= 3) return res.status(400).send("Новое имя слишком короткое");

        users[index] = {
            ...users[index],
            name: name || users[index].name,
            email: email || users[index].email,
            password: password || users[index].password
        };

        await write(users);
        res.send(users[index]);
    } catch (e) {
        handleError(res, e, "Ошибка при обновлении пользователя");
    }
});

app.delete('/users/:userId', async (req: Request, res: Response) => {
    try {
        let users = await read();
        const userId = Number(req.params.userId);

        const exists = users.some(u => u.id === userId);
        if (!exists) return res.status(404).send("Некого удалять, юзер не найден");

        users = users.filter(u => u.id !== userId);
        await write(users);

        res.sendStatus(204);
    } catch (e) {
        handleError(res, e, "Ошибка при удалении пользователя");
    }
});

app.listen(3000, () => console.log('Server OK on port 3000'));