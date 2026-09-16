const solicitudesService = require('../services/solicitudesService');

class SolicitudesController {
    async obtenerTodas(req, res) {
        try {
            const solicitudes = await solicitudesService.obtenerSolicitudes();
            res.json(solicitudes);
        } catch (error) {
            console.error('Error en SolicitudesController.obtenerTodas:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const data = req.body;
            const result = await solicitudesService.crearSolicitud(data);
            res.json({ status: true, message: "Solicitud creada exitosamente", id: result.id });
        } catch (error) {
            console.error('Error en SolicitudesController.crear:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const result = await solicitudesService.eliminarSolicitud(id);
            res.json({ status: true, message: "Solicitud eliminada exitosamente", changes: result.changes });
        } catch (error) {
            console.error('Error en SolicitudesController.eliminar:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SolicitudesController();
