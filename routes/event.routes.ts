import { Event } from '../models/event.model';
import { Router, Response } from 'express'
import { validateToken } from '../middlewares/authentication';


const eventRoutes = Router();

// Obtener eventos

eventRoutes.get('/', [validateToken], async (req: any, res: Response) => {

    const body = req.body;
    body.user = req.user._id;

    const events = await Event
        .find(body)           // Busca por id user
        .sort({ _id: -1 })    // Ordena
        .exec()               // Ejecuta

    // Respuesta    
    res.json({
        ok: true,
        events,

    });

});


// Crear eventos

eventRoutes.post('/', [validateToken], (req: any, res: Response) => {

    // Insercción
    const body = req.body;
    body.user = req.user._id;
    body._id = req.body._id

    // Grabar en la base de datos
    Event.create(body).then(async eventDB => {

        await eventDB.populate('user', '-password').execPopulate();

        res.json({
            ok: true,
            event: eventDB

        });

    }).catch(err => { // Si sucede algún error
        res.json(err)
    });
});


// Metodo para borrar eventos por su ID

eventRoutes.delete('/delete/:eventid', (req: any, res: Response) => {

    Event.findByIdAndRemove(req.params.eventid, req.body, (err, eventDB) => {

        if (err) throw err;

        if (!eventDB) {
            return res.json({
                ok: false,
                message: 'No existe un evento con ese ID'
            });
        }

        res.json({
            ok: true,
            event: 'Evento borrado con éxito'
        });

    });

});


// Actualizar items

eventRoutes.post('/update/:eventid', (req: any, res: Response) => {

    const event = {
        title: req.body.title || req.event.title,
        description: req.body.description || req.event.description,
        startTime: req.body.startTime || req.event.startTime,
        endTime: req.body.endTime || req.event.endTime
    }

    Event.findByIdAndUpdate(req.params.eventid, event, { new: true }, (err, eventDB) => {

        if (err) throw err;

        if (!eventDB) {
            return res.json({
                ok: false,
                message: 'No existe un evento con ese ID'
            });
        }

        res.json({
            ok: true,
            event: 'Evento actualizado con éxito'
        });


    });

});

export default eventRoutes;