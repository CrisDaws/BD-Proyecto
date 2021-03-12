const AlmacenModel = require('../../models/almacen.model');
const Helper = require('../../libraries/helper');
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/almacen/
app.get('/', async(req, res) => {
    try {
        if (req.query.idAlmacen) req.queryMatch._id = req.query.idAlmacen;
        if (req.query.termino) req.queryMatch.$or = Helper(["strCategoria"], req.query.termino);

        const almacen = await AlmacenModel.find({...req.queryMatch }).populate({ path: 'idProducto', select: { 'strNombre': 1, '_id': 0 } });

        if (almacen.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron algun almacen en la base de datos.',
                cont: {
                    almacen
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    almacen
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a los almacenes.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/almacen/
app.post('/', async(req, res) => {

    try {
        const almacen = new AlmacenModel(req.body);

        let err = almacen.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el almacen.',
                cont: {
                    err
                }
            });
        }

        const almacenEncontrado = await AlmacenModel.findOne({ strCategoria: { $regex: `^${almacen.strCategoria}$`, $options: 'i' } });
        if (almacenEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `El almacen que se desea insertar con la categoria ${almacen.strCategoria} ya se encuentra registrada en la base de datos.`,
            cont: {
                Categoria: almacenEncontrado.strCategoria
            }
        });

        const nuevoAlmacen = await almacen.save();
        if (nuevoAlmacen.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el almacen en la base de datos.',
                cont: {
                    nuevoAlmacen
                }
            });
        } else {
            email.sendEmail(req.body.strCategoria);
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevoAlmacen
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el almacen.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/alamcen/?idProducto=603e51f51a35a066388f0f28
app.put('/', async(req, res) => {
    try {

        const idAlmacen = req.query.idAlmacen;

        if (idAlmacen == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idAlmacen;

        const almacenEncontrado = await AlmacenModel.findById(idAlmacen);

        if (!almacenEncontrado)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el almacen en la base de datos.',
                cont: almacenEncontrado
            });

        const nuevoAlmacen = new AlmacenModel(req.body);

        let err = nuevoAlmacen.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al actualizar el almacen.',
                cont: {
                    err
                }
            });
        }

        const almacenActualizado = await AlmacenModel.findByIdAndUpdate(idAlmacen, { $set: nuevoAlmacen }, { new: true });

        if (!almacenActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar el almacen.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo el almacen correctamente.',
                cont: {
                    almacenActualizado
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar el almacen.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/persona/?idPersona=603e51f51a35a066388f0f28
app.delete('/', async(req, res) => {

    try {

        if (req.query.idAlmacen == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        idAlmacen = req.query.idAlmacen;
        blnActivo = req.body.blnActivo;

        const almacenEncontrado = await AlmacenModel.findById(idPersona);

        if (!almacenEncontrado)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el almacen en la base de datos.',
                cont: almacenEncontrado
            });

        const almacenActualizado = await AlmacenModel.findByIdAndUpdate(idAlmacen, { $set: { blnActivo } }, { new: true });

        if (!almacenActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar el almacen.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'desactivado'} el almacen correctamente.`,
                cont: {
                    almacenActualizado
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar a el alamacen.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});
module.exports = app;