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
  const cepValido = consultaCep()
  

  if (nomeValido && emailValido && cpfValido && cepValido) {
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

const cepInput = document.querySelector('#cep');
const rua = document.getElementById('rua');
const bairro = document.getElementById('bairro')
const cidade = document.getElementById('cidade')
const uf = document.getElementById('uf');

cepInput.addEventListener('input', consultaCep);

function consultaCep() {
  let cep = cepInput.value.replace(/\D/g, '');
  if (cep.length === 8) {
    let url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
          completarCampos(data);
          inputDesabilitado()
        } else {
          inputHabilitado()
          limpaFormulárioCep();
          alert("CEP não encontrado.");
        }
      })
      .catch(error => {
        console.error("Ocorreu um erro na consulta:", error);
        limpaFormulárioCep();
      });
  } else {
    limpaFormulárioCep();
  }
}

function limpaFormulárioCep() {
  rua.value = "";
  bairro.value = "";
  cidade.value = "";
  uf.value = "";
}

function completarCampos(dados) {
  rua.value = dados.logradouro;
  bairro.value = dados.bairro;
  cidade.value = dados.localidade;
  uf.value = dados.uf;
}

function inputHabilitado() {
  rua.disabled = false;
  bairro.disabled = false;
  cidade.disabled = false;
  uf.disabled = false;
}
function inputDesabilitado() {
  rua.disabled = true;
  bairro.disabled = true;
  cidade.disabled = true;
  uf.disabled = true;
}




// function meu_callback(conteudo) {
//   if (!("erro" in conteudo)) {
//     //Atualiza os campos com os valores.
//     document.getElementById('rua').value = (conteudo.logradouro);
//     document.getElementById('bairro').value = (conteudo.bairro);
//     document.getElementById('cidade').value = (conteudo.localidade);
//     document.getElementById('uf').value = (conteudo.uf);
//   } //end if.
//   else {
//     //CEP não Encontrado.
//     limpa_formulário_cep();
//     alert("CEP não encontrado.");
//   }
// }

// function pesquisacep(valor) {
//   //Nova variável "cep" somente com dígitos.
//   const cep = valor.replace(/\D/g, '');

//   //Verifica se campo cep possui valor informado.
//   if (cep != "") {
//     //Expressão regular para validar o CEP.
//     const validacep = /^[0-9]{8}$/;

//     //Valida o formato do CEP.
//     if (validacep.test(cep)) {

//       //Preenche os campos com "..." enquanto consulta webservice.
//       document.getElementById('rua').value = "...";
//       document.getElementById('bairro').value = "...";
//       document.getElementById('cidade').value = "...";
//       document.getElementById('uf').value = "...";

//       //Cria um elemento javascript.
//       const script = document.createElement('script');

//       //Sincroniza com o callback.
//       script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

//       //Insere script no documento e carrega o conteúdo.
//       document.body.appendChild(script);

//     } //end if.
//     else {
//       //cep é inválido.
//       limpa_formulário_cep();
//       alert("Formato de CEP inválido.");
//     }
//   } //end if.
//   else {
//     //cep sem valor, limpa formulário.
//     limpa_formulário_cep();
//   }
// };




