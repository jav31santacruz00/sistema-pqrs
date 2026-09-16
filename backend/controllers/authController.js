const authService = require('../services/authService');

class AuthController {

    async login(req, res) {
        try {
            const { usuario, contrasenia } = req.body;
            
            const esValido = authService.validarCredenciales(usuario, contrasenia);

            if (esValido) {
                res.json({ status: true, message: "Inicio de sesión correcto" });
            } else {
                res.status(401).json({ status: false, message: "Usuario y/o contraseña incorrecta." });
            }
        } catch (error) {
            console.error('Error en AuthController.login:', error);
            res.status(500).json({ status: false, message: "Error interno del servidor" });
        }
    }
}

module.exports = new AuthController();
