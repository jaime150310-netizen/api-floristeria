const clienteModel = require('../models/clienteModel')

const validarCliente = (body)=>{
    const {documento, nombre, apellido, correo} = body;

    if(!documento || documento.toString().trim() === ''){
        return 'El documento es obligatorio';
    }

    if(!nombre || nombre.toString().trim() === ''){
        return 'El nombre es obligatorio';
    }

    if(!apellido || apellido.toString().trim() === ''){
        return 'El apellido es obligatorio';
    }

    if(!correo || correo.toString().trim() === ''){
        return 'El correo es obligatorio';
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!formatoCorreo.test(correo.toString().trim())){
        return 'El correo no tiene un formato valido';
    }

    return null;
}

const mensajeDuplicado = (err)=>{
    if(err.message.includes('correo')){
        return 'Ya existe un cliente con ese correo';
    }
    if(err.message.includes('documento')){
        return 'Ya existe un cliente con ese documento';
    }
    return 'Ya existe un cliente con ese documento o correo';
}

module.exports = {

    getClientes: (req, res)=>{
        clienteModel.getClientes((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    getClienteById: (req, res)=>{
        const {id} = req.params;
        clienteModel.getClienteById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            if(result.length === 0){
                res.status(404).json({message: 'Cliente no encontrado'});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    postCliente: (req, res)=>{
        const {documento, nombre, apellido, correo, telefono, direccion} = req.body;

        const errorValidacion = validarCliente(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        clienteModel.postCliente(documento, nombre, apellido, correo, telefono, direccion, (err, result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({message: mensajeDuplicado(err)});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            res.status(201).json({message: 'Cliente creado correctamente', data: {idInsertado: result}});
        });
    },


    putCliente: (req, res)=>{
        const {id} = req.params;
        const {documento, nombre, apellido, correo, telefono, direccion} = req.body;

        const errorValidacion = validarCliente(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        clienteModel.putCliente(id, documento, nombre, apellido, correo, telefono, direccion, (err, result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({message: mensajeDuplicado(err)});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Cliente no encontrado'});
                return;
            }

            res.status(200).json({message: 'Cliente actualizado correctamente'});
        });
    },


    deleteCliente: (req, res)=>{
        const {id} = req.params;

        clienteModel.deleteCliente(id, (err, result)=>{
            if(err){
                if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                    res.status(409).json({message: 'No se puede eliminar: el cliente tiene pedidos asociados'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Cliente no encontrado'});
                return;
            }

            res.status(200).json({message: 'Cliente eliminado correctamente'});
        });
    }

}