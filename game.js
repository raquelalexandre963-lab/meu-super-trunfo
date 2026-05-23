// 1. MOLDE DA CARTA
class Carta {
    constructor(nome, valor) {
        this.nome = nome;
        this.valor = valor;
    }
}

// 2. VARIÁVEIS GLOBAIS
let cartas = [];

// 3. FUNÇÕES
function inicializarJogo() {
    cartas.push(new Carta("Rei", 13));
    cartas.push(new Carta("Dama", 12));
    cartas.push(new Carta("Ás", 14));
    cartas.push(new Carta("Valete", 11));
}

function sortearCarta() {
    let indice = Math.floor(Math.random() * cartas.length);
    return cartas[indice];
}

function renderizarCartas(carta) {
    let cartaElement = document.getElementById("carta");
    cartaElement.textContent = `Sua carta: ${carta.nome} | Valor: ${carta.valor}`;
}

// 4. EXECUÇÃO
inicializarJogo();
let cartaSorteada = sortearCarta();
renderizarCartas(cartaSorteada);
