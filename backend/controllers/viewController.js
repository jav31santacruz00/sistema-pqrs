const path = require('path');

class ViewController {

    renderInicio(req, res) {
        res.sendFile(path.join(__dirname, "../../frontend/inicio-sesion/inicio-sesion.html"));
    }

    renderPanel(req, res) {
        res.sendFile(path.join(__dirname, "../../frontend/panel/panel.html"));
    }

    renderSolicitudes(req, res) {
        res.sendFile(path.join(__dirname, "../../frontend/solicitudes/solicitudes.html"));
    }

    renderCrearSolicitud(req, res) {
        res.sendFile(path.join(__dirname, "../../frontend/solicitudes/crear.html"));
    }

    renderUsuarios(req, res) {
        res.sendFile(path.join(__dirname, "../../frontend/usuarios/usuarios.html"));
    }
}

module.exports = new ViewController();
