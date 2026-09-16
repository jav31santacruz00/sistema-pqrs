const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar la capa de servicios
const solicitudesService = require('./services/solicitudesService');
const usuariosService = require('./services/usuariosService');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// ==========================================
// Rutas de Vistas (HTML)
// ==========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/inicio-sesion/inicio-sesion.html'));
});

app.get('/panel', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/panel/panel.html'));
});

app.get('/solicitudes', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/solicitudes/solicitudes.html'));
});

app.get('/solicitudes/crear', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/solicitudes/crear.html'));
});

app.get('/usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/usuarios/usuarios.html'));
});

// ==========================================
// Autenticación
// ==========================================

app.post('/autentificacion', (req, res) => {
    const { usuario, contrasenia } = req.body;

    if (usuario === 'prueba' && contrasenia === '123456789') {
        res.json({ status: true, message: 'Inicio de sesión correcto' });
    } else {
        res.status(401).json({ status: false, message: 'Usuario y/o contraseña incorrecta.' });
    }
});

// ==========================================
// API - Solicitudes
// ==========================================

app.get('/api/solicitudes', async (req, res) => {
    try {
        const rows = await solicitudesService.obtenerSolicitudes();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/solicitudes', async (req, res) => {
    try {
        const { tipo, nombre, correo, asunto, descripcion } = req.body;
        const resultado = await solicitudesService.crearSolicitud({
            tipo,
            nombre,
            correo,
            asunto,
            descripcion
        });
        res.json({
            status: true,
            message: 'Solicitud creada exitosamente',
            id: resultado.id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/solicitudes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await solicitudesService.eliminarSolicitud(id);
        res.json({
            status: true,
            message: 'Solicitud eliminada exitosamente',
            changes: resultado.changes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// API - Gestión de Usuarios
// ==========================================

app.get('/api/listar-usuarios', async (req, res) => {
    try {
        const rows = await usuariosService.obtenerUsuarios();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/crear-usuario', async (req, res) => {
    const { nombre, apellido, correo, contrasenia, rol } = req.body;

    if (!nombre || !apellido || !correo || !contrasenia) {
        return res.status(400).json({
            status: false,
            menssage: 'Nombre, apellido, correo y contraseña son obligatorios',
            message: 'Nombre, apellido, correo y contraseña son obligatorios'
        });
    }

    try {
        const resultado = await usuariosService.crearUsuario({
            nombre,
            apellido,
            correo,
            contrasenia,
            rol
        });
        res.status(201).json({
            status: true,
            menssage: 'Usuario creado',
            message: 'Usuario creado',
            id: resultado.id
        });
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE')) {
            return res.status(400).json({
                status: false,
                menssage: 'El correo ya está registrado',
                message: 'El correo ya está registrado'
            });
        }
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
});

app.put('/api/actualizar-usuario/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, contrasenia, rol } = req.body;

    try {
        await usuariosService.actualizarUsuario(id, {
            nombre,
            apellido,
            correo,
            contrasenia,
            rol
        });
        res.json({
            status: true,
            menssage: 'Usuario actualizado',
            message: 'Usuario actualizado'
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.get('/api/listar-usuarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await usuariosService.obtenerUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({
                status: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json(usuario);
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

app.delete('/api/eliminar-usuario/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await usuariosService.eliminarUsuario(id);

        if (resultado.changes === 0) {
            return res.status(404).json({
                status: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            status: true,
            message: 'Usuario eliminado exitosamente',
            changes: resultado.changes
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await usuariosService.eliminarUsuario(id);

        if (resultado.changes === 0) {
            return res.status(404).json({
                status: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            status: true,
            message: 'Usuario eliminado exitosamente',
            changes: resultado.changes
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
});

// ==========================================
// Inicialización del Servidor
// ==========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
