const alphabet = 'abcdefghijklmnopqrstuvwxyz';
let stateMatrix = {};
let wordList = [];
let currentState = 'q0';
let finalState = 'qAceito';

// Função para inicializar a matriz de transições
function initializeStateMatrix() {
  stateMatrix = {}; // Limpa a matriz de transições existente

  // Cria as transições para cada letra do alfabeto
  alphabet.split('').forEach((char, index) => {
    stateMatrix[`q${index}`] = {}; // Cria um novo estado
    alphabet.split('').forEach((nextChar) => {
      stateMatrix[`q${index}`][nextChar] = '-'; // Inicializa todas as transições como '-'
    });
  });

  // Estado de aceitação
  stateMatrix['qAceito'] = {};
  alphabet.split('').forEach((char) => {
    stateMatrix['qAceito'][char] = 'qAceito'; // Define o estado de aceitação
  });
}

// Função para renderizar a tabela de transições
function renderTransitionTable() {
  const tableContainer = document.getElementById('transition-table');
  tableContainer.innerHTML = ''; // Limpa a tabela existente

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');

  // Cria o cabeçalho da tabela com os estados e o alfabeto
  const headers = ['Estado Atual', ...alphabet.split('')];
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // Preenche a tabela com as transições de estado
  Object.keys(stateMatrix).forEach((state) => {
    const row = document.createElement('tr');

    const stateCell = document.createElement('td');
    stateCell.textContent = state;
    row.appendChild(stateCell);

    alphabet.split('').forEach((symbol) => {
      const cell = document.createElement('td');
      cell.textContent = stateMatrix[state][symbol] || '-';
      row.appendChild(cell);
    });

    table.appendChild(row);
  });

  tableContainer.appendChild(table);
}

// Função para adicionar um novo token à lista de tokens
function addToken(token) {
  if (!wordList.includes(token)) { // Verifica se o token já existe
    wordList.push(token); // Adiciona o token à lista
    renderTokenList(); // Atualiza a lista de tokens na tela
  }
}

// Função para renderizar a lista de tokens
function renderTokenList() {
  const tokenListElement = document.getElementById('token-list');
  tokenListElement.innerHTML = ''; // Limpa a lista de tokens

  // Cria os itens de token na lista
  wordList.forEach((token, index) => {
    const li = document.createElement('li');
    li.textContent = token;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.onclick = () => {
      wordList.splice(index, 1); // Remove o token da lista
      renderTokenList(); // Atualiza a lista de tokens
    };

    li.appendChild(removeBtn);
    tokenListElement.appendChild(li);
  });
}

// Função para analisar o texto inserido e verificar se os tokens são aceitos
function analyzeText() {
  const input = document.getElementById('input').value.trim().toLowerCase();
  const tokens = input.split(' '); // Divide o texto em tokens (palavras)
  const output = document.getElementById('output');
  output.innerHTML = ''; // Limpa a saída

  // Para cada token, verifica se ele é aceito ou rejeitado
  tokens.forEach((token) => {
    if (wordList.includes(token)) {
      output.innerHTML += `Token "${token}": <span style="color: green;">Reconhecido</span><br>`;
      updateTransitionTable(token); // Atualiza a tabela de transições com o token
    } else {
      output.innerHTML += `Token "${token}": <span style="color: red;">Rejeitado</span><br>`;
    }
  });
}

// Função para atualizar a tabela de transições quando um token é aceito
function updateTransitionTable(token) {
  let currentState = 'q0'; // Começa no estado inicial

  // Para cada caractere do token, segue a transição correspondente
  for (let i = 0; i < token.length; i++) {
    const char = token[i];
    const nextState = `q${alphabet.indexOf(char)}`; // Encontra o próximo estado com base na letra

    if (stateMatrix[currentState][char] === '-') {
      stateMatrix[currentState][char] = nextState; // Atualiza a transição
    }

    currentState = nextState; // Atualiza o estado atual
  }

  // Marca o estado de aceitação
  if (stateMatrix[currentState]) {
    stateMatrix[currentState] = { ...stateMatrix[currentState], [token[token.length - 1]]: 'qAceito' };
  }

  // Destaca o estado de aceitação na tabela
  highlightAcceptedState(token);

  renderTransitionTable(); // Atualiza a tabela de transições na tela
}

// Função para destacar o estado final de aceitação
function highlightAcceptedState(token) {
  const table = document.querySelector('table');
  const rows = table.rows;

  // Limpa as células verdes anteriores
  const cells = table.querySelectorAll('.accepted-state');
  cells.forEach(cell => cell.classList.remove('accepted-state'));

  // Encontra o estado final de aceitação e aplica a classe 'accepted-state' para colorir de verde
  let currentState = 'q0';
  for (let i = 0; i < token.length; i++) {
    const char = token[i];
    currentState = `q${alphabet.indexOf(char)}`;
  }

  // Destaca a célula correspondente ao estado final
  const lastColumnIndex = alphabet.indexOf(token[token.length - 1]) + 1;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const stateCell = row.cells[0];
    const state = stateCell.textContent;

    if (state === 'qAceito') {
      row.cells[lastColumnIndex].classList.add('accepted-state'); // Aplica a cor verde à célula de aceitação
    }
  }
}

// Função para adicionar um novo token a partir do input do usuário
document.getElementById('add-token-btn').addEventListener('click', () => {
  const newToken = document.getElementById('new-token').value.trim().toLowerCase();
  if (newToken && !wordList.includes(newToken)) {
    addToken(newToken); // Adiciona o token se não existir
    document.getElementById('new-token').value = ''; // Limpa o campo de entrada
  } else {
    alert('Por favor, insira um token válido!'); // Aviso se o token for inválido
  }
});

// Função para analisar o texto quando o botão de análise é pressionado
document.getElementById('analyze-btn').addEventListener('click', analyzeText);

// Inicializa a matriz de transições e renderiza a tabela
initializeStateMatrix();
renderTransitionTable();
