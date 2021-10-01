function cpfValidation(cpf) {

  let isTrue = true;
  let messageError = '';

  if (isNaN(cpf)) {

    isTrue = false;
    messageError = 'O cpf deve conter apenas números, sem pontuações';

    return { isTrue, messageError };
  }

  if (cpf.length !== 11) {
    isTrue = false;
    messageError = 'O cpf deve conter 11 caracteres';

    return { isTrue, messageError };
  }

  if (cpf.includes(".")) {
    isTrue = false;
    messageError = 'Insira um cpf válido e sem pontuações';

    return { isTrue, messageError };
  }

  if (cpf.includes("e")) {
    isTrue = false;
    messageError = 'O cpf deve conter apenas números, sem pontuações';

    return { isTrue, messageError };
  }

  return { isTrue, messageError };
}


module.exports = cpfValidation;