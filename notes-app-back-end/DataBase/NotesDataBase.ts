import sqlite3 from 'sqlite3';

const notesDataBase = new sqlite3.Database('./NotesDataBase.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite3.');
  }
});

notesDataBase.run(`
    CREATE TABLE IF NOT EXISTS USERS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    );
`)

notesDataBase.run(`
    CREATE TABLE IF NOT EXISTS NOTES (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        body TEXT,
        userid INTEGER,
        FOREIGN KEY(userid) REFERENCES USERS(id)
    );
`)

export default notesDataBase;
