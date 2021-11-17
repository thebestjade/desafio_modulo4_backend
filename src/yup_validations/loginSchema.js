const yup = require('./config.js');

const loginSchema = yup.object().shape({
  email: yup.string().required().email(),
  bodyPassword: yup.string().required()
});

module.exports = loginSchema;