const categoriaModel = require('../models/categoriaModel')

module.exports = {

    getCategorias: (req, res)=>{
        categoriaModel.getCategorias((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    getCategoriaById: (req, res)=>{
        const {id} = req.params;
        categoriaModel.getCategoriaById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            if(result.length === 0){
                res.status(404).json({message: 'Categoria no encontrada'});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    postCategoria: (req, res)=>{
        const {nombre, descripcion} = req.body;

        if(!nombre || nombre.toString().trim() === ''){
            res.status(400).json({message: 'El nombre es obligatorio'});
            return;
        }

        categoriaModel.postCategoria(nombre, descripcion, (err, result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({message: 'Ya existe una categoria con ese nombre'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            res.status(201).json({message: 'Categoria creada correctamente', data: {idInsertado: result}});
        });
    },


    putCategoria: (req, res)=>{
        const {id} = req.params;
        const {nombre, descripcion} = req.body;

        if(!nombre || nombre.toString().trim() === ''){
            res.status(400).json({message: 'El nombre es obligatorio'});
            return;
        }

        categoriaModel.putCategoria(id, nombre, descripcion, (err, result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({message: 'Ya existe una categoria con ese nombre'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Categoria no encontrada'});
                return;
            }

            res.status(200).json({message: 'Categoria actualizada correctamente'});
        });
    },


    deleteCategoria: (req, res)=>{
        const {id} = req.params;

        categoriaModel.deleteCategoria(id, (err, result)=>{
            if(err){
                if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                    res.status(409).json({message: 'No se puede eliminar: la categoria tiene productos asociados'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Categoria no encontrada'});
                return;
            }

            res.status(200).json({message: 'Categoria eliminada correctamente'});
        });
    }

}