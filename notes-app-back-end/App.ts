require("dotenv").config();
import express, { Request, Response} from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import notesDataBase from './DataBase/NotesDataBase';
import verificationMiddleware from './Midlewares/verificationMiddleware';

import type { INote, INoteCreatedRequest, INoteDelete } from './types/note';
import type { IUser, IUserRequest } from './types/user';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const accessTokenSecret: string = String(process.env.ACCESS_TOKEN_SECRET || '');

app.post('/registerUser', async (req: Request, res: Response) => {
    const { username, password }: IUserRequest = req.body;

    if (username === undefined || password === undefined) {
        res.status(400).json({
            error: "Los campos username y password son requeridos para completar esta operación."
        })
        return;
    }

    if (username.length < 5) {
        res.status(400).json({
            error: "Su nombre de usuario debe tener una logitud mayor de 5 caracteres."
        })
        return
    }

    if (String(password).length < 8) {
        res.status(400).json({
            error: "Su nombre de contraseña debe tener una logitud mayor de 8 caracteres."
        })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const registrationQuery = `INSERT INTO USERS (username, password) VALUES ('${username}', '${hashedPassword}')`

    notesDataBase.run(registrationQuery, function (err) {
        if (err) {
            res.status(500).json({ error: `Ha ocurrido un error al registrar el user: '${err.message}'` });
            return
        }
        res.status(201).json({
            newUser: {
                id: this.lastID,
                username: username,
                password: password,
            }
        })
        return
    })
});


app.post('/login', async (req: Request, res: Response) => {

    const { username, password }: IUserRequest = req.body;

    if (username === undefined || password === undefined) {
        res.status(400).json({
            error: "Los campos username y password son requeridos para completar esta operación."
        });
        return
    }

    const userQuery = `SELECT * FROM USERS WHERE username = '${username}';`

    notesDataBase.all(userQuery, async function (err, rows: IUser[]) {

        if (err) {
            res.status(500).json({ error: `Ha ocurrido un error al buscar el user: '${err.message}'` });
            return;
        }

        if (rows.length === 1) {

            let user: IUser = rows[0]          
            const isCorrectPassWord = await bcrypt.compare(password, user.password)

            if (!isCorrectPassWord) {
                res.status(404).json({
                    error: "Contraseña erronea"
                });
                return;
            }

            const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '300s'})
            
            res.status(200).json({
                id: user.id,
                accessToken: accessToken
            });
            return;

        } else {
            res.status(404).json({
                error: `El usuario '${username}' no ha sido encontrado en la base de datos.`
            });
            return;
        }
    })

})

app.post('/insertNote', verificationMiddleware, (req: Request, res: Response) => {
    const { title, body } = req.body;

    if (title === undefined || body === undefined) {
        res.send(400).json({
            error: "Los campos 'title' y 'body' son obligatorios."
        })
        return;
    }

    const inserNoteQuery = `INSERT INTO NOTES (title, body, userid) VALUES ('${title}', '${body}', ${req.body.user.id})`

    notesDataBase.run(inserNoteQuery, function (err) {
        if (err) {
            res.status(500).json({ error: `Ha ocurrido un error al agregar la nota: '${err.message}'` });
            return
        }
        res.status(201).json({
            newNote: {
                id: this.lastID,
                title: title,
                body: body,
                userid: req.body.user.password
            }
        })
        return
    })
})


app.put('/editNote', verificationMiddleware, (req: Request, res: Response) => {

    const { id, title, body, userid}: INoteCreatedRequest = req.body;

    if (id === undefined) {
        res.status(400).json(
            {
                error: "Debe proveer un id para poder completar esta operación."
            }
        )
        return;
    }

    if (req.body.user.id !== userid) {
        res.status(400).json(
            {
                error: `El user id de la nota y el id del user no se corresponden.`
            }
        )
        return;
    }

    if (title === undefined && body === undefined) {
        res.status(400).json({
            error: "Por favor envie campos para editar."
        })
        return;
    }

    const updateQuery = `UPDATE NOTES SET title = '${title}', body = '${body}' WHERE id = ${id}`

    notesDataBase.run(updateQuery, function (err) {

        if (err) {
            res.status(500).json({ error: `Ha ocurrido un error al editar la nota: '${err.message}'` });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: `No hemos podido encontrar una nota con el id = ${id}` });
            return;
        }

        res.json({
            updatedNote: { id: id, title, body }
        });
    });

})

app.delete('/deleteNote', verificationMiddleware, (req: Request, res: Response) => {

    const {id, userid}: INoteDelete = req.body

    if (id === undefined) {
        res.status(400).json({
            error: "Debe proveer un id para poder eliminar notas.",
        })
        return;
    }

    if (req.body.user.id !== userid) {
        res.status(400).json(
            {
                error: `El user id de la nota y el id del user no se corresponden.`
            }
        )
        return;
    }

    const delteQuery = `DELETE FROM NOTES WHERE id = ${id}`

    notesDataBase.run(delteQuery, function (err) {
        if (err) {
            res.status(500).json({ error: `Ha ocurrido un error al eliminar la nota: '${err.message}'` });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: `No hemos encontrado ninguna nota con el id = ${id}` });
            return;
        }

        res.status(200).json({
            id: id
        })
        return;
    })
})


app.post('/getAllNotes', verificationMiddleware, (req: Request, res: Response) => {

    const allNotesAuery = `SELECT * FROM NOTES WHERE userid = ${req.body.user.id}`
    notesDataBase.all(allNotesAuery, function (err, rows: INote[]) {
        if (err) {
            res.status(500).json({ error: `Ha ocurrido un error al optener las notas de este usuario: '${err.message}'` });
            return;
        }
        res.status(200).json(rows);
        return;
    })
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
