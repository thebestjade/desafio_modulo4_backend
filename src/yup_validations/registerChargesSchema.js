const yup = require('./config');

const registerChargeSchema = yup.object().shape({
  clientId: yup.string().required(),
  description: yup.string().required(),
  status: yup.string().required(),
  value: yup.string().required(),
  due_date: yup.string().required()
});

module.exports = registerChargeSchema;