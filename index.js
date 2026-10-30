const express = require('express');
const bodyParser = require('body-parser');

const categoriaRoutes = require('./src/routes/categoriaRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const empleadoRoutes = require('./src/routes/empleadoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const detallePedidoRoutes = require('./src/routes/detallePedidoRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detallepedidos', detallePedidoRoutes);

app.listen(port, ()=>{
    console.log("Servidor iniciado en http://localhost:" + port);
});