const db = require('../config/dbConfig')


class pedido{

    getPedidos(callback){
        const sql = "select id_pedido, id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado from pedidos";
        db.query(sql,callback);
    }


    getPedidoById(id,callback){
        const sql = "select id_pedido, id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado from pedidos where id_pedido = ?";
        db.query(sql,[id],callback);
    }


    postPedido(id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado, callback){
        const sql = 'insert into pedidos(id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado) values (?, ?, ?, ?, ?, ?)';
        db.query(sql, [id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }


    putPedido(id, id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado, callback){
        const sql = 'update pedidos set id_cliente = ?, id_empleado = ?, fecha_pedido = ?, fecha_entrega = ?, direccion_entrega = ?, estado = ? where id_pedido = ?';
        db.query(sql, [id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado, id], callback);
    }


    deletePedido(id, callback){
        const sql = 'delete from pedidos where id_pedido = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new pedido();