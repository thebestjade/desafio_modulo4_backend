const express = require('express');
const login = require('./controlers/login');
const users = require('./controlers/users');
const clients = require('./controlers/clients');
const tokenValidation = require('./filters/tokenValidation');

const routes = express();

routes.post('/cadastrarUsuario', users.registerUser);
routes.post('/login', login);

routes.use(tokenValidation);

routes.get('/home', users.home);
routes.get('/profile', users.profile);
routes.put('/editarUsuario', users.updateUser);
routes.post('/cadastrarCliente', clients.registerClient);

module.exports = routes;

