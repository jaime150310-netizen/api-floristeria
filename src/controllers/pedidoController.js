const pedidoModel = require('../models/pedidoModel')

const fechaValida = (texto)=>{
    const partes = texto.match(/^(\d{4}-\d{2}-\d{2})( \d{2}:\d{2}:\d{2})?$/);
    if(!partes){
        return false;
    }
    const fecha = new Date(partes[1] + 'T00:00:00Z');
    if(isNaN(fecha.getTime())){
        return false;
    }
    return fecha.toISOString().slice(0, 10) === partes[1];
}

const idValido = (valor)=>{
    return valor !== undefined && valor !== null && valor !== '' && Number.isInteger(Number(valor)) && Number(valor) > 0;
}

const validarPedido = (body)=>{
    const {id_cliente, id_empleado, fecha_pedido, fecha_entrega, estado} = body;

    if(!idValido(id_cliente)){
        return 'El cliente es obligatorio y debe ser un numero entero';
    }

    if(!idValido(id_empleado)){
        return 'El empleado es obligatorio y debe ser un numero entero';
    }

    if(!fecha_pedido || !fechaValida(fecha_pedido.toString().trim())){
        return 'La fecha del pedido es obligatoria y debe tener el formato AAAA-MM-DD';
    }

    if(fecha_entrega !== undefined && fecha_entrega !== null && fecha_entrega !== ''){
        if(!fechaValida(fecha_entrega.toString().trim())){
            return 'La fecha de entrega debe tener el formato AAAA-MM-DD';
        }
        if(fecha_entrega.toString().trim().slice(0, 10) < fecha_pedido.toString().trim().slice(0, 10)){
            return 'La fecha de entrega no puede ser anterior a la fecha del pedido';
        }
    }

    if(!estado || estado.toString().trim() === ''){
        return 'El estado es obligatorio';
    }

    return null;
}

const errorEscritura = (err, res)=>{
    if(err.code === 'ER_NO_REFERENCED_ROW_2'){
        if(err.message.includes('id_cliente')){
            res.status(409).json({message: 'El cliente indicado no existe'});
            return;
        }
        if(err.message.includes('id_empleado')){
            res.status(409).json({message: 'El empleado indicado no existe'});
            return;
        }
        res.status(409).json({message: 'El cliente o el empleado indicado no existe'});
        return;
    }

    const codigosDatoInvalido = ['ER_BAD_NULL_ERROR', 'ER_TRUNCATED_WRONG_VALUE', 'ER_WARN_DATA_TRUNCATED', 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD'];
    if(codigosDatoInvalido.includes(err.code)){
        res.status(400).json({message: 'Alguno de los datos tiene un valor invalido'});
        return;
    }

    res.status(500).json({error: err.message});
}

module.exports = {

    getPedidos: (req, res)=>{
        pedidoModel.getPedidos((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    getPedidoById: (req, res)=>{
        const {id} = req.params;
        pedidoModel.getPedidoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            if(result.length === 0){
                res.status(404).json({message: 'Pedido no encontrado'});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    postPedido: (req, res)=>{
        const {id_cliente, id_empleado, fecha_pedido, direccion_entrega, estado} = req.body;
        let {fecha_entrega} = req.body;

        const errorValidacion = validarPedido(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        if(fecha_entrega === undefined || fecha_entrega === ''){
            fecha_entrega = null;
        }

        pedidoModel.postPedido(id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado, (err, result)=>{
            if(err){
                errorEscritura(err, res);
                return;
            }

            res.status(201).json({message: 'Pedido creado correctamente', data: {idInsertado: result}});
        });
    },


    putPedido: (req, res)=>{
        const {id} = req.params;
        const {id_cliente, id_empleado, fecha_pedido, direccion_entrega, estado} = req.body;
        let {fecha_entrega} = req.body;

        const errorValidacion = validarPedido(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        if(fecha_entrega === undefined || fecha_entrega === ''){
            fecha_entrega = null;
        }

        pedidoModel.putPedido(id, id_cliente, id_empleado, fecha_pedido, fecha_entrega, direccion_entrega, estado, (err, result)=>{
            if(err){
                errorEscritura(err, res);
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Pedido no encontrado'});
                return;
            }

            res.status(200).json({message: 'Pedido actualizado correctamente'});
        });
    },


    deletePedido: (req, res)=>{
        const {id} = req.params;

        pedidoModel.deletePedido(id, (err, result)=>{
            if(err){
                if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                    res.status(409).json({message: 'No se puede eliminar: el pedido tiene detalle asociado'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Pedido no encontrado'});
                return;
            }

            res.status(200).json({message: 'Pedido eliminado correctamente'});
        });
    }

}