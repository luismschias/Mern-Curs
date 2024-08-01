const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const server = express();

server.use(bodyParser.json());

server.use('/uploads/images', express.static(path.join('uploads', 'images')));

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});


server.use('/api/places', placesRoutes);
server.use('/api/users', usersRoutes);

server.use((req, res, next) => {
    const error = new HttpError('could not find this route.', 404);
    throw error;
});

server.use((error, req, res, next) =>{
    if (req.file) {
        fs.unlink(req.file.path, () => {
            console.log(error);
        });
    }

    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
.connect('mongodb+srv://luismschias:Lms181194@bancomern.hupgbm3.mongodb.net/mern?retryWrites=true&w=majority&appName=BancoMern')
.then(() => {
    server.listen(5000);
})
.catch(err => {
    console.log(err);
});


//senha postman Lms!181106/Jps!181194
