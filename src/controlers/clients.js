const knex = require('../connection');
const registerClientSchema = require('../yup_validations/registerClientSchema');
const cpfValidation = require('../utils/cpfValidation');

const registerClient = async (req, res) => {
  const { user } = req;
  const { nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado } = req.body;

  try {

    await registerClientSchema.validate(req.body);

    const client = await knex('clients').where({ email }).first();

    if (client) {
      return res.status(400).json("Você já possui um cliente cadastrado com este email")
    };

    const { isTrue, messageError } = cpfValidation(cpf);

    if (!isTrue) {
      return res.status(400).json(messageError)
    }

    const existedCpf = await knex('clients').where({ cpf }).first();

    if (existedCpf) {
      return res.status(400).json("Você já possui um cliente cadastrado com este cpf");
    };

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
    });

    if (!registeredClient) {
      return res.status(400).json("Não foi possível cadastrar o cliente")
    }

    return res.status(200).json("Cliente cadastrado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message)
  }
};

const listClients = async (req, res) => {
  const { user } = req;
  
  try {

    const clients = await knex('clients').select('name', 'email', 'phone').where({user_id: user.id}).bodyreturning('*');

    if (!clients) {
      return res.status(400).json("Cliente não cadastrado");
    }


    return res.status(200).json({ clients })
  } catch (error) {
    return res.status(400).json(error.message)
  }
};

const clientDetails = async (req, res) => {
  const { clienteId } = req.params;
  const { user } = req;

  try {
    const client = await knex('clients').where({ user_id: user.id }).where({ id: clienteId }).first();

    if (!client) {
      return res.status(400).json("Cliente não cadastrado");
    }

    const clientCharges = await knex('charges').where({ client_id: clienteId }).returning('*');

    if (!clientCharges) {
      return res.status(400).json("O cliente não possui cobranças cadastradas");
    }

    return res.status(200).json({ client, clientCharges });

  } catch (error) {
    return res.status(400).json(error.message)
  }

};

const updateClient = async (req, res) => {
  const { nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado
  } = req.body;
  const { user } = req;
  const { clienteId } = req.params;

  try {

    const client = await knex('clients').where({ user_id: user.id }).where({ id: clienteId }).first();

    if (!client) {
      return res.status(400).json("Cliente não cadastrado");
    }

    await registerClientSchema.validate(req.body);

    if (email !== client.email) {
      const existedEmail = await knex('clients').where({ email }).first();

      if (existedEmail) {
        return res.status(400).json("Email já cadastrado");
      }
    };

    if (cpf !== client.cpf) {

      const { isTrue, messageError } = cpfValidation(cpf);

      if (!isTrue) {
        return res.status(400).json(messageError);
      }

      const existedCpf = await knex('clients').where({ cpf }).first();

      if (existedCpf) {
        return res.status(400).json("Cpf já cadastrado");
      }
    };

    const updatedClient = await knex('clients').where({ id: clienteId }).update({
      name: nome,
      email,
      phone: telefone,
      cpf,
      cep,
      public_place: logradouro,
      complement: complemento,
      district: bairro,
      city: cidade,
      uf: estado
    });

    if (!updatedClient) {
      return res.status(400).json("Não foi possível atualizar o cliente");
    }

    return res.status(200).json("Cliente atualizado com sucesso")

  } catch (error) {
    return res.status(400).json(error.message)
  }
}
module.exports = {
  registerClient,
  listClients,
  clientDetails,
  updateClient
};