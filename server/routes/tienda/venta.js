const VentaModel = require('../../models/venta.model');
const Helper = require('../../libraries/helper');
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/venta/
app.post('/', async(req, res) => {

    try {
        const venta = new VentaModel(req.body);

        let err = venta.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la venta.',
                cont: {
                    err
                }
            });
        }

        const ventaEncontrada = await VentaModel.findOne({ strMetodoPago: { $regex: `^${venta.strMetodoPago}$`, $options: 'i' } });
        if (ventaEncontrada) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `La venta que se desea insertar con el id ${venta.strMetodoPago} ya se encuentra registrada en la base de datos.`,
            cont: {
                Venta: ventaEncontrada.strMetodoPago
            }
        });

        const nuevaVenta = await venta.save();
        if (nuevaVenta.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar la venta en la base de datos.',
                cont: {
                    nuevaVenta
                }
            });
        } else {
            email.sendEmail(req.body.strMetodoPago);
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevaVenta
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la venta.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

module.exports = app;