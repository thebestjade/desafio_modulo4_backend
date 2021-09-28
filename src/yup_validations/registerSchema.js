const yup = require('./config');

const registerSchema = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  senha: yup.string().required().min(5)
});

module.exports = registerSchema;