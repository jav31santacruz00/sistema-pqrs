const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

router.get('/', viewController.renderInicio);
router.get('/panel', viewController.renderPanel);
router.get('/solicitudes', viewController.renderSolicitudes);
router.get('/solicitudes/crear', viewController.renderCrearSolicitud);
router.get('/usuarios', viewController.renderUsuarios);
router.get('/usuarios/', viewController.renderUsuarios);

module.exports = router;
