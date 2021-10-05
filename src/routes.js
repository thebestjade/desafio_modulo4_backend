const express = require('express');
const login = require('./controlers/login');
const users = require('./controlers/users');
const clients = require('./controlers/clients');
const tokenValidation = require('./filters/tokenValidation');

const routes = express();

routes.post('/cadastrarUsuario', users.registerUser);
routes.post('/login', login);

routes.use(tokenValidation);

routes.get('/', users.home);
routes.get('/perfil', users.profile);
routes.put('/editarUsuario', users.updateUser);
routes.get('/clientes', clients.listClients);
routes.put('/editarCliente/:clienteId', clients.updateClient);
routes.get('/cliente/:clienteId', clients.clientDetails);
routes.post('/cadastrarCliente', clients.registerClient);

module.exports = routes;

