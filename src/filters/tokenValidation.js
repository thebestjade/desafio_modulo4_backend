const knex = require('../connection');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../jwt_secret');

const tokenValidation = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json("Não autorizado")
  }

  try {

    const token = authorization.replace('Bearer', '').trim();

    const { id } = jwt.verify(token, jwt_secret);

    const user = await knex('users').where({ id }).select('id', 'name', 'email', 'cpf', 'phone').first();

    if(!user){
      return res.status(404).json("Usuário não encontrado")
    }
    
    req.user = user;

    next();

  } catch (error) {
    return res.status(400).json(error.message)
  }
};

module.exports = tokenValidation;