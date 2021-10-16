const express = require('express');
const login = require('./controlers/login');
const users = require('./controlers/users');
const clients = require('./controlers/clients');
const charges = require('./controlers/charges');
const tokenValidation = require('./filters/tokenValidation');

const routes = express();

routes.post('/cadastrarUsuario', users.registerUser);
routes.post('/login', login);

routes.use(tokenValidation);

routes.get('/', users.home);
routes.get('/perfil', users.profile);
routes.put('/editarUsuario', users.updateUser);
routes.post('/cadastrarCliente', clients.registerClient);
routes.get('/clientes', clients.listClients);
routes.put('/editarCliente/:clienteId', clients.updateClient);
routes.get('/clientes/:clienteId', clients.clientDetails);
routes.get('/cobrancas', charges.listCharges);
routes.post('/cadastrarCobranca', charges.registerCharges);
routes.get('/cobrancas/:cobrancaId', charges.chargeDetails);
routes.put('/editarCobranca/:cobrancaId', charges.updateCharge);
routes.delete('/deletarCobranca/:cobrancaId', charges.deleteCharge);
 
module.exports = routes;

