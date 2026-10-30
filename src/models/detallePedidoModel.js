const db = require('../config/dbConfig')


class detallePedido{

    getDetallePedidos(callback){
        const sql = "select id_detalle, id_pedido, id_producto, cantidad, precio_unitario from detalle_pedido";
        db.query(sql,callback);
    }


    getDetallePedidoById(id,callback){
        const sql = "select id_detalle, id_pedido, id_producto, cantidad, precio_unitario from detalle_pedido where id_detalle = ?";
        db.query(sql,[id],callback);
    }


    postDetallePedido(id_pedido, id_producto, cantidad, precio_unitario, callback){
        const sql = 'insert into detalle_pedido(id_pedido, id_producto, cantidad, precio_unitario) values (?, ?, ?, ?)';
        db.query(sql, [id_pedido, id_producto, cantidad, precio_unitario], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putDetallePedido(id, id_pedido, id_producto, cantidad, precio_unitario, callback){
        const sql = 'update detalle_pedido set id_pedido = ?, id_producto = ?, cantidad = ?, precio_unitario = ? where id_detalle = ?';
        db.query(sql, [id_pedido, id_producto, cantidad, precio_unitario, id], callback);
    }


    deleteDetallePedido(id, callback){
        const sql = 'delete from detalle_pedido where id_detalle = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new detallePedido();