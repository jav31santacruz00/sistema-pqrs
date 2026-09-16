const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudesController');

router.get('/api/solicitudes', solicitudesController.obtenerTodas);
router.post('/api/solicitudes', solicitudesController.crear);
router.delete('/api/solicitudes/:id', solicitudesController.eliminar);

module.exports = router;
