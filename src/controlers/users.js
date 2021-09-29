const knex = require('../connection');
const bcrypt = require('bcrypt');
const regiterUserSchema = require('../yup_validations/registerUserSchema');

const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {

    await regiterUserSchema.validate(req.body);

    const user = await knex('users').where({ email }).first();

    if (user) {
      return res.status(400).json("Usuário já cadastrado")
    }

    const criptPassword = await bcrypt.hash(senha, 10);

    const registeredUser = await knex('users').insert({
      name: nome,
      email,
      password: criptPassword
    }).returning('*');

    if (!registeredUser) {
      return res.status(400).json("O usuário não pôde ser cadastrado");
    }

    return res.status(200).json(registeredUser);

  } catch (error) {
    return res.status(400).json(error.message)
  }
};

const home = async (req, res) => {
  const { user } = req;

  try {
    const clients = await knex('clients').where({ user_id: user.id });
    // const charges = await knex('charges').where({ user_id: user.id });

    if (!clients) {
      return res.status(404).json("Não há clientes cadastrados");
    };

    // if(!charges) {
    //   return res.status(404).json("Não há cobranças cadastradas");
    // };

    return res.status(200).json({ clients, charges });

  } catch (error) {
    return res.status(400).json(error.message)
  }
};

const profile = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
  const { nome, email, senha, cpf, telefone } = req.body;
  const { user } = req;

  if (!nome && !email && !senha && !cpf && !telefone) {
    return res.status(404).json('É obrigatório informar ao menos um campo para atualização');
  }

  try {

    if (senha) {
      senha = await bcrypt.hash(senha, 10);
    }

    if (email && email !== user.email) {
      const existedEmail = await knex('users').where({ email }).frist();

      if (existedEmail) {
        return res.status(400).json("Email já cadastrado");
      }
    };

    const updatedUser = await knex('users').where({ id: user.id }).update({
      name: nome,
      email,
      password: senha,
      cpf,
      phone: telefone
    });

    if(!updatedUser){
      return res.status(400).json("Não foi possível atualizar o usuário");
    }

    return res.status(200).json("Usuário atualizado com sucesso")

  } catch (error) {
    return res.status(400).json(error.message)
  }
};

module.exports = {
  registerUser,
  home,
  profile,
  updateUser
}