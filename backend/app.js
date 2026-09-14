const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/inicio-sesion/inicio-sesion.html"));
});

app.post("/autentificacion", (req, res) => {    
    const { usuario, contrasenia } = req.body;

    if (usuario === 'prueba@gmail.com' && contrasenia === '123456789') {
        res.json({ mensaje: "correcto" });
    } else {
        res.status(401).json({ mensaje: "Incorrecto" });
    }
});

app.listen(3000, () => {
	console.log('El servidor está escuchando en el puerto 3000');
});