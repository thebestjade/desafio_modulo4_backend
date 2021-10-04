function cpfValidation(cpf) {

  let isTrue = true;
  let messageError = '';

  if (isNaN(cpf) || cpf.includes(".") || cpf.includes("e")) {

    isTrue = false;
    messageError = 'O cpf deve conter apenas números, sem letras e/ou pontuações';

    return { isTrue, messageError };
  }

  if (cpf.length !== 11) {
    isTrue = false;
    messageError = 'O cpf deve conter 11 caracteres';

    return { isTrue, messageError };
  }

  return { isTrue, messageError };
}


module.exports = cpfValidation;