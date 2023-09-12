const nome = document.querySelector('#name')
const email = document.getElementById("email");
const textMessage = document.querySelector('.error');
const cpf = document.querySelector('#cpf');
console.log(nome.value)

function enviarFormulario(e) {
  e.preventDefault();
  const nomeValido = verificarNome();
  const emailValido = validateEmail(email.value);
  const cpfValido = cpfValid(cpf.value);

  if (nomeValido && emailValido && cpfValido) {
    return console.log('enviado com sucesso')
  } else {
    return console.log('preencha todos os campos')
  }
}

function verificarNome() {
  const nomeValue = nome.value
  if (nomeValue !== "") {
    return true
  } else {
   return false
  }
}


function validateEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(String(email).toLowerCase())) {
    return true
  } else {
    alert('Email invalido')
    return false
  }
}


function cpfSplit(cpf) {
  if (typeof cpf === 'number') cpf = cpf.toString();
  cpf = cpf.replace('-', '');
  cpf = cpf.replaceAll('.', '');

  if (cpf.length !== 11) return alert('cpf invalido');
  return cpf.split('').map(Number);
}

function remainder(array, cpfSplitted) {
  let checksumDigit = 0;
  for (let index = 0; index < array.length; index++) {
    checksumDigit += (array[index] * cpfSplitted[index]);
  }
  const remainder = checksumDigit % 11;
  return remainder;
}

function returnVerifyingDigit(remainder) {
  let checkerDigit = 0;
  if (remainder < 2 || remainder === 11) checkerDigit = 0;
  else checkerDigit = 11 - remainder;
  return checkerDigit;
}

function invalidType(digit, cpfSplitted, index) {
  return digit !== cpfSplitted[index];
}

function cpfValid(cpf) {
  const arrayMultipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const cpfSplitted = cpfSplit(cpf);
  if (!cpfSplitted) { return false; }

  const remainderOne = remainder(arrayMultipliers, cpfSplitted);
  let checkerDigitOne = returnVerifyingDigit(remainderOne);
  if (invalidType(checkerDigitOne, cpfSplitted, 9)) return false;

  arrayMultipliers.unshift(11);
  const remainderTwo = remainder(arrayMultipliers, cpfSplitted);
  let checkerDigitTwo = returnVerifyingDigit(remainderTwo);
  if (invalidType(checkerDigitTwo, cpfSplitted, 10)) return false;

  return true

}

