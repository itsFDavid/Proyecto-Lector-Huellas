const conexion = require("../utils/dbConection");

module.exports = {
    insertar(nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, fotoUser, carrera, correoInstitucional) {
        return new Promise((resolve, reject) => {
            conexion.query(`
                INSERT INTO Usuarios 
                (nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, fotoUser, carrera, correoInstitucional) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, fotoUser, carrera, correoInstitucional],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados.insertId);
                }
            );
        });
    },
    obtener() {
        return new Promise((resolve, reject) => {
            conexion.query(`
                SELECT id_huella, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, fotoUser, carrera, correoInstitucional 
                FROM Usuarios`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                }
            );
        });
    },
    obtenerPorId(id_huella) {
        return new Promise((resolve, reject) => {
            conexion.query(`
                SELECT id_huella, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, fotoUser, carrera, correoInstitucional 
                FROM Usuarios 
                WHERE id_huella = ?`,
                [id_huella],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0]);
                }
            );
        });
    },
    eliminar(id_huella) {
        return new Promise((resolve, reject) => {
            conexion.query(`
                DELETE FROM Usuarios 
                WHERE id_huella = ?`,
                [id_huella],
                (err) => {
                    if (err) reject(err);
                    else resolve(`Eliminado correctamente en bd: ${id_huella} `);
                }
            );
        });
    },
    obtenerUltimoId() {
        return new Promise((resolve, reject) => {
            conexion.query(`
                SELECT MAX(id_huella) AS ultimoId 
                FROM Usuarios`,
                (err, resultados) => {
                    if (err) reject(err);
                    else {
                        const ultimoId = resultados[0].ultimoId !== null ? resultados[0].ultimoId : 0;
                        resolve(ultimoId);
                    }
                }
            );
        });
    },    
    obtenerNumeroIds() {
        return new Promise((resolve, reject) => {
            conexion.query(`
                SELECT COUNT(id_huella) AS totalIds 
                FROM Usuarios`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0].totalIds);
                }
            );
        });
    }
};
