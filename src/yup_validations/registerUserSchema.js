const yup = require('./config');

const registerUserSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(5)
});

module.exports = registerUserSchema;