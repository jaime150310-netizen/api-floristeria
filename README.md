# API REST Floristería

API REST desarrollada con Node.js, Express y MySQL para gestionar una floristería: categorías, productos, clientes, empleados, pedidos y detalle de pedidos. La base de datos está alojada en Aiven y la API desplegada en Render.

**Autor:** Jaime Valencia

**URL pública:** https://api-floristeria-jank.onrender.com

## Tecnologías

- Node.js
- Express.js
- MySQL (paquete `mysql`)
- body-parser
- dotenv

## Estructura del proyecto

```
├── index.js
├── package.json
└── src
    ├── config
    │   └── dbConfig.js
    ├── controllers
    ├── models
    └── routes
```

Cada tabla tiene su modelo, su controlador y su archivo de rutas.

## Instalación

1. Clonar el repositorio:

```
git clone https://github.com/jaime150310-netizen/api-floristeria.git
cd api-floristeria
```

2. Instalar las dependencias:

```
npm install
```

3. Crear un archivo `.env` en la raíz con las variables de entorno (ver la sección siguiente).

4. Si se trabaja en local, guardar el certificado de la base de datos como `ca.pem` en la raíz del proyecto.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host de la base de datos |
| `DB_PORT` | Puerto de la base de datos |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_NAME` | Nombre de la base de datos |
| `DB_CA` | Contenido del certificado CA (se usa en el despliegue; en local se lee el archivo `ca.pem`) |
| `PORT` | Puerto del servidor (opcional, por defecto 3000) |

Ejemplo de `.env` (con valores de ejemplo, no reales):

```
DB_HOST=host-de-ejemplo.aivencloud.com
DB_PORT=12345
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=defaultdb
PORT=3000
```

Los archivos `.env` y `ca.pem` no se suben al repositorio.

## Ejecución

```
node index.js
```

El servidor queda disponible en `http://localhost:3000`.

## Formato de las respuestas

Todas las respuestas son JSON.

- Consulta correcta: `{"data": ...}`
- Creación, actualización o eliminación: `{"message": "..."}`; en la creación se incluye además `{"data": {"idInsertado": n}}`
- Error: `{"message": "..."}` o `{"error": "..."}`

## Códigos de estado

| Código | Significado |
|---|---|
| 200 | Operación correcta |
| 201 | Registro creado |
| 400 | Datos inválidos o faltantes |
| 404 | Registro no encontrado |
| 409 | Conflicto: valor único repetido o llave foránea inválida o referenciada |
| 500 | Error interno del servidor |

## Endpoints

Cada recurso tiene cinco operaciones. El `:id` es el identificador del registro.

### Categorías (`/api/categorias`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/getCategorias` | Lista todas las categorías |
| GET | `/getCategoriaById/:id` | Consulta una categoría |
| POST | `/postCategoria` | Crea una categoría |
| PUT | `/putCategoria/:id` | Actualiza una categoría |
| DELETE | `/deleteCategoria/:id` | Elimina una categoría |

Cuerpo: `nombre`, `descripcion`

### Productos (`/api/productos`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/getProductos` | Lista todos los productos |
| GET | `/getProductoById/:id` | Consulta un producto |
| POST | `/postProducto` | Crea un producto |
| PUT | `/putProducto/:id` | Actualiza un producto |
| DELETE | `/deleteProducto/:id` | Elimina un producto |

Cuerpo: `id_categoria`, `codigo`, `nombre`, `descripcion`, `precio`, `stock`

### Clientes (`/api/clientes`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/getClientes` | Lista todos los clientes |
| GET | `/getClienteById/:id` | Consulta un cliente |
| POST | `/postCliente` | Crea un cliente |
| PUT | `/putCliente/:id` | Actualiza un cliente |
| DELETE | `/deleteCliente/:id` | Elimina un cliente |

Cuerpo: `documento`, `nombre`, `apellido`, `correo`, `telefono`, `direccion`

### Empleados (`/api/empleados`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/getEmpleados` | Lista todos los empleados |
| GET | `/getEmpleadoById/:id` | Consulta un empleado |
| POST | `/postEmpleado` | Crea un empleado |
| PUT | `/putEmpleado/:id` | Actualiza un empleado |
| DELETE | `/deleteEmpleado/:id` | Elimina un empleado |

Cuerpo: `documento`, `nombre`, `apellido`, `cargo`, `telefono`, `fecha_ingreso`

### Pedidos (`/api/pedidos`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/getPedidos` | Lista todos los pedidos |
| GET | `/getPedidoById/:id` | Consulta un pedido |
| POST | `/postPedido` | Crea un pedido |
| PUT | `/putPedido/:id` | Actualiza un pedido |
| DELETE | `/deletePedido/:id` | Elimina un pedido |

Cuerpo: `id_cliente`, `id_empleado`, `fecha_pedido`, `fecha_entrega`, `direccion_entrega`, `estado`

### Detalle de pedidos (`/api/detallepedidos`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/getDetallePedidos` | Lista todos los detalles |
| GET | `/getDetallePedidoById/:id` | Consulta un detalle |
| POST | `/postDetallePedido` | Crea un detalle |
| PUT | `/putDetallePedido/:id` | Actualiza un detalle |
| DELETE | `/deleteDetallePedido/:id` | Elimina un detalle |

Cuerpo: `id_pedido`, `id_producto`, `cantidad`, `precio_unitario`

## Ejemplo de uso

```
GET https://api-floristeria-jank.onrender.com/api/categorias/getCategorias
```