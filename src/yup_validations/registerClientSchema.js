const yup = require('./config');

const registerClientSchema = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  cpf: yup.string().required(),
  telefone: yup.string().required()
});

module.exports = registerClientSchema;