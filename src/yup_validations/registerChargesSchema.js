const yup = require('./config');

const registerChargeSchema = yup.object().shape({
  clienteId: yup.number().required(),
  descricao: yup.string().required(),
  status: yup.string().required(),
  valor: yup.number().required(),
  vencimento: yup.string().required()
});

module.exports = registerChargeSchema;