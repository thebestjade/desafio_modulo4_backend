const knex = require('../connection');
const registerChargeSchema = require('../yup_validations/registerChargesSchema');

const registerCharges = async (req, res) => {
  const { user } = req;
  const { clienteId, descricao, status, valor, vencimento } = req.body;

  console.log(vencimento)
  try {
    
    const client = await knex('clients').where({ user_id: user.id }).where({ id: clienteId }).first();
    
    if (!client) {
      return res.status(400).json("Cliente não cadastrado");
    }
    await registerChargeSchema.validate();

    const registeredCharge = await knex('charges').insert({
      client_id: clienteId,
      description: descricao,
      status,
      value: valor,
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

};

module.exports = {
  registerCharges,
  listCharges
}