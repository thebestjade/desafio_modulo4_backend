const yup = require('./config');

const registerChargeSchema = yup.object().shape({
  clienteId: yup.string().required(),
  descricao: yup.string().required(),
  status: yup.string().required(),
  valor: yup.string().required(),
  vencimento: yup.string().required()
});

module.exports = registerChargeSchema;