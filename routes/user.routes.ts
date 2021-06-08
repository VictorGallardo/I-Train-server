// Imports
import { Router, Request, Response } from 'express';
import { User, Iuser } from '../models/user.model';
import bycrypt from 'bcrypt'
import Token from '../classes/token';
import { validateToken } from '../middlewares/authentication';


const userRoutes = Router();

// Login de usuario

userRoutes.post('/login', (req: Request, res: Response) => {

    // extraer la info del post
    const body = req.body;

    User.findOne({ email: body.email }, (err: any, userDB: Iuser) => {

        if (err) throw err;

        if (!userDB) {

            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña incorrecta'
            });
        }

        if (userDB.comparePassword(body.password)) {

            const tokenUser = Token.getJWebToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                id: userDB._id,
                token: tokenUser,
                user: userDB
            });

        } else {

            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña incorrecta ***'
            });
        }
    });
});


// Crear un usuario
userRoutes.post('/create', (req: Request, res: Response) => {

    // extraer la info del post
    const user = {

        name: req.body.name,
        email: req.body.email,
        password: bycrypt.hashSync(req.body.password, 10),
        role: req.body.role,
        avatar: req.body.avatar
    }

    User.create(user).then(userDB => {

        const tokenUser = Token.getJWebToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            role: userDB.role,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });

    }).catch(err => {

        res.json({
            ok: false,
            err
        });

    });

});

// Actualizar usuario
userRoutes.post('/update', validateToken, (req: any, res: Response) => {

    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        password: req.body.password || req.user.password,
        role: req.body.role || req.user.role,
        avatar: req.body.avatar || req.user.avatar
    }

    User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {

        if (err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJWebToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            password: userDB.password,
            role: userDB.role,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });


    });

});

// Actualizar usuarios en I-ADMIN

userRoutes.post('/update/:userid', (req: any, res: Response) => {

    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        password: req.body.password || req.user.password,
        role: req.body.role || req.user.role,
        avatar: req.body.avatar || req.user.avatar
    }

    User.findByIdAndUpdate(req.params.userid, user, { new: true }, (err, userDB) => {

        if (err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }

        res.json({
            ok: true,
            user: 'Useario actualizado con éxito'
        });


    });

});

userRoutes.get('/', [validateToken], (req: any, res: Response) => {
    const user = req.user;

    res.json({
        ok: true,
        user
    });
});


// Obtener todos los usuarios 

userRoutes.get('/all', async (req: any, res: Response) => {

    const users = await User
        .find()           // Busca por id user
        .sort({ _id: -1 })    // Ordena
        .exec()               // Ejecuta

    // Respuesta    
    res.json({
        ok: true,
        users,

    });

});


// Metodo para borrar usuario por su ID

userRoutes.delete('/delete/:userid', (req: any, res: Response) => {


    User.findByIdAndRemove(req.params.userid, req.body, (err, userDB) => {

        if (err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }

        res.json({
            ok: true,
            user: 'Usuario borrado con éxito'
        });


    });

});


// // Insertar id en array lists: de usuarios (EN PRUEBAS)
// userRoutes.post('/addlist/:iduser/:idlist', (req: Request, res: Response) => {

//     // extraer la info del post
//     const iduser = req.params.iduser;
//     const idlist = req.params.idlist;

//     User.findOne({ _id: iduser }, (err: any, userDB: Iuser) => {

//         userDB.lists.push(idlist)
//         userDB.save();

//         res.json({
//             ok: true,
//             idlist


//         });

//     });
// });
export default userRoutes;



