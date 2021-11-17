const express = require('express');
const login = require('./controlers/login');
const users = require('./controlers/users');
const clients = require('./controlers/clients');
const charges = require('./controlers/charges');
const tokenValidation = require('./filters/tokenValidation');

const routes = express();

routes.post('/register', users.registerUser);
routes.post('/login', login);

routes.use(tokenValidation);

routes.get('/', users.home);
routes.get('/profile', users.profile);
routes.put('/profile', users.updateUser);
routes.post('/register/clients', clients.registerClient);
routes.get('/clients', clients.listClients);
routes.put('/clients/:clientId', clients.updateClient);
routes.get('/clients/:clientId', clients.clientDetails);
routes.get('/charges', charges.listCharges);
routes.post('/register/charges', charges.registerCharges);
routes.get('/charges/:chargeId', charges.chargeDetails);
routes.put('/charges/:chargeId', charges.updateCharge);
routes.delete('/charges/:chargeId', charges.deleteCharge);
 
module.exports = routes;

