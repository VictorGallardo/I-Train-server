// Imports
import Server from "./classes/server";
import mongoose from 'mongoose'
import bodyparser from 'body-parser'
import cors from 'cors'

import postRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';
import fileUpload from 'express-fileupload';
import listRoutes from './routes/list.routes';
import itemRoutes from './routes/item.routes';
import eventRoutes from "./routes/event.routes";

const server = new Server();


// Body parser
server.app.use(bodyparser.urlencoded({ extended: true }));
server.app.use(bodyparser.json());


// FileUpload
server.app.use(fileUpload({ useTempFiles: true }));


// Cors
server.app.use(cors({ origin: true, credentials: true }));


// Rutas de la app
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);
server.app.use('/lists', listRoutes);
server.app.use('/items', itemRoutes);
server.app.use('/events', eventRoutes);


// Conexión DB
mongoose.connect('mongodb+srv://vgallardo:nV4RwPiZw5jCJWx4@cluster01.dkb8b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useCreateIndex: true }, (err) => {

        if (err) throw err;
        console.log('Base de datos Online');

    })



let listenPort = process.env.PORT || 3000;

server.app.listen(listenPort, () => {
    console.log("Servidor funcionando en puerto: " + listenPort);
})
