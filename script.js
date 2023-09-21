const mensagemErroEmail = document.querySelector('.mensagem-erro-email')
const mensagemErroCpf = document.querySelector('.mensagem-erro-cpf')
const mensagemErroCep = document.querySelector('.mensagem-erro-cep')
const mensagemErroNome = document.querySelector('.mensagem-erro-nome')
//Dados pessoais
const nome = document.querySelector('#name')
const emailInput = document.getElementById("email");
const textMessage = document.querySelector('.error');
const cpfInput = document.querySelector('#cpf');

//Dados Residenciais
const cepInput = document.querySelector('#cep');
const rua = document.getElementById('rua');
const bairro = document.getElementById('bairro')
const cidade = document.getElementById('cidade')
const uf = document.getElementById('uf');

function enviarFormulario(e) {
  e.preventDefault();
  const nomeValido = verificarNome();
  const emailValido = validateEmail(emailInput.value);
  const cpfValido = cpfValid(cpfInput.value);
  const cepValido = consultaCep()


  if (nomeValido && emailValido && cpfValido && cepValido) {
    cepInput.classList.remove('erro-cep')
    return console.log('enviado com sucesso')
  } else {
    cepInput.classList.add('erro-cep')
    alert('Preencha todos os campos')
    return console.log('preencha todos os campos')
  }
}

function verificarNome() {
  const nomeValue = nome.value
  const nomeRegex = /\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi;
  if (nomeValue === '') {
    mensagemErroNome.classList.add('d-block')
    mensagemErroNome.textContent = 'Por favor preencha o campo'
  } 
  else if (nomeValue !== "" && nomeRegex.test(nomeValue)) {
    mensagemErroNome.classList.remove('d-block')
    return true
  } 
  else {
    mensagemErroNome.textContent = 'Digite um nome válido'
    mensagemErroNome.classList.add('d-block')
    return false
  }
}

function validateEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(emailInput.value === '') {
    mensagemErroEmail.classList.add('d-block')
    mensagemErroEmail.textContent = 'Por favor preencha o campo'
  } 
  else if (regex.test(String(email).toLowerCase())) {
    mensagemErroEmail.classList.remove('d-block')
    return true
  } 
  else {
    mensagemErroEmail.textContent = 'Digite um email válido'
    mensagemErroEmail.classList.add('d-block')
    return false
  }
}



function cpfSplit(cpf) {
  if(cpf.length === 0) {
    mensagemErroCpf.classList.add('d-block')
    mensagemErroCpf.textContent = 'Por favor preencha o campo'
    return false;
  }

  if (typeof cpf === 'number') cpf = cpf.toString();
  cpf = cpf.replace('-', '');
  cpf = cpf.replaceAll('.', '');
  if (cpf.length !== 11) {
    mensagemErroCpf.classList.add('d-block')
    mensagemErroCpf.textContent = 'CPF deve conter 11 digitos'
    return false;
  }
  mensagemErroCpf.classList.remove('d-block')
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
  if(cpf.value === '') {
    mensagemErroCpf.textContent = 'Por favor preencha o campo'
    console.log('value 0')
    return false
  }
  const arrayMultipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const cpfSplitted = cpfSplit(cpf);
  if (!cpfSplitted) { return false; }

  const remainderOne = remainder(arrayMultipliers, cpfSplitted);
  let checkerDigitOne = returnVerifyingDigit(remainderOne);
  if (invalidType(checkerDigitOne, cpfSplitted, 9)) {
    mensagemErroCpf.classList.add('d-block')
    mensagemErroCpf.textContent = 'Digite um cpf válido'
    return false;
  }
  
  arrayMultipliers.unshift(11);
  const remainderTwo = remainder(arrayMultipliers, cpfSplitted);
  let checkerDigitTwo = returnVerifyingDigit(remainderTwo);
  if (invalidType(checkerDigitTwo, cpfSplitted, 10)) {
    mensagemErroCpf.classList.add('d-block')
    mensagemErroCpf.textContent = 'Digite um cpf válido'
    return false;
  } 
  mensagemErroCpf.classList.remove('d-block')

  return true
}

cepInput.addEventListener('input', consultaCep);

function consultaCep() {
  let cep = cepInput.value.replace(/\D/g, '');
  if (cep.length === 0) {
  } else if (cep.length !== 8) {
  }

  if (cep.length === 8) {
    let url = `https://viacep.com.br/ws/${cep}/json/`;
    fetch(url)
      .then(res => res.json())
      .then(response => {
        if (!response.erro) {
          completarCampos(response);
          habilitaInput(true)
        } else {
          limpaFormulárioCep();
          habilitaInput(false)
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

function completarCampos(dados) {
  rua.value = dados.logradouro;
  bairro.value = dados.bairro;
  cidade.value = dados.localidade;
  uf.value = dados.uf;
}

function limpaFormulárioCep() {
  rua.value = "";
  bairro.value = "";
  cidade.value = "";
  uf.value = "";
}


function habilitaInput(desabilita) {
  rua.disabled = desabilita;
  bairro.disabled = desabilita;
  cidade.disabled = desabilita;
  uf.disabled = desabilita;
}

let cpfCleave = new Cleave('#cpf', {
  delimiters: ['.', '.', '-'],
  blocks: [3, 3, 3, 2],
  numericOnly: true
});

let cepCleave = new Cleave('#cep', {
  delimiters: ['-'],
  blocks: [5, 3],
  numericOnly: true
});



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




