const express = require('express');
const login = require('./controlers/login');
const users = require('./controlers/users');
const clients = require('./controlers/clients');
const tokenValidation = require('./filters/tokenValidation');

const routes = express();

routes.post('/cadastrarUsuario', users.registerUser);
routes.post('/login', login);

routes.use(tokenValidation);

// routes.get('/home', users.home);
// routes.put('atualizarUsuario', users.updateUser);
// routes.post('adicionarCliente', clients.addClient);

module.exports = routes;

