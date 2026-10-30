const db = require('../config/dbConfig')


class empleado{

    getEmpleados(callback){
        const sql = "select id_empleado, documento, nombre, apellido, cargo, telefono, fecha_ingreso from empleados";
        db.query(sql,callback);
    }


    getEmpleadoById(id,callback){
        const sql = "select id_empleado, documento, nombre, apellido, cargo, telefono, fecha_ingreso from empleados where id_empleado = ?";
        db.query(sql,[id],callback);
    }


    postEmpleado(documento, nombre, apellido, cargo, telefono, fecha_ingreso, callback){
        const sql = 'insert into empleados(documento, nombre, apellido, cargo, telefono, fecha_ingreso) values (?, ?, ?, ?, ?, ?)';
        db.query(sql, [documento, nombre, apellido, cargo, telefono, fecha_ingreso], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putEmpleado(id, documento, nombre, apellido, cargo, telefono, fecha_ingreso, callback){
        const sql = 'update empleados set documento = ?, nombre = ?, apellido = ?, cargo = ?, telefono = ?, fecha_ingreso = ? where id_empleado = ?';
        db.query(sql, [documento, nombre, apellido, cargo, telefono, fecha_ingreso, id], callback);
    }


    deleteEmpleado(id, callback){
        const sql = 'delete from empleados where id_empleado = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new empleado();