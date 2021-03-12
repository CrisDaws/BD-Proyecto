const mongoose = require("mongoose");
const { Schema } = mongoose;

const ventaSchema = new Schema(
  {
    idPersona: {
      type: Schema.Types.ObjectId,
      ref: "persona",
    },
    dteFecha: {
      type: Date,
      required: [true, "Favor de insertar la fecha de venta"],
    },
    nmbCantidad: {
      type: Number,
      required: [true, "Favor de ingresar la cantidad"],
    },
    nmbTotalPrecio: {
      type: Number,
      required: [true, "Favor de insertar el total de la venta"],
    },
    strMetodoPago: {
      type: String,
      required: [true, "Favor de ingresar el metodo de pago"],
    },
    idProducto: {
      type: Schema.Types.ObjectId,
      ref: "producto",
    },
    blnActivo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "venta",
  }
);

module.exports = mongoose.model('Venta', ventaSchema);