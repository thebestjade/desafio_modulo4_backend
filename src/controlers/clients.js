const knex = require('../connection');
const registerClientSchema = require('../yup_validations/registerClientSchema');
const formateValidation = require('../utils/formateValidation');

const registerClient = async (req, res) => {
  const { user } = req;
  let { nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado } = req.body;

  try {

    await registerClientSchema.validate(req.body);

    const client = await knex('clients').where({ email }).where({ user_id: user.id }).first();

    if (client) {
      return res.status(400).json("Você já possui um cliente cadastrado com este email")
    };

    cpf = cpf.replace(/\D/g, '');
    let { isTrue: cpfIsTrue, messageError: cpfMessageError } = formateValidation(cpf);

    if (!cpfIsTrue) {
      return res.status(400).json(cpfMessageError)
    }

    const existedCpf = await knex('clients').where({ cpf }).where({ user_id: user.id }).first();

    if (existedCpf) {
      return res.status(400).json("Você já possui um cliente cadastrado com este cpf");
    };

    telefone = telefone.replace(/\D/g, '');
    let { isTrue, messageError } = formateValidation(telefone);

    if (!isTrue) {
      return res.status(400).json(messageError)
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
  const { status } = req.query;

  try {

    let clients = await knex('clients')
      .select('clients.id', 'name', 'email', 'phone', knex.raw('sum(charges.value) as totalCharges'), knex.raw(`sum(case when charges.status = 'pago' then charges.value else null end) as totalChargesPaid`))
      .leftJoin('charges', 'clients.id', 'charges.client_id')
      .where({ user_id: user.id })
      .groupBy('clients.id', 'name', 'email', 'phone')
      .returning('*');

    if (!clients.length) {
      return res.status(400).json("Você não possui clientes");
    }

    clients = clients.map(async (client) => {
      const overdueCharge = await knex('charges').where({ client_id: client.id, status: "pendente" })
        .where('due_date', '<', new Date())
        .count('*')
        .first()
      console.log(overdueCharge)
      if (overdueCharge.count > 0) {
        client.status = "inadimplente"
      } else {
        client.status = "em dia"
      }
      return client
    })
    clients = await Promise.all(clients);

    if(status){
      clients = clients.filter(client => client.status === status);

      if (!clients.length) {
        return res.status(400).json(`Você não possui clientes com status = ${status}`);
      }
    }

    return res.status(200).json(clients)
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
  let { nome, email, cpf, telefone, cep, logradouro, complemento, bairro, cidade, estado
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
      const existedEmail = await knex('clients').where({ email }).where({ user_id: user.id }).first();

      if (existedEmail) {
        return res.status(400).json("Email já cadastrado");
      }
    };

    cpf = cpf.replace(/\D/g, '');

    if (cpf !== client.cpf) {

      let { isTrue: cpfIsTrue, messageError: cpfMessageError } = formateValidation(cpf);

      if (!cpfIsTrue) {
        return res.status(400).json(cpfMessageError);
      }

      const existedCpf = await knex('clients').where({ cpf }).where({ user_id: user.id }).first();

      if (existedCpf) {
        return res.status(400).json("Cpf já cadastrado");
      }
    };

    telefone = telefone.replace(/\D/g, '');

    if (telefone !== client.phone) {

      let { isTrue, messageError } = formateValidation(telefone);

      if (!isTrue) {
        return res.status(400).json(messageError);
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