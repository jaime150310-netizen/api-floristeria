const detallePedidoModel = require('../models/detallePedidoModel')

const enteroPositivo = (valor)=>{
    return valor !== undefined && valor !== null && valor !== '' && Number.isInteger(Number(valor)) && Number(valor) > 0;
}

const validarDetalle = (body)=>{
    const {id_pedido, id_producto, cantidad, precio_unitario} = body;

    if(!enteroPositivo(id_pedido)){
        return 'El pedido es obligatorio y debe ser un numero entero';
    }

    if(!enteroPositivo(id_producto)){
        return 'El producto es obligatorio y debe ser un numero entero';
    }

    if(cantidad === undefined || cantidad === null || cantidad === ''){
        return 'La cantidad es obligatoria';
    }

    if(!enteroPositivo(cantidad)){
        return 'La cantidad debe ser un numero entero mayor que 0';
    }

    if(precio_unitario === undefined || precio_unitario === null || precio_unitario === ''){
        return 'El precio unitario es obligatorio';
    }

    if(isNaN(Number(precio_unitario)) || Number(precio_unitario) < 0){
        return 'El precio unitario debe ser un numero mayor o igual a 0';
    }

    return null;
}

const errorEscritura = (err, res)=>{
    if(err.code === 'ER_DUP_ENTRY'){
        res.status(409).json({message: 'Ese producto ya esta registrado en el pedido'});
        return;
    }

    if(err.code === 'ER_NO_REFERENCED_ROW_2'){
        if(err.message.includes('id_pedido')){
            res.status(409).json({message: 'El pedido indicado no existe'});
            return;
        }
        if(err.message.includes('id_producto')){
            res.status(409).json({message: 'El producto indicado no existe'});
            return;
        }
        res.status(409).json({message: 'El pedido o el producto indicado no existe'});
        return;
    }

    res.status(500).json({error: err.message});
}

module.exports = {

    getDetallePedidos: (req, res)=>{
        detallePedidoModel.getDetallePedidos((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    getDetallePedidoById: (req, res)=>{
        const {id} = req.params;
        detallePedidoModel.getDetallePedidoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            if(result.length === 0){
                res.status(404).json({message: 'Detalle de pedido no encontrado'});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    postDetallePedido: (req, res)=>{
        const {id_pedido, id_producto, cantidad, precio_unitario} = req.body;

        const errorValidacion = validarDetalle(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        detallePedidoModel.postDetallePedido(id_pedido, id_producto, cantidad, precio_unitario, (err, result)=>{
            if(err){
                errorEscritura(err, res);
                return;
            }

            res.status(201).json({message: 'Detalle de pedido creado correctamente', data: {idInsertado: result}});
        });
    },


    putDetallePedido: (req, res)=>{
        const {id} = req.params;
        const {id_pedido, id_producto, cantidad, precio_unitario} = req.body;

        const errorValidacion = validarDetalle(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        detallePedidoModel.putDetallePedido(id, id_pedido, id_producto, cantidad, precio_unitario, (err, result)=>{
            if(err){
                errorEscritura(err, res);
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Detalle de pedido no encontrado'});
                return;
            }

            res.status(200).json({message: 'Detalle de pedido actualizado correctamente'});
        });
    },


    deleteDetallePedido: (req, res)=>{
        const {id} = req.params;

        detallePedidoModel.deleteDetallePedido(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Detalle de pedido no encontrado'});
                return;
            }

            res.status(200).json({message: 'Detalle de pedido eliminado correctamente'});
        });
    }

}