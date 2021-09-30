function cpfValidation(cpf, res) {

  if(isNaN(cpf)){
    return res.status(400).json('O cpf deve conter apenas números, sem pontuações')
  }

  if(cpf.length !== 11){
    return res.status(400).json('O cpf deve conter 11 caracteres')
  }

  if(cpf.includes(".")){
    return res.status(400).json('Insira um cpf válido e sem pontuações')
  }

  if(cpf.includes("e")){
    return res.status(400).json('O cpf deve conter apenas números, sem pontuações')
  }
}


module.exports = cpfValidation;