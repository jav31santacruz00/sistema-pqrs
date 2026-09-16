const usuariosService = require('../services/usuariosService');

class UsuariosController {
    async obtenerTodos(req, res) {
        try {
            const usuarios = await usuariosService.obtenerUsuarios();
            res.json(usuarios);
        } catch (error) {
            console.error('Error en UsuariosController.obtenerTodos:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const data = req.body;
            const result = await usuariosService.crearUsuario(data);
            res.json({ status: true, message: "Usuario creado exitosamente", id: result.id });
        } catch (error) {
            console.error('Error en UsuariosController.crear:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await usuariosService.actualizarUsuario(id, data);
            res.json({ status: true, message: "Usuario actualizado exitosamente", changes: result.changes });
        } catch (error) {
            console.error('Error en UsuariosController.actualizar:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const usuario = await usuariosService.obtenerUsuarioPorId(id);
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('Error en UsuariosController.obtenerPorId:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const result = await usuariosService.eliminarUsuario(id);
            res.json({ status: true, message: "Usuario eliminado exitosamente", changes: result.changes });
        } catch (error) {
            console.error('Error en UsuariosController.eliminar:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UsuariosController();
