const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usamos path.resolve para asegurar que encuentre database.sqlite donde sea que se ejecute app.js
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS solicitudes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT,
        nombre TEXT,
        correo TEXT,
        asunto TEXT,
        descripcion TEXT,
        estado TEXT DEFAULT 'Pendiente',
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        apellido TEXT,
        correo TEXT,
        contrasenia TEXT,
        rol TEXT DEFAULT 'usuario'
    )`);
});

module.exports = db;
