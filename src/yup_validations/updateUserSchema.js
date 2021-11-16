const yup = require('./config');

const updateUserSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email()
});

module.exports = updateUserSchema;