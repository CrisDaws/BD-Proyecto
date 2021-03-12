/*const ProveedorModel = require('../../models/proveedor.model');
const Helper = require('../../libraries/helper');
const express = require('express');
const app = express();

const email = require('../../libraries/email');

//http://localhost:3000/api/proveedor/
app.get('/', async(req, res) => {
    try {
        if (req.query.idPersona) req.queryMatch._id = req.query.idPersona;
        if (req.query.termino) req.queryMatch.$or = Helper(["idPersona", "strEmpresa", "strDireccionEmpresa", "ajsnAlmacen", "strCorreo"], req.query.termino);

        const persona = await ProveedorModel.find({...req.queryMatch }).populate({ path: 'idProveedor'});

        if (persona.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron proveedores en la base de datos.',
                cont: {
                    persona
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    persona
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener los proveedores.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/proveedor/
app.post('/', async(req, res) => {

    try {
        const persona = new ProveedorModel(req.body);

        let err = persona.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el proveedor.',
                cont: {
                    err
                }
            });
        }

        const personaEncontrada = await ProveedorModel.findOne({ strEmpresa: { $regex: `^${persona.strEmpresa}$`, $options: 'i' } });
        if (personaEncontrada) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `La persona que se desea insertar ya se encuentra registrada en la base de datos.`,
            cont: {
                strEmpresa: personaEncontrada.strEmpresa
            }
        });

        const nuevaPersona = await persona.save();
        if (nuevaPersona.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar la persona en la base de datos.',
                cont: {
                    nuevaPersona
                }
            });
        } else {
            email.sendEmail(req.body.strCorreo);
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevaPersona
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la persona.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/persona/?idPersona=603e51f51a35a066388f0f28
app.put('/', async(req, res) => {
    try {

        const idPersona = req.query.idPersona;

        if (idPersona == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idPersona;

        const personaEncontrada = await PersonaModel.findById(idPersona);

        if (!personaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la persona en la base de datos.',
                cont: personaEncontrada
            });

        const nuevaPersona = new PersonaModel(req.body);

        let err = nuevaPersona.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al actualizar la persona.',
                cont: {
                    err
                }
            });
        }

        const personaActualizada = await PersonaModel.findByIdAndUpdate(idPersona, { $set: nuevaPersona }, { new: true });

        if (!personaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar la persona.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo la persona correctamente.',
                cont: {
                    personaActualizada
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar la persona.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/persona/?idPersona=603e51f51a35a066388f0f28
app.delete('/', async(req, res) => {

    try {

        if (req.query.idPersona == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        idPersona = req.query.idPersona;
        blnActivo = req.body.blnActivo;

        const personaEncontrada = await PersonaModel.findById(idPersona);

        if (!personaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro la persona en la base de datos.',
                cont: personaEncontrada
            });

        const personaActualizada = await PersonaModel.findByIdAndUpdate(idPersona, { $set: { blnActivo } }, { new: true });

        if (!personaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar la persona.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'desactivado'} la persona correctamente.`,
                cont: {
                    personaActualizada
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar a la persona.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});


module.exports = app;*/