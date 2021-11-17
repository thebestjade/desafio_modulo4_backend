function formateValidation(formatedValue) {

  let isTrue = true;
  let messageError = '';

  if (formatedValue.length !== 11) {

    isTrue = false;
    messageError = 'Cpf e/ou telefone inválido';

    return { isTrue, messageError };
  }

  return { isTrue, messageError };
};

function valueConverted(value) {
  return value.replace(".", '').replace(",",".");
};

function convertedPhoneEndCpf(phoneOrCpf) {
  return phoneOrCpf.replace(/\D/g, '');
}


module.exports = {
  formateValidation,
  valueConverted,
  convertedPhoneEndCpf
};