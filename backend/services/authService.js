class AuthService {
    /**
     * Valida las credenciales del usuario.
     * @param {string} usuario 
     * @param {string} contrasenia 
     * @returns {boolean} true si es correcto, false en caso contrario
     */
    validarCredenciales(usuario, contrasenia) {
        return (usuario === 'prueba' && contrasenia === '123456789');
    }
}

module.exports = new AuthService();
