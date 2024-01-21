
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    actions: {
        button: document.getElementById("next-duel")
    }
}
const pathImages = "./src/assets/icons/"

const playerSides = {
    player: "player-cards",
    computer: "computer-cards",
}

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        LoseOf:[1],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        LoseOf:[1],
    },
]

async function drawCards(cardNumbers, fieldSide) {
     for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
     }
}
async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(randomIdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player){
        cardImage.addEventListener("click", ()=> {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(randomIdCard);
        });
    }
    
    return cardImage;
}

async function setCardsField(playerCardId){
    // Remove todas as imagens das cartas do campo.
    await removeAllCardsImages();
    
    // Sorteia um id aleatório para a carta do computador.
    let computerCardId = await getRandomCardId();
    
    // Defini o estilo display para block para exibir os cards.
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    
    await hiddenCardDetails();
    
    // Defini as imagens dos cards.
    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
    
    // Invoca uma função para verificar o resultado do duelo passando como parâmetros os ids dos cards do player e do computador.
    let duelResults = await checkDuelResults(playerCardId, computerCardId);
    
    // Atualiza a pontuação do player e do computador.
    await updateScore();
    
    // Mostra botão com resultado do duelo.
    await drawButton(duelResults); 
}

async function drawSelectCard(randomIdCard){
    state.cardSprites.avatar.src = cardData[randomIdCard].img;
    state.cardSprites.name.innerText = cardData[randomIdCard].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[randomIdCard].type;
}

async function removeAllCardsImages(){
    // Recupera as cartas do computador e do jogador.
    let cards = document.querySelector("#computer-cards");
    
    // Recupera todas as imagens das cartas do computador. 
    let imgElements = cards.querySelectorAll("img");
    
    // Remove todas as imagens das cartas do computador. 
    imgElements.forEach((img) => img.remove());
    
    // Recupera todas as cartas do jogador.
    cards = document.querySelector("#player-cards");

    // Recupera todas as imagens das cartas do jogador. 
    imgElements = cards.querySelectorAll("img");
    
    // Remove todas as imagens das cartas do jogador. 
    imgElements.forEach((img)=> img.remove());
}

// Oculta a imagem e informações dos cards.
async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "YOU WINS";
        await playAudio("win");
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "YOU LOSE";
        await playAudio("lose");
        state.score.computerScore++;
    }

    return duelResults;
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(duelResults){
    state.actions.button.innerText = duelResults;
    state.actions.button.style.display = "block";
}

async function playAudio(status){
    const audio = new Audio(`/src/assets/audios/${status}.wav`);
    audio.play();
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

function init(){
    const bgm = document.getElementById("bgm");
    bgm.play();
    
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, playerSides.player);
    drawCards(5, playerSides.computer);
}

init();