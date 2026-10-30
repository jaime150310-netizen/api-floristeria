const db = require('../config/dbConfig')


class producto{

    getProductos(callback){
        const sql = "select id_producto, id_categoria, codigo, nombre, descripcion, precio, stock from productos";
        db.query(sql,callback);
    }


    getProductoById(id,callback){
        const sql = "select id_producto, id_categoria, codigo, nombre, descripcion, precio, stock from productos where id_producto = ?";
        db.query(sql,[id],callback);
    }


    postProducto(id_categoria, codigo, nombre, descripcion, precio, stock, callback){
        const sql = 'insert into productos(id_categoria, codigo, nombre, descripcion, precio, stock) values (?, ?, ?, ?, ?, ?)';
        db.query(sql, [id_categoria, codigo, nombre, descripcion, precio, stock], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putProducto(id, id_categoria, codigo, nombre, descripcion, precio, stock, callback){
        const sql = 'update productos set id_categoria = ?, codigo = ?, nombre = ?, descripcion = ?, precio = ?, stock = ? where id_producto = ?';
        db.query(sql, [id_categoria, codigo, nombre, descripcion, precio, stock, id], callback);
    }


    deleteProducto(id, callback){
        const sql = 'delete from productos where id_producto = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new producto();