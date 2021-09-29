const knex = require('../connection');
const registerClientSchema = require('../yup_validations/registerClientSchema');

const registerClient = async (req, res) => {
  const { user } = req;
  const { nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado } = req.body;

  try {

    await registerClientSchema.validate(req.body);

    const client = await knex('clients').where({ email }).first();

    if (client) {
      return res.status(400).json("Cliente já cadastrado")
    }

    const registeredClient = await knex('clients').insert({
      user_id: user.id,
      name: nome,
      email,
      cpf,
      phone: telefone,
      cep,
      public_place: logradouro,
      complement: complemento,
      district: bairro,
      city: cidade,
      uf: estado
    }).returning('*');

    if (!registeredClient) {
      return res.status(400).json("Não foi possível cadastrar o cliente")
    }

    return res.status(200).json("Cliente cadstrado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message)
  }
};

module.exports = {
  registerClient
};