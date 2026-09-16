const db = require('../database');

/**
 * Servicio para la gestión de usuarios en la base de datos
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

function crearUsuario({ nombre, apellido, correo, contrasenia, rol }) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO usuarios (nombre, apellido, correo, contrasenia, rol) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [nombre, apellido, correo, contrasenia, rol], function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
}

function actualizarUsuario(id, { nombre, apellido, correo, contrasenia, rol }) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, contrasenia = ?, rol = ? WHERE id = ?`;
        db.run(sql, [nombre, apellido, correo, contrasenia, rol, id], function (err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
}

function obtenerUsuarioPorId(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, nombre, apellido, correo, contrasenia, rol FROM usuarios WHERE id = ?`;
        db.get(sql, [id], (err, usuario) => {
            if (err) return reject(err);
            resolve(usuario);
        });
    });
}

function eliminarUsuario(id) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM usuarios WHERE id = ?`;
        db.run(sql, [id], function (err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    obtenerUsuarioPorId,
    eliminarUsuario
};
