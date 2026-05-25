// CONFIG DO JOGO
const NAIPES = ['♠', '♥', '♦', '♣'];
const VALORES = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const PONTOS_CARTA = { '4': 0, '5': 0, '6': 0, '7': 10, 'Q': 2, 'J': 3, 'K': 4, 'A': 11, '2': 12, '3': 13 };
const ORDEM_FORCA = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3']; // 3 é a maior

let baralho = [];
let maos = [[], [], [], []]; // jogador1, jogador2, jogador3, jogador4
let cartasNaMesa = [];
let pontosDupla1 = 0;
let pontosDupla2 = 0;
let rodada = 1;
let naipeRodada = null;
let vezDoJogador = 0; // 0 = você, 1 = parceiro, 2 = adv1, 3 = adv2
let cartasJogadasRodada = 0;

// CRIA BARALHO COMPLETO
function criarBaralho() {
  baralho = [];
  for (let naipe of NAIPES) {
    for (let valor of VALORES) {
      baralho.push({ valor, naipe, pontos: PONTOS_CARTA[valor] });
    }
  }
}

// EMBARALHA
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// DISTRIBUI 10 CARTAS PRA CADA
function iniciarRodada() {
  criarBaralho();
  embaralhar(baralho);
  maos = [[], [], [], []];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 4; j++) {
      maos[j].push(baralho.pop());
    }
  }

  cartasNaMesa = [];
  cartasJogadasRodada = 0;
  naipeRodada = null;
  vezDoJogador = 0;

  atualizarTela();
  document.getElementById('naipe-atual').textContent = '-';
}

// DESENHA CARTA NA TELA
function criarElementoCarta(carta, podeClicar = false, indiceJogador = 0, indiceCarta = 0) {
  const div = document.createElement('div');
  div.className = 'carta-baralho';
  if (carta.naipe === '♥' || carta.naipe === '♦') div.classList.add('vermelho');
  div.textContent = `${carta.valor}${carta.naipe}`;

  if (podeClicar) {
    div.onclick = () => jogarCarta(indiceJogador, indiceCarta);
  }
  return div;
}

// ATUALIZA TODA A MESA
function atualizarTela() {
  // Mão do jogador
  const maoJ1 = document.getElementById('mao-jogador1');
  maoJ1.innerHTML = '';
  maos[0].forEach((carta, i) => {
    maoJ1.appendChild(criarElementoCarta(carta, vezDoJogador === 0, 0, i));
  });

  // Outras mãos só mostram quantidade
  for (let j = 1; j < 4; j++) {
    const maoDiv = document.getElementById(`mao-jogador${j + 1}`);
    maoDiv.innerHTML = `${maos[j].length} cartas`;
  }

  // Cartas na mesa
  const mesaDiv = document.getElementById('cartas-mesa');
  mesaDiv.innerHTML = '';
  cartasNaMesa.forEach(carta => {
    mesaDiv.appendChild(criarElementoCarta(carta));
  });

  // Placar
  document.getElementById('pontos-dupla1').textContent = pontosDupla1;
  document.getElementById('pontos-dupla2').textContent = pontosDupla2;
  document.getElementById('rodada').textContent = rodada;
}

// VERIFICA SE PODE JOGAR A CARTA
function podeJogar(carta, mao) {
  if (!naipeRodada) return true; // Primeira carta define o naipe
  if (carta.naipe === naipeRodada) return true; // Tem o naipe
  return!mao.some(c => c.naipe === naipeRodada); // Não tem o naipe, pode qualquer uma
}

// JOGAR CARTA
function jogarCarta(indiceJogador, indiceCarta) {
  if (vezDoJogador!== 0) return; // Só joga na sua vez
  const carta = maos[indiceJogador][indiceCarta];

  if (!podeJogar(carta, maos[indiceJogador])) {
    alert(`Tu tem que jogar ${naipeRodada} se tiver!`);
    return;
  }

  // Primeira carta da rodada define o naipe
  if (!naipeRodada) {
    naipeRodada = carta.naipe;
    document.getElementById('naipe-atual').textContent = naipeRodada;
  }

  // Remove da mão e joga na mesa
  maos[indiceJogador].splice(indiceCarta, 1);
  cartasNaMesa.push({...carta, jogador: indiceJogador });
  cartasJogadasRodada++;

  atualizarTela();
  proximoJogador();
}

// CPU JOGA
function jogadaCPU(indiceJogador) {
  setTimeout(() => {
    const mao = maos[indiceJogador];
    let cartaEscolhida = 0;

    // Se tem naipe, joga a menor. Se não tem, joga qualquer uma
    const cartasDoNaipe = mao.map((c, i) => ({...c, index: i})).filter(c => c.naipe === naipeRodada);

    if (cartasDoNaipe.length > 0) {
      // Joga a mais fraca do naipe
      cartasDoNaipe.sort((a, b) => ORDEM_FORCA.indexOf(a.valor) - ORDEM_FORCA.indexOf(b.valor));
      cartaEscolhida = cartasDoNaipe[0].index;
    } else {
      // Descarta a mais fraca geral
      let menor = 0;
      for (let i = 1; i < mao.length; i++) {
        if (ORDEM_FORCA.indexOf(mao[i].valor) < ORDEM_FORCA.indexOf(mao[menor].valor)) {
          menor = i;
        }
      }
      cartaEscolhida = menor;
    }

    const carta = mao[cartaEscolhida];

    if (!naipeRodada) {
      naipeRodada = carta.naipe;
      document.getElementById('naipe-atual').textContent = naipeRodada;
    }

    maos[indiceJogador].splice(cartaEscolhida, 1);
    cartasNaMesa.push({...carta, jogador: indiceJogador });
    cartasJogadasRodada++;

    atualizarTela();
    proximoJogador();
  }, 1000);
}

function proximoJogador() {
  if (cartasJogadasRodada === 4) {
    finalizarRodada();
    return;
  }

  vezDoJogador = (vezDoJogador + 1) % 4;

  if (vezDoJogador!== 0) {
    jogadaCPU(vezDoJogador);
  }
}

// VÊ QUEM GANHOU A RODADA
function finalizarRodada() {
  let maiorCarta = cartasNaMesa[0];

  for (let carta of cartasNaMesa) {
    if (carta.naipe === naipeRodada) {
      if (ORDEM_FORCA.indexOf(carta.valor) > ORDEM_FORCA.indexOf(maiorCarta.valor) || maiorCarta.naipe!== naipeRodada) {
        maiorCarta = carta;
      }
    }
  }

  const vencedor = maiorCarta.jogador;
  const pontosRodada = cartasNaMesa.reduce((total, c) => total + c.pontos, 0);

  // Dupla 1 = jogador 0 e 1. Dupla 2 = jogador 2 e 3
  if (vencedor === 0 || vencedor === 1) {
    pontosDupla1 += pontosRodada;
  } else {
    pontosDupla2 += pontosRodada;
  }

  alert(`Dupla ${vencedor === 0 || vencedor === 1? '1' : '2'} fez a rodada! +${pontosRodada} pontos`);

  setTimeout(() => {
    cartasNaMesa = [];
    naipeRodada = null;
    cartasJogadasRodada = 0;
    vezDoJogador = vencedor; // Quem fez começa a próxima

    // Verifica se acabou a mão
    if (maos[0].length === 0) {
      finalizarMao();
    } else {
      document.getElementById('naipe-atual').textContent = '-';
      atualizarTela();
      if (vezDoJogador!== 0) jogadaCPU(vezDoJogador);
    }
  }, 1500);
}

function finalizarMao() {
  let msg = `Fim da mão!\nDupla 1: ${pontosDupla1} pts\nDupla 2: ${pontosDupla2} pts\n\n`;

  if (pontosDupla1 >= 50) msg += 'Dupla 1 venceu o jogo!';
  else if (pontosDupla2 >= 50) msg += 'Dupla 2 venceu o jogo!';
  else msg += 'Nova mão vai começar!';

  alert(msg);

  if (pontosDupla1 < 50 && pontosDupla2 < 50) {
    rodada++;
    iniciarRodada();
  }
}

// Começa quando carrega
window.onload = iniciarRodada;
