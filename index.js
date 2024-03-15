// Requerimos el módulo "prompt-sync" para manejar entradas del usuario en la consola
const prompt = require("prompt-sync")();

// Definimos constantes para las dimensiones de las "reels" del juego
const ROWS = 3;
const COLS = 3;

// Objeto para definir cuántas veces aparecerá cada símbolo en el juego
const SYMBOS_COUNT = {
    A: 2, // Símbolo A aparece 2 veces
    B: 4, // Símbolo B aparece 4 veces
    C: 6, // Símbolo C aparece 6 veces
    D: 8  // Símbolo D aparece 8 veces
};

// Objeto que define el valor de cada símbolo en caso de ganar
const SYMBOS_VALUES = {
    A: 5, // Valor de A
    B: 4, // Valor de B
    C: 3, // Valor de C
    D: 2  // Valor de D
};

// Función para solicitar al usuario que ingrese una cantidad de dinero para depositar
const deposit = () => {
    while (true) {
        const depositAmount = prompt("¿Cuanto dinero mete?: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Cantidad invalida, intenntelo otra vez");
        } else {
            return numberDepositAmount;
        }
    }
};

// Función para obtener el número de líneas en las que el usuario desea apostar
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("A cuantas lineas le quieres apostar (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Numero de lineas no disponible, intenntelo otra vez");
        } else {
            return numberOfLines;
        }
    }
};

// Función para obtener la cantidad de dinero que el usuario desea apostar
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("¿Cuantos quiere apostar?: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / lines)) {
            console.log("Apuesta invalida, intenntelo otra vez");
        } else {
            return numberBet;
        }
    }
};

// Función para "girar" las reels y generar los símbolos aleatoriamente
const spin = () => {
    const symbols = [];
    // Primero, agregamos los símbolos al arreglo según la cantidad definida
    for (const [symbol, count] of Object.entries(SYMBOS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    // Luego, generamos cada reel con símbolos aleatorios
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbol = [...symbols]; // Copia de los símbolos para manipular sin afectar el original
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbol.length);
            const selectedSymbol = reelSymbol[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbol.splice(randomIndex, 1); // Eliminamos el símbolo seleccionado para evitar repeticiones
        }
    }
    return reels;
};

// Función para transponer las reels, convirtiendo columnas en filas
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

// Función para imprimir las filas de símbolos en la consola
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

// Función para calcular las ganancias del usuario basado en las filas y la apuesta
const getWinnings = (rows, bet, lines) => {
    let winning = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true; // Suponemos que todos los símbolos son iguales inicialmente

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false; // Si encontramos un símbolo diferente, cambiamos la suposición
                break;
            }
        }
        if (allSame) { // Si todos los símbolos son iguales, el usuario gana
            winning += bet * SYMBOS_VALUES[symbols[0]]; // Calculamos la ganancia
        }
    }
    return winning;
};

// Función principal del juego
const game = () => {
    let balance = deposit(); // El usuario deposita dinero para jugar
    while (true) {
        console.log("Tienes en la cuenta un total de " + balance + "€");
        const numberOfLines = getNumberOfLines(); // Se obtiene el número de líneas a jugar
        const bet = getBet(balance, numberOfLines); // Se obtiene la cantidad a apostar
        balance -= bet * numberOfLines; // Se descuenta la apuesta del balance
        const reels = spin(); // Se "giran" las reels
        const rows = transpose(reels); // Se transponen las reels para obtener las filas
        printRows(rows); // Se imprimen las filas
        const winnings = getWinnings(rows, bet, numberOfLines); // Se calculan las ganancias
        balance += winnings; // Se actualiza el balance con las ganancias
        console.log("Ganaste " + winnings.toString() + "€");

        if (balance <= 0) { // Si el usuario pierde todo su dinero, el juego termina
            console.log("Te quedaste sin dinero");
            break;
        }
        const playAgain = prompt("¿Quieres seguir jugando (s/n)?");
        if (playAgain != "s") break; // Si el usuario decide no continuar, el juego termina
    }
};

game(); // Iniciamos el juego
