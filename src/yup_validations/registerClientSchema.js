const yup = require('./config');

const registerClientSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  cpf: yup.string().required(),
  phone: yup.string().required()
});

module.exports = registerClientSchema;