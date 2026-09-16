const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();

const authRoutes = require('./routes/authRoutes');
const solicitudesRoutes = require('./routes/solicitudesRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const viewRoutes = require('./routes/viewRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

app.use('/', viewRoutes);
app.use('/', authRoutes);
app.use('/', solicitudesRoutes);
app.use('/', usuariosRoutes);

app.listen(3000, () => {
    console.log('El servidor está escuchando en el puerto 3000');
});
