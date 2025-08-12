const symbols = ["🔥", "💧", "🌱", "💨", "⚡", "🪨", "10", "J", "Q"];
const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
    document.getElementById("reel4"),
    document.getElementById("reel5"),
    document.getElementById("reel6"),
];
const spinBtn = document.getElementById("spin-btn");
const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const message = document.getElementById("message");

const spinSound = document.getElementById("spin-sound");
const stopSound = document.getElementById("stop-sound");
const winSound = document.getElementById("win-sound");

let credits = 1000;
const bet = 50;

function createReelSymbols(reel) {
    reel.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        const symbolEl = document.createElement("div");
        symbolEl.className = "symbol";
        symbolEl.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel.appendChild(symbolEl);
    }
}

function spinReel(reel, delay) {
    return new Promise(resolve => {
        let spins = 15;
        const interval = setInterval(() => {
            createReelSymbols(reel);
            spins--;
            if (spins <= 0) {
                clearInterval(interval);
                stopSound.play();
                resolve();
            }
        }, delay);
    });
}

spinBtn.addEventListener("click", async () => {
    if (credits < bet) {
        message.textContent = "No tienes suficientes créditos.";
        return;
    }
    credits -= bet;
    creditsEl.textContent = credits;
    message.textContent = "";
    spinBtn.disabled = true;
    spinSound.play();

    const results = [];

    for (let i = 0; i < reels.length; i++) {
        await spinReel(reels[i], 100 + i * 30);
        const finalSymbols = [];
        reels[i].querySelectorAll(".symbol").forEach(s => finalSymbols.push(s.textContent));
        results.push(finalSymbols[1]); // Tomar el símbolo del medio
    }

    checkWin(results);
    spinBtn.disabled = false;
});

function checkWin(results) {
    if (results.every(s => s === results[0])) {
        message.textContent = "🎉 ¡Ganaste!";
        winSound.play();
        credits += bet * 10;
        creditsEl.textContent = credits;
        reels.forEach(r => r.classList.add("win-highlight"));
        setTimeout(() => reels.forEach(r => r.classList.remove("win-highlight")), 2000);
    } else {
        message.textContent = "❌ Intenta otra vez";
    }
}

// Inicializar con símbolos
reels.forEach(r => createReelSymbols(r));
