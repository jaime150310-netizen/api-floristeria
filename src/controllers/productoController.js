const productoModel = require('../models/productoModel')

const validarProducto = (body)=>{
    const {id_categoria, codigo, nombre, precio, stock} = body;

    if(id_categoria === undefined || id_categoria === null || id_categoria === '' || !Number.isInteger(Number(id_categoria))){
        return 'La categoria es obligatoria y debe ser un numero entero';
    }

    if(!codigo || codigo.toString().trim() === ''){
        return 'El codigo es obligatorio';
    }

    if(!nombre || nombre.toString().trim() === ''){
        return 'El nombre es obligatorio';
    }

    if(precio === undefined || precio === null || precio === '' || isNaN(Number(precio)) || Number(precio) < 0){
        return 'El precio es obligatorio y debe ser un numero mayor o igual a 0';
    }

    if(stock !== undefined && stock !== null && stock !== ''){
        if(!Number.isInteger(Number(stock)) || Number(stock) < 0){
            return 'El stock debe ser un numero entero mayor o igual a 0';
        }
    }

    return null;
}

module.exports = {

    getProductos: (req, res)=>{
        productoModel.getProductos((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    getProductoById: (req, res)=>{
        const {id} = req.params;
        productoModel.getProductoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }

            if(result.length === 0){
                res.status(404).json({message: 'Producto no encontrado'});
                return;
            }

            res.status(200).json({data: result});
        });
    },


    postProducto: (req, res)=>{
        const {id_categoria, codigo, nombre, descripcion, precio} = req.body;
        let {stock} = req.body;

        const errorValidacion = validarProducto(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        if(stock === undefined || stock === null || stock === ''){
            stock = 0;
        }

        productoModel.postProducto(id_categoria, codigo, nombre, descripcion, precio, stock, (err, result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({message: 'Ya existe un producto con ese codigo'});
                    return;
                }
                if(err.code === 'ER_NO_REFERENCED_ROW_2'){
                    res.status(409).json({message: 'La categoria indicada no existe'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            res.status(201).json({message: 'Producto creado correctamente', data: {idInsertado: result}});
        });
    },


    putProducto: (req, res)=>{
        const {id} = req.params;
        const {id_categoria, codigo, nombre, descripcion, precio} = req.body;
        let {stock} = req.body;

        const errorValidacion = validarProducto(req.body);
        if(errorValidacion){
            res.status(400).json({message: errorValidacion});
            return;
        }

        if(stock === undefined || stock === null || stock === ''){
            stock = 0;
        }

        productoModel.putProducto(id, id_categoria, codigo, nombre, descripcion, precio, stock, (err, result)=>{
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.status(409).json({message: 'Ya existe un producto con ese codigo'});
                    return;
                }
                if(err.code === 'ER_NO_REFERENCED_ROW_2'){
                    res.status(409).json({message: 'La categoria indicada no existe'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Producto no encontrado'});
                return;
            }

            res.status(200).json({message: 'Producto actualizado correctamente'});
        });
    },


    deleteProducto: (req, res)=>{
        const {id} = req.params;

        productoModel.deleteProducto(id, (err, result)=>{
            if(err){
                if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                    res.status(409).json({message: 'No se puede eliminar: el producto esta en pedidos'});
                    return;
                }
                res.status(500).json({error: err.message});
                return;
            }

            if(result.affectedRows === 0){
                res.status(404).json({message: 'Producto no encontrado'});
                return;
            }

            res.status(200).json({message: 'Producto eliminado correctamente'});
        });
    }

}