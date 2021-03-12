const InventarioModel = require('../../models/inventario.model');
const Helper = require('../../libraries/helper');
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/inventario/
app.get('/', async(req, res) => {
    try {
        if (req.query.idInventario) req.queryMatch._id = req.query.idInventario;
        if (req.query.termino) req.queryMatch.$or = Helper(["strCategoria"], req.query.termino);

        const inventario = await InventarioModel.find({...req.queryMatch }).populate({ path: 'idProducto', select: { 'strNombre': 1, '_id': 0 } });

        if (inventario.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron algun inventario en la base de datos.',
                cont: {
                    inventario
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    inventario
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a los inventarios.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/inventario/
app.post('/', async(req, res) => {

    try {
        const inventario = new InventarioModel(req.body);

        let err = inventario.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el inventario.',
                cont: {
                    err
                }
            });
        }

        const inventarioEncontrado = await AlmacenModel.findOne({ strCategoria: { $regex: `^${inventario.strCategoria}$`, $options: 'i' } });
        if (inventarioEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `El inventario que se desea insertar con la categoria ${inventario.strCategoria} ya se encuentra registrada en la base de datos.`,
            cont: {
                Inventario: inventarioEncontrado.strCategoria
            }
        });

        const nuevoInventario = await inventario.save();
        if (nuevoInventario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el inventario en la base de datos.',
                cont: {
                    nuevoInventario
                }
            });
        } else {
            email.sendEmail(req.body.strCategoria);
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevoInventario
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el inventario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/inventario/?idProducto=603e51f51a35a066388f0f28
app.put('/', async(req, res) => {
    try {

        const idInventario = req.query.idInventario;

        if (idInventario == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idInventario;

        const inventarioEncontrado = await InventarioModel.findById(idInventario);

        if (!inventarioEncontrado)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el inventario en la base de datos.',
                cont: inventarioEncontrado
            });

        const nuevoInventario = new InventarioModel(req.body);

        let err = nuevoInventario.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al actualizar el inventario.',
                cont: {
                    err
                }
            });
        }

        const inventarioActualizado = await InventarioModel.findByIdAndUpdate(idInventario, { $set: nuevoInventario }, { new: true });

        if (!inventarioActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar el inventario.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo el inventario correctamente.',
                cont: {
                    inventarioActualizado
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar el inventario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/inventario/?idPersona=603e51f51a35a066388f0f28
app.delete('/', async(req, res) => {

    try {

        if (req.query.idInventario == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        idInventario = req.query.idInventario;
        blnActivo = req.body.blnActivo;

        const inventarioEncontrado = await AlmacenModel.findById(idInventario);

        if (!inventarioEncontrado)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el inventario en la base de datos.',
                cont: inventarioEncontrado
            });

        const inventarioActualizado = await InventarioModel.findByIdAndUpdate(idInventario, { $set: { blnActivo } }, { new: true });

        if (!inventarioActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar el inventario.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'desactivado'} el inventario correctamente.`,
                cont: {
                    inventarioActualizado
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar a el inventario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

module.exports = app;