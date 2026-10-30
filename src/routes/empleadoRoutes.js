const express = require('express')
const router = express.Router();


const empleadoController = require('../controllers/empleadoController');


router.get('/getEmpleados', empleadoController.getEmpleados)
router.get('/getEmpleadoById/:id', empleadoController.getEmpleadoById)
router.post('/postEmpleado', empleadoController.postEmpleado);


router.put('/putEmpleado/:id', empleadoController.putEmpleado);


router.delete('/deleteEmpleado/:id', empleadoController.deleteEmpleado);


module.exports = router;