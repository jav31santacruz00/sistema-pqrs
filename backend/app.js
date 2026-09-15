const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");

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

app.listen(3000, () => {
    console.log('El servidor está escuchando en el puerto 3000');
});
