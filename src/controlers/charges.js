const knex = require('../connection');
const registerChargeSchema = require('../yup_validations/registerChargesSchema');
const { valueConverted } = require('../utils/formateValidation');

const registerCharges = async (req, res) => {
  const { user } = req;
  const { clientId, description, status, value, due_date } = req.body;

  try {
    
    const client = await knex('clients').where({ user_id: user.id }).where({ id: clientId }).first();

    if (!client) {
      return res.status(400).json("Cliente não cadastrado");
    }

    await registerChargeSchema.validate(req.body);
    
    const registeredCharge = await knex('charges').insert({
      client_id: clientId,
      description,
      status: status.toLowerCase(),
      value: valueConverted(value),
      due_date
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
  const { status } = req.query;

  try {
    let charges = await knex('charges')
      .select('charges.id', 'clients.name', 'charges.description', 'charges.value', 'charges.status', 'charges.due_date')
      .leftJoin('clients', 'charges.client_id', 'clients.id')
      .where({ user_id: user.id });

    if (!charges.length) {
      return res.status(400).json("Você não possui cobranças cadastradas")
    }

    for (let charge of charges) {
      if (charge.status.toLowerCase() === "pendente") {
        charge.status = charge.status.toLowerCase();
        const convertedDueDate = new Date(charge.due_date).getTime();
        const todaysDate = new Date().getTime();
        
        if (convertedDueDate < todaysDate) {
          charge.status = "vencido"
        }
      }
    }

    if(status){
      charges = charges.filter(charge => charge.status.toLowerCase() === status.toLowerCase());

      if (!charges.length) {
        return res.status(400).json(`Você não possui cobranças com status = ${status}`);
      }
    }

    return res.status(200).json(charges);
  } catch (error) {
    return res.status(400).json(error.message)
  }
};

const chargeDetails = async (req, res) => {
  const { chargeId } = req.params;
  const { user } = req;

  try {
    const charge = await knex('charges')
      .select('charges.id', 'clients.name', 'charges.description', 'charges.value', 'charges.status', 'charges.due_date')
      .leftJoin('clients', 'charges.client_id', 'clients.id')
      .where({ user_id: user.id }).where('charges.id', chargeId).first();

    if (!charge) {
      return res.status(400).json("Cobrança não cadastrada");
    }

    return res.status(200).json(charge);

  } catch (error) {
    return res.status(400).json(error.message)
  }

}

const updateCharge = async (req, res) => {
  let { clientId, description, status, value, due_date } = req.body;
  const { chargeId } = req.params;
  const { user } = req;

  try {

    const charge = await knex('charges')
      .select('charges.id', 'clients.name', 'charges.description', 'charges.value', 'charges.status', 'charges.due_date')
      .leftJoin('clients', 'charges.client_id', 'clients.id')
      .where({ user_id: user.id }).where('charges.id', chargeId).first();

    if (!charge) {
      return res.status(400).json("Cobrança não cadastrada");
    }

    await registerChargeSchema.validate(req.body);

    const client = await knex('clients').where({ user_id: user.id }).where({ id: clientId }).first();

    if (!client) {
      return res.status(400).json("Cliente não cadastrado");
    }

    const updatedCharge = await knex('charges').where({ id: chargeId }).update({
      client_id: clientId,
      description,
      status: status.toLowerCase(),
      value: valueConverted(value),
      due_date
    });

    if (!updatedCharge) {
      return res.status(400).json("Não foi possível atualizar a cobrança");
    }

    return res.status(200).json("Cobrança atualizada com sucesso");

  } catch (error) {
    return res.status(400).json(error.message)
  }

};

const deleteCharge = async (req, res) => {
  const { chargeId } = req.params;
  const { user } = req;

  try {

    const charge = await knex('charges')
      .select('charges.id', 'clients.name', 'charges.description', 'charges.value', 'charges.status', 'charges.due_date')
      .leftJoin('clients', 'charges.client_id', 'clients.id')
      .where({ user_id: user.id }).where('charges.id', chargeId).first();

    if (!charge) {
      return res.status(400).json("Cobrança não cadastrada");
    }

    const deletedCharge = await knex('charges').del().where({ id: chargeId });

    if (!deletedCharge) {
      return res.status(400).json("Não foi possível deletar a cobrança");
    }

    return res.status(200).json("Cobrança deletada com sucesso");

  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  registerCharges,
  listCharges,
  updateCharge,
  chargeDetails,
  deleteCharge
}