function formateValidation(formatedValue) {

  let isTrue = true;
  let messageError = '';

  if (formatedValue.length !== 11) {

    isTrue = false;
    messageError = 'Cpf e/ou telefone inválido';

    return { isTrue, messageError };
  }

  return { isTrue, messageError };
}


module.exports = formateValidation;