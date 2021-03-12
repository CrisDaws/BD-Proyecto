const mongoose = require("mongoose");
const { Schema } = mongoose;

const productoSchema = new Schema(
  {
    strNombre: {
      type: String,
      required: [true, "Favor de insertar el nombre del producto"],
    },
    strDescripcion: {
      type: String,
      required: [true, "Favor de insertar una descripcion al producto"],
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
    collection: "producto",
  }
);

module.exports = mongoose.model("Producto", productoSchema);
