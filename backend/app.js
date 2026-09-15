const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

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
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/inicio-sesion/inicio-sesion.html")
    );
});

app.post("/autentificacion", (req, res) => {
    const { usuario, contrasenia } = req.body;

    if (usuario === 'prueba' && contrasenia === '123456789') {
        res.json({ status: true, message: "Inicio de sesión correcto" });
    } else {
        res.status(401).json({ status: false, message: "Usuario y/o contraseña incorrecta." });
    }
});

app.get("/panel", (req, res) => {
    res.sendFile( path.join(__dirname, "../frontend/panel/panel.html"));
});

app.get("/solicitudes", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/solicitudes/solicitudes.html"));
});

app.get("/solicitudes/crear", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/solicitudes/crear.html"));
});

app.get("/api/solicitudes", (req, res) => {
    db.all("SELECT * FROM solicitudes", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post("/api/solicitudes", (req, res) => {
    const { tipo, nombre, correo, asunto, descripcion } = req.body;
    const stmt = db.prepare("INSERT INTO solicitudes (tipo, nombre, correo, asunto, descripcion) VALUES (?, ?, ?, ?, ?)");
    stmt.run(tipo, nombre, correo, asunto, descripcion, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ status: true, message: "Solicitud creada exitosamente", id: this.lastID });
    });
    stmt.finalize();
});

app.delete("/api/solicitudes/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM solicitudes WHERE id = ?", id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ status: true, message: "Solicitud eliminada exitosamente", changes: this.changes });
    });
});

app.listen(3000, () => {
    console.log('El servidor está escuchando en el puerto 3000');
});
