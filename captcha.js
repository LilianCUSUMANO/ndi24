const checkbox = document.getElementById("captchaCheckbox");
const popup = document.getElementById("popupWindow");
const gameGrid = document.getElementById("gameGrid");
const message = document.getElementById("message");

let sequence = [];
let playerSequence = [];
let isPlayerTurn = false;
let round = 0; // Compte les manches
const maxRounds = 3; // Nombre de manches : 3, 4 et 5 couleurs

// Ouvrir la fenêtre de jeu
checkbox.addEventListener("click", function () {
    if (checkbox.checked) {
        openPopup();
    }
});

// Afficher la fenêtre pop-up et initialiser le jeu
function openPopup() {
    popup.style.display = "flex";
    initializeGame();
}

// Fermer la fenêtre pop-up
function closePopup() {
    popup.style.display = "none";
    checkbox.checked = false; // Réinitialise la case à cocher
    sequence = [];
    playerSequence = [];
    round = 0;
    gameGrid.innerHTML = ""; // Réinitialiser la grille
    message.textContent = "Bonne chance !";
}

// Initialiser le jeu
function initializeGame() {
    createGrid();
    startGame();
}

// Créer la grille 3x3
function createGrid() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.color = i;
        gameGrid.appendChild(cell);

        cell.addEventListener("click", () => handlePlayerInput(i));
    }
}

// Démarrer le jeu
function startGame() {
    initializeSequence();
    playSequence();
}

// Initialiser la séquence avec 3 couleurs
function initializeSequence() {
    while (sequence.length < 3) {
        const randomIndex = Math.floor(Math.random() * 9);
        sequence.push(randomIndex);
    }
}

// Ajouter une nouvelle case à la séquence
function addToSequence() {
    const randomIndex = Math.floor(Math.random() * 9);
    sequence.push(randomIndex);
}

// Jouer la séquence
function playSequence() {
    isPlayerTurn = false;
    let i = 0;

    message.textContent = `Manche ${round + 1} : Regardez la séquence...`;

    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            isPlayerTurn = true;
            message.textContent = "À vous de jouer !";
            return;
        }

        const index = sequence[i];
        const cell = gameGrid.children[index];
        flashCell(cell);
        i++;
    }, 800);
}

// Faire clignoter une case
function flashCell(cell) {
    cell.style.backgroundColor = getColor(cell.dataset.color);
    setTimeout(() => {
        cell.style.backgroundColor = "black";
    }, 500);
}

// Gérer l'entrée du joueur
function handlePlayerInput(index) {
    if (!isPlayerTurn) return;

    playerSequence.push(index);

    // Vérifier si le joueur suit correctement la séquence
    const isCorrect = playerSequence.every((val, i) => val === sequence[i]);
    if (!isCorrect) {
        message.textContent = "Échec ! Vous avez perdu.";
        setTimeout(closePopup, 2000);
        return;
    }

    // Si le joueur termine la séquence
    if (playerSequence.length === sequence.length) {
        playerSequence = [];
        round++;

        // Vérifier si le joueur a gagné toutes les manches
        if (round === maxRounds) {
            message.textContent = "Félicitations ! Vous avez gagné.";
            checkbox.checked = true; // Valider la case captcha
            setTimeout(() => {
                window.location.href = "home.html"; // Rediriger vers home.html
            }, 2000);
            return;
        }

        // Ajouter une nouvelle couleur pour la prochaine manche
        addToSequence();
        setTimeout(playSequence, 1000); // Nouvelle séquence après un délai
    }
}

// Obtenir une couleur spécifique pour chaque index
function getColor(index) {
    const colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "orange", "purple", "pink"];
    return colors[index];
}
