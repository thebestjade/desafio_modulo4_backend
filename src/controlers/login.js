const knex = require('../connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_secret = require('../jwt_secret');
const loginSchema = require('../yup_validations/loginSchema');

const login = async (req, res) => {
  const { email, bodyPassword } = req.body;
  try {

    await loginSchema.validate(req.body);

    const user = await knex('users').where({ email }).first();

    if (!user) {
      return res.status(404).json("Usuário não cadastrado");
    }

    const verifiedPassword = await bcrypt.compare(bodyPassword, user.password);

    if (!verifiedPassword) {
      return res.status(400).json("Email e/ou senha incorreto");
    }

    const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "1h" });

    const { password, ...userData } = user;

    return res.status(200).json({ userData, token });

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = login;