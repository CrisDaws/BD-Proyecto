/*const mongoose = require('mongoose');
const { Schema } = mongoose;

const proveedorSchema = new Schema({
    idPersona: {
        type: mongoose.Types.ObjectId,
        ref: 'persona',
        required: [true, 'Favor de insertar el valor unico del producto.']
    },
    strEmpresa: {
        type: String,
        required: [true, 'Favor de insertar los apellidos.']
    },
    strDireccionEmpresa: {
        type: String,
        required: [true, 'Favor de insertar la direccion.']
    },
    ajsnAlmacen: [almacenModel.schema], //Creación de un Array de Json
    blnActivo: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model('Proveedor', proveedorSchema);*/