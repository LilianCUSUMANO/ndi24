<?php
session_start();

// Vérifier si le corps de la requête est une JSON
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// Démarrer le jeu
if ($data['action'] === 'startGame') {
    $_SESSION['sequence'] = generateSequence(3);  // Commence avec 3 couleurs
    echo json_encode(['status' => 'started', 'sequence' => $_SESSION['sequence']]);
    exit;
}

// Vérifier la séquence du joueur
if ($data['action'] === 'check') {
    $playerSequence = $data['sequence'];
    $sequence = $_SESSION['sequence'];

    // Vérifier si la séquence est correcte
    if ($playerSequence === $sequence) {
        // Séquence correcte, passer à la suivante
        if (count($sequence) < 5) {
            $_SESSION['sequence'][] = rand(0, 8); // Ajouter une nouvelle couleur
            echo json_encode(['status' => 'nextRound', 'sequence' => $_SESSION['sequence']]);
        } else {
            // Jeu terminé, le joueur a gagné
            echo json_encode(['status' => 'success', 'redirect' => 'home.html']);
        }
    } else {
        // Séquence incorrecte
        echo json_encode(['status' => 'fail']);
    }
    exit;
}

// Fonction pour générer une séquence de jeu
function generateSequence($length) {
    $sequence = [];
    for ($i = 0; $i < $length; $i++) {
        $sequence[] = rand(0, 8);  // Choisit un nombre aléatoire entre 0 et 8 (cellules)
    }
    return $sequence;
}
?>
