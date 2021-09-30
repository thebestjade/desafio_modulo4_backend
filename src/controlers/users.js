const knex = require('../connection');
const bcrypt = require('bcrypt');
const registerUserSchema = require('../yup_validations/registerUserSchema');

const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {

    await registerUserSchema.validate(req.body);

    const user = await knex('users').where({ email }).first();

    if (user) {
      return res.status(400).json("Usuário já cadastrado")
    }

    const criptPassword = await bcrypt.hash(senha, 10);

    const registeredUser = await knex('users').insert({
      name: nome,
      email,
      password: criptPassword
    });

    if (!registeredUser) {
      return res.status(400).json("O usuário não pôde ser cadastrado");
    }

    return res.status(200).json("Usuário cadastrado com sucesso");

  } catch (error) {
    return res.status(400).json(error.message)
  }
};

const home = async (req, res) => {
  const { user } = req;

  try {
    const clients = await knex('clients').where({ user_id: user.id });

    if (!clients) {
      return res.status(404).json("Não há clientes cadastrados");
    };

    return res.status(200).json(clients);

  } catch (error) {
    return res.status(400).json(error.message)
  }
};

const profile = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
  let { nome, email, senha, cpf, telefone } = req.body;
  const { user } = req;

  try {
    await registerUserSchema.validate(req.body);

    if (senha) {
      senha = await bcrypt.hash(senha, 10);
    }

    if (email !== user.email) {
      const existedEmail = await knex('users').where({ email }).first();

      if (existedEmail) {
        return res.status(400).json("Email já cadastrado");
      }
    };

    if(cpf && isNaN(cpf)){
      return res.status(400).json('O cpf deve conter números')
    }

    if(cpf && cpf.length !== 11){
      return res.status(400).json('Insira um cpf válido e sem pontuações')
    }

    if (cpf && cpf !== user.cpf) {
      
      const existedCpf = await knex('users').where({ cpf }).first();

      if (existedCpf) {
        return res.status(400).json("Cpf já cadastrado");
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