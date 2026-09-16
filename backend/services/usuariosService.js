const db = require('../database');

/**
 * Servicio para la gestión de usuarios en la base de datos
 */

/**
 * Obtener la lista completa de usuarios
 */
function obtenerUsuarios() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, nombre, apellido, correo, contrasenia, rol FROM usuarios";
        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

/**
 * Crear un nuevo usuario en la base de datos
 */
function crearUsuario({ nombre, apellido, correo, contrasenia, rol }) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO usuarios (nombre, apellido, correo, contrasenia, rol) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [nombre, apellido, correo, contrasenia, rol], function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
}

/**
 * Actualizar los datos de un usuario por su ID
 */
function actualizarUsuario(id, { nombre, apellido, correo, contrasenia, rol }) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, contrasenia = ?, rol = ? WHERE id = ?`;
        db.run(sql, [nombre, apellido, correo, contrasenia, rol, id], function (err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
}

/**
 * Obtener un usuario por su ID
 */
function obtenerUsuarioPorId(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, nombre, apellido, correo, contrasenia, rol FROM usuarios WHERE id = ?`;
        db.get(sql, [id], (err, usuario) => {
            if (err) return reject(err);
            resolve(usuario);
        });
    });
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    obtenerUsuarioPorId
};
