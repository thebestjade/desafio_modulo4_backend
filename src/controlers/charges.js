const knex = require('../connection');
const registerChargeSchema = require('../yup_validations/registerChargesSchema');

const registerCharges = async (req, res) => {
  const { user } = req;
  const { clienteId, descricao, status, valor, vencimento } = req.body;

  try {

    const client = await knex('clients').where({ user_id: user.id }).where({ id: clienteId }).first();

    if (!client) {
      return res.status(400).json("Cliente não cadastrado");
    }

    await registerChargeSchema.validate(req.body);
    const convertedValue = valor.replace(".", '').replace(",",".")
    const registeredCharge = await knex('charges').insert({
      client_id: clienteId,
      description: descricao,
      status,
      value: convertedValue,
      due_date: vencimento
    });

    if (!registeredCharge) {
      return res.status(400).json("Não foi possível cadastrar a cobrança")
    }

    return res.status(200).json("Cobrança cadastrada com sucesso");

  } catch (error) {
    return res.status(400).json(error.message)
  }
};
const listCharges = async (req, res) => {
  const { user } = req;

  try {
    const charges = await knex('charges')
      .select('charges.id', 'clients.name', 'charges.description', 'charges.value', 'charges.status', 'charges.due_date')
      .leftJoin('clients', 'charges.client_id', 'clients.id')
      .where({ user_id: user.id });

    if (!charges.length) {
      return res.status(400).json("Você não possui cobranças cadastradas")
    }

    for (let charge of charges) {
      if (charge.status === "pendente") {
        const convertedDueDate = new Date(charge.due_date).getTime();
        const day = new Date().getDate();
        const month = new Date().getMonth();
        const year = new Date().getFullYear();
        const todaysDate = new Date(year, month, day).getTime();
        if (convertedDueDate < todaysDate) {
          charge.status = "vencido"
        }
      }
    }

    return res.status(200).json(charges);
  } catch (error) {
    return res.status(400).json(error.message)
  }
};

module.exports = {
  registerCharges,
  listCharges
}