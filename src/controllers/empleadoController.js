const empleadoModel = require('../models/empleadoModel')

const fechaValida = (texto)=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(texto)){
        return false;
    }
    const fecha = new Date(texto + 'T00:00:00');
    if(isNaN(fecha.getTime())){
        return false;
    }
    return fecha.toISOString().slice(0, 10) === texto;
}

const validarEmpleado = (body)=>{
    const {documento, nombre, apellido, cargo, fecha_ingreso} = body;

    if(!documento || documento.toString().trim() === ''){
        return 'El documento es obligatorio';
    }

    if(!nombre || nombre.toString().trim() === ''){
        return 'El nombre es obligatorio';
    }

    if(!apellido || apellido.toString().trim() === ''){
        return 'El apellido es obligatorio';
    }

    if(!cargo || cargo.toString().trim() === ''){
        return 'El cargo es obligatorio';
    }

    if(fecha_ingreso !== undefined && fecha_ingreso !== null && fecha_ingreso !== ''){
        if(!fechaValida(fecha_ingreso.toString().trim())){
            return 'La fecha de ingreso debe tener el formato AAAA-MM-DD';
        }
    }

    return null;
}

module.exports = {

    getEmpleados: (req, res)=>{
        empleadoModel.getEmpleados((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    getEmpleadoById: (req, res)=>{
        const {id} = req.params;
        empleadoModel.getEmpleadoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            if(result.length === 0){
                res.status(404).json({message: 'Empleado no encontrado'});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    postEmpleado: (req, res)=>{
        const {documento, nombre, apellido, cargo, telefono} = req.body;
        let {fecha_ingreso} = req.body;

        const errorValidacion = validarEmpleado(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        if(fecha_ingreso === undefined || fecha_ingreso === ''){
            fecha_ingreso = null;
        }

        empleadoModel.postEmpleado(documento, nombre, apellido, cargo, telefono, fecha_ingreso, (err, result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({message: 'Ya existe un empleado con ese documento'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            res.status(201).json({message: 'Empleado creado correctamente', data: {idInsertado: result}});
        });
    },


    putEmpleado: (req, res)=>{
        const {id} = req.params;
        const {documento, nombre, apellido, cargo, telefono} = req.body;
        let {fecha_ingreso} = req.body;

        const errorValidacion = validarEmpleado(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        if(fecha_ingreso === undefined || fecha_ingreso === ''){
            fecha_ingreso = null;
        }

        empleadoModel.putEmpleado(id, documento, nombre, apellido, cargo, telefono, fecha_ingreso, (err, result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({message: 'Ya existe un empleado con ese documento'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Empleado no encontrado'});
                return;
            }

            res.status(200).json({message: 'Empleado actualizado correctamente'});
        });
    },


    deleteEmpleado: (req, res)=>{
        const {id} = req.params;

        empleadoModel.deleteEmpleado(id, (err, result)=>{
            if(err){
                if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                    res.status(409).json({message: 'No se puede eliminar: el empleado tiene pedidos asociados'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Empleado no encontrado'});
                return;
            }

            res.status(200).json({message: 'Empleado eliminado correctamente'});
        });
    }

}