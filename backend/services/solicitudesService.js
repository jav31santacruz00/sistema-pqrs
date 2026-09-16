const db = require('../database');

/**
 * Servicio para la gestión de solicitudes en la base de datos
 */

function obtenerSolicitudes() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM solicitudes";
        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}


function crearSolicitud({ tipo, nombre, correo, asunto, descripcion }) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO solicitudes (tipo, nombre, correo, asunto, descripcion) VALUES (?, ?, ?, ?, ?)";
        db.run(sql, [tipo, nombre, correo, asunto, descripcion], function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
}


function eliminarSolicitud(id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM solicitudes WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
}

module.exports = {
    obtenerSolicitudes,
    crearSolicitud,
    eliminarSolicitud
};
