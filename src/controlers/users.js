const knex = require("../connection");
const bcrypt = require("bcrypt");
const registerUserSchema = require("../yup_validations/registerUserSchema");
const updateUserSchema = require("../yup_validations/updateUserSchema");
const formateValidation = require("../utils/formateValidation");

const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    await registerUserSchema.validate(req.body);

    const user = await knex("users").where({ email }).first();

    if (user) {
      return res.status(400).json("Usuário já cadastrado");
    }

    const criptPassword = await bcrypt.hash(senha, 10);

    const registeredUser = await knex("users").insert({
      name: nome,
      email,
      password: criptPassword,
    });

    if (!registeredUser) {
      return res.status(400).json("Não foi possível cadastrar este usuário");
    }

    return res.status(200).json("Usuário cadastrado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const home = async (req, res) => {
  const { user } = req;
  let clientsUpToDate;
  let defaulterClients;
  let expectedCharges;
  let overdueCharges;
  let chargesPaid;

  try {
    let clients = await knex("clients")
      .select(
        "clients.id",
        knex.raw("sum(charges.value) as totalCharges"),
        knex.raw(
          `sum(case when charges.status = 'pago' then charges.value else null end) as totalChargesPaid`
        )
      )
      .leftJoin("charges", "clients.id", "charges.client_id")
      .where({ user_id: user.id })
      .groupBy("clients.id")
      .returning("*");

    if (!clients.length) {
      clientsUpToDate = 0;
      defaulterClients = 0;
    }

    clients = clients.map(async (client) => {
      const overdueCharge = await knex("charges")
        .where({ client_id: client.id, status: "pendente" })
        .where("due_date", "<", new Date())
        .count("*")
        .first();

      if (overdueCharge.count > 0) {
        client.status = "inadimplente";
      } else {
        client.status = "em dia";
      }
      return client;
    });

    clients = await Promise.all(clients);

    clientsUpToDate = clients.map((client) => client.status === "em dia");

    if (!clientsUpToDate.length === 0) {
      clientsUpToDate = 0;
    }

    defaulterClients = clients.map(
      (client) => client.status === "inadimplente"
    );

    if (!defaulterClients.length === 0) {
      defaulterClients = 0;
    }

    let charges = await knex("charges")
      .select("charges.id")
      .leftJoin("clients", "charges.client_id", "clients.id")
      .where({ user_id: user.id })
      .groupBy("charges.id")
      .returning("*");

    if (!charges.length) {
      expectedCharges = 0;
      overdueCharges = 0;
      chargesPaid = 0;
    }

    for (let charge of charges) {
      if (charge.status && charge.status.toLowerCase() === "pendente") {
        const convertedDueDate = new Date(charge.due_date).getTime();
        const todaysDate = new Date().getTime();

        if (convertedDueDate < todaysDate) {
          charge.status = "vencido";
        }
      }
    }

    expectedCharges = charges.map((charge) => charge.status === "pendente");
    if (!expectedCharges.length === 0) {
      expectedCharges = 0;
    }

    overdueCharges = charges.map((charge) => charge.status === "vencido");
    if (!overdueCharges.length === 0) {
      overdueCharges = 0;
    }

    chargesPaid = charges.map((charge) => charge.status === "pago");
    if (!chargesPaid.length === 0) {
      chargesPaid = 0;
    }

    return res
      .status(200)
      .json({
        clientsUpToDate,
        defaulterClients,
        expectedCharges,
        overdueCharges,
        chargesPaid,
      });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const profile = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
  let { nome, email, senha, cpf, telefone } = req.body;
  let updatedUserPassword;
  const { user } = req;

  try {
    await updateUserSchema.validate(req.body);

    if (email !== user.email) {
      const existedEmail = await knex("users").where({ email }).first();

      if (existedEmail) {
        return res.status(400).json("Email já cadastrado");
      }
    }

    if (cpf) {
      cpf = cpf.replace(/\D/g, "");

      const { isTrue, messageError } = formateValidation(cpf);

      if (!isTrue) {
        return res.status(400).json(messageError);
      }

      if (cpf !== user.cpf) {
        const existedCpf = await knex("users").where({ cpf }).first();

        if (existedCpf) {
          return res.status(400).json("Cpf já cadastrado");
        }
      }
    }

    if (telefone) {
      telefone = telefone.replace(/\D/g, "");

      const { isTrue, messageError } = formateValidation(telefone);

      if (!isTrue) {
        return res.status(400).json(messageError);
      }
    }

    if (senha) {
      if (senha.length >= 5) {
        senha = await bcrypt.hash(senha, 10);

        updatedUserPassword = await knex("users")
          .where({ id: user.id })
          .update({
            password: senha,
          });

        if (!updatedUserPassword) {
          return res
            .status(400)
            .json("Não foi possível atualizar a senha do usuário");
        }
      } else {
        return res
          .status(400)
          .json("A senha precisa ter no mínimo 5 caracteres");
      }
    }

    const updatedUser = await knex("users").where({ id: user.id }).update({
      name: nome,
      email,
      phone: telefone,
      cpf,
    });

    if (!updatedUser) {
      return res.status(400).json("Não foi possível atualizar o usuário");
    }

    return res.status(200).json("Usuário atualizado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  registerUser,
  home,
  profile,
  updateUser,
};
