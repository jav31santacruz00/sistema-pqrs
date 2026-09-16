const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/api/usuarios', usuariosController.obtenerTodos);
router.post('/api/usuarios', usuariosController.crear);
router.get('/api/usuarios/:id', usuariosController.obtenerPorId);
router.put('/api/usuarios/:id', usuariosController.actualizar);
router.delete('/api/usuarios/:id', usuariosController.eliminar);

module.exports = router;
