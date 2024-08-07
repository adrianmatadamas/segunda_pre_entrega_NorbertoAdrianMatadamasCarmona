const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

// Usar las rutas
app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Iniciar el servidor
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Manejar conexiones de Socket.io
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
