const express = require('express');
const login = require('./controlers/login');
const user = require('./controlers/user');
const clients = require('./controlers/clients');

const routes = express();

routes.post('/cadastrarUsuario', user.registerUser);
routes.post('/login', login);

routes.get('/home', user.home);
routes.put('atualizarUsuario', user.updateUser);
routes.post('adicionarCliente', clients.addClient);

module.exports = routes;

