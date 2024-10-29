// Constants
const TOTAL_SETS = 8;
const TOTAL_CARDS = 9 * TOTAL_SETS;
const DEFAULT_NUMBER_OF_CARDS = 12;
const DEFAULT_CARD_SETS = "all";

const CARD_SETS = {
  totoro: 9,
  kiki: 18,
  woth: 27,
  mononoke: 36,
  "spirited-away": 45,
  howl: 54,
  arrietty: 63,
  marnie: 72,
};

// State
let gameState = {
  numberOfCards: DEFAULT_NUMBER_OF_CARDS,
  score: 0,
  record: 0,
  cardSets: DEFAULT_CARD_SETS,
  cards: [],
  currentTrack: 1,
  isPlayingAll: false,
  shouldLoopAll: false,
};

// DOM Elements
const elements = {
  cardsContainer: document.querySelector(".cards-container"),
  copyright: document.querySelector(".copyright"),
  congratsContainer: document.querySelector(".congrats-container"),
  scoreBoard: {
    best: document.querySelector("#score-best"),
    last: document.querySelector("#score-last"),
    new: document.querySelector("#scores-new"),
    details: document.querySelector("#scores-details"),
  },
  cardNumberDisplay: document.querySelector("#cards-number"),
  cardNumberSelect: document.querySelector("#number-cards"),
  cardSetsSelect: document.querySelector("#card-sets"),
  musicControl: document.querySelector("#music-control"),
  musicSelect: document.querySelector("#music"),
  audioReset: document.querySelector("#audio-reset"),
  loopIcon: document.querySelector(".fa-rotate"),
  loopLabel: document.querySelector(".loopLabel"),
  trackContainer: document.getElementById("current-track-container"),
  trackDisplay: document.getElementById("track-display"),
};

// Main Functions
function renderBoard() {
  updateCopyright();
  setMusic();
  setCards();
}

function setCards() {
  resetGameState();
  clearCards();
  const cardSet = generateCardSet();
  const shuffledCards = shuffle(cardSet, gameState.numberOfCards);
  createCardElements(shuffledCards);
}

function resetGameState() {
  gameState.score = 0;
  gameState.record = 0;
  elements.congratsContainer.style.display = "none";
  setCardsNumber();
  setStartingCardSets();
  setScores();
}

function generateCardSet() {
  let cardSet = Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1);
  if (gameState.cardSets !== "all") {
    const setStart = Object.keys(CARD_SETS).indexOf(gameState.cardSets) * 9;
    cardSet = cardSet.slice(setStart, setStart + 9);
  }
  return cardSet.concat(cardSet);
}

function createCardElements(shuffledCards) {
  shuffledCards.forEach((cardNumber) => {
    const card = document.createElement("div");
    card.className = `card image-${cardNumber} pos-${
      (cardNumber % 9) + 1
    } ${getSet(cardNumber)}`;
    card.addEventListener("click", onCardClick);
    elements.cardsContainer.appendChild(card);
  });
  gameState.cards = document.querySelectorAll(".card");
}

function onCardClick(e) {
  const el = e.target;
  const maxOpenCards =
    document.querySelectorAll(".flipped-up").length -
    document.querySelectorAll(".done").length;
  incrementScore();

  if (maxOpenCards < 2) {
    flipCard(el);
    updateLastScore();
  }
}

function flipCard(el) {
  if (!el.classList.contains("done")) {
    if (el.classList.contains("flipped-up")) {
      el.classList.remove("flipped-up");
    } else {
      if (document.querySelectorAll(".flipped-up").length) {
        isMatchingPair(el.className, el);
      } else {
        el.classList.add("flipped-up");
      }
    }
  }
}

function isMatchingPair(card, el) {
  const waitingTime = 1000;
  const cardImg = card.replace("card", "").trim().split(" ")[0];

  document.querySelectorAll(".flipped-up").forEach((elFlipped) => {
    if (
      elFlipped.classList.contains(cardImg) &&
      !elFlipped.classList.contains("done")
    ) {
      el.classList.add("flipped-up", "done");
      elFlipped.classList.add("done");
    } else {
      el.classList.add("flipped-up");
      if (!elFlipped.classList.contains("done")) {
        setTimeout(() => {
          elFlipped.classList.remove("flipped-up");
          el.classList.remove("flipped-up");
        }, waitingTime);
      }
    }
  });

  if (isAllCardsDone()) {
    isGameOver();
  }
}

function isAllCardsDone() {
  return (
    document.querySelectorAll(".done").length >= gameState.numberOfCards &&
    document.querySelectorAll(".flipped-up").length >= gameState.numberOfCards
  );
}

function isGameOver() {
  updateScores();
  displayGameOverMessage();
  setTimeout(() => {
    elements.congratsContainer.style.display = "block";
  }, 500);
}

// Helper Functions
function getSet(cardNumber) {
  return (
    Object.entries(CARD_SETS).find(([_, max]) => cardNumber <= max)?.[0] || ""
  );
}

function clearCards() {
  while (elements.cardsContainer.firstChild) {
    elements.cardsContainer.removeChild(elements.cardsContainer.firstChild);
  }
}

function setScores() {
  const bestScoreKey = `bestScore${gameState.numberOfCards}`;
  if (localStorage.getItem(bestScoreKey) === null) {
    localStorage.setItem(bestScoreKey, "0");
  }
  localStorage.setItem("lastScore", "0");

  elements.scoreBoard.best.textContent = localStorage.getItem(bestScoreKey);
  elements.scoreBoard.last.textContent = localStorage.getItem("lastScore");
}

function setCardsNumber() {
  if (localStorage.getItem("cardsNumber") === null) {
    localStorage.setItem("cardsNumber", DEFAULT_NUMBER_OF_CARDS);
  } else {
    elements.cardNumberSelect.value = localStorage.getItem("cardsNumber");
  }
  gameState.numberOfCards = parseInt(localStorage.getItem("cardsNumber"));
  elements.cardNumberDisplay.textContent = ` ${gameState.numberOfCards} `;
}

function setStartingCardSets() {
  if (localStorage.getItem("cardSets") === null) {
    localStorage.setItem("cardSets", DEFAULT_CARD_SETS);
  } else {
    elements.cardSetsSelect.value = localStorage.getItem("cardSets");
  }
  gameState.cardSets = localStorage.getItem("cardSets");
}

function calcRandomNumber(newLength) {
  return Math.floor(Math.random() * newLength);
}

function arraySize(array, newLength) {
  let newArray = array.slice();
  if (array.length > newLength) {
    while (newArray.length > newLength) {
      let randomIndex = calcRandomNumber(newArray.length);
      let image = newArray[randomIndex];
      newArray.splice(newArray.indexOf(image), 1);
      newArray.splice(newArray.indexOf(image), 1);
    }
  } else {
    while (newArray.length < newLength) {
      let randomIndex = calcRandomNumber(array.length);
      newArray.push(array[randomIndex]);
      newArray.push(array[randomIndex]);
    }
  }
  return newArray;
}

function shuffle(array, newLength) {
  let currentIndex = newLength - 1;
  let adjustedArray = arraySize(array, newLength);

  while (currentIndex !== 0) {
    let randomIndex = calcRandomNumber(newLength);
    [adjustedArray[currentIndex], adjustedArray[randomIndex]] = [
      adjustedArray[randomIndex],
      adjustedArray[currentIndex],
    ];
    currentIndex--;
  }
  return adjustedArray;
}

function incrementScore() {
  localStorage.setItem(
    "lastScore",
    (parseInt(localStorage.getItem("lastScore")) + 1).toString()
  );
}

function updateLastScore() {
  elements.scoreBoard.last.textContent = ` ${localStorage.getItem(
    "lastScore"
  )} `;
}

function updateScores() {
  console.log("Updating scores...");
  const currentNum = gameState.numberOfCards;
  const bestScoreKey = `bestScore${currentNum}`;
  gameState.record = parseInt(localStorage.getItem(bestScoreKey)) || 0;
  gameState.score = parseInt(localStorage.getItem("lastScore"));
  console.log("Current score:", gameState.score);
  console.log("Current record:", gameState.record);

  if (gameState.score < gameState.record || gameState.record === 0) {
    console.log("New record achieved!");
    localStorage.setItem(bestScoreKey, gameState.score.toString());
    gameState.record = gameState.score;
  }
  elements.scoreBoard.best.textContent = gameState.record.toString();
  console.log("Updated best score:", gameState.record);
}

function displayGameOverMessage() {
  const { score, record, numberOfCards } = gameState;
  let message = `Your score is ${score}. `;
  let details = "";

  if (score === numberOfCards) {
    details = "It is the best possible";
  } else if (score > record) {
    const more = score - record;
    details =
      record === 0
        ? `Congratulations on your first record: ${score} clicks!`
        : `That's ${more} click${more > 1 ? "s" : ""} more than your best`;
  } else if (score === record) {
    details = "You repeated your best";
  } else if (score < record) {
    details = `Congratulations on your new record: ${score} clicks!`;
  }

  elements.scoreBoard.new.textContent = message;
  elements.scoreBoard.details.textContent = details;
}

function playAll() {
  const audioPlayer = elements.musicControl;
  let currentTrack = 1;

  // Initial track load
  loadAndPlayTrack(currentTrack);

  // Remove any existing ended event listeners to prevent duplicates
  audioPlayer.removeEventListener("ended", handlePlayAllEnd);

  function handlePlayAllEnd() {
    const isLooping = elements.loopLabel.textContent === "On";

    if (currentTrack < 24) {
      // Move to next track if not at the end
      currentTrack++;
      loadAndPlayTrack(currentTrack);
    } else if (isLooping) {
      // Start over from track 1 if looping is enabled
      currentTrack = 1;
      loadAndPlayTrack(currentTrack);
    }
  }

  function loadAndPlayTrack(trackNumber) {
    audioPlayer.src = `./assets/music/${trackNumber}.mp3`;
    updateTrackName(trackNumber);
    localStorage.setItem("trackForPlayAll", trackNumber.toString());
    audioPlayer.load();
    audioPlayer.play();
  }

  // Add the ended event listener for Play All mode
  audioPlayer.addEventListener("ended", handlePlayAllEnd);
}

function handleTrackEnd() {
  if (gameState.isPlayingAll) {
    if (gameState.currentTrack < TOTAL_TRACKS) {
      gameState.currentTrack++;
    } else if (gameState.shouldLoopAll) {
      gameState.currentTrack = 1;
    } else {
      gameState.isPlayingAll = false;
      return;
    }
    loadAndPlayTrack(gameState.currentTrack);
  }
}

function loopMusic() {
  const loopIcon = elements.loopIcon;
  const loopLabel = elements.loopLabel;
  const audioPlayer = elements.musicControl;
  const musicValue = elements.musicSelect.value;

  if (loopLabel.textContent === "On") {
    loopIcon.setAttribute("title", "Loop Off");
    loopLabel.textContent = "Off";
    gameState.shouldLoopAll = false;
    audioPlayer.loop = false;
  } else {
    loopIcon.setAttribute("title", "Loop On");
    loopLabel.textContent = "On";
    gameState.shouldLoopAll = true;
    audioPlayer.loop = musicValue !== "Play All";
  }
}

// Helper functions to manage track display
function updateTrackName(trackValue) {
  const trackNames = {
    none: "None",
    1: "01 Bird Person",
    2: "02 The Promise of the World",
    3: "03 Stroll",
    4: "04 Teru's Song",
    5: "05 Summer of Good-bye",
    6: "06 Nausicaä of the Valley",
    7: "07 Once in a While",
    8: "08 Country Road",
    9: "09 Message Of Rouge",
    10: "10 The Path of Wind",
    11: "11 Princess Mononoke",
    12: "12 Hikouki-Gumo",
    13: "13 Always With Me",
    14: "14 A Town with an Ocean View",
    15: "15 Ponyo on the Cliff by the Sea",
    16: "16 Arrietty's Song",
    17: "17 The Name of Life",
    18: "18 My Neighbor Totoro",
    19: "19 The Legend of Ashitaka",
    20: "20 Become The Wind",
    21: "21 Carrying You",
    22: "22 Nausicaä Requiem",
    23: "23 If I've Been Enveloped By Tendern",
    24: "24 Reprise Spirited Away",
    "Play All": "Play All",
  };

  // Update the input field with the current track name
  elements.trackDisplay.value = trackNames[trackValue] || "None";
}

function showTrackDisplay() {
  elements.trackContainer.style.display = "flex";
}

function hideTrackDisplay() {
  elements.trackContainer.style.display = "none";
}

function setMusic() {
  const musicValue = elements.musicSelect.value;
  const audioPlayer = elements.musicControl;

  localStorage.setItem("music", musicValue);

  // Remove any existing ended event listeners
  audioPlayer.removeEventListener("ended", audioPlayer.onended);

  if (musicValue === "none") {
    hideMusicControls();
    hideTrackDisplay();
  } else if (musicValue === "Play All") {
    showMusicControls();
    showTrackDisplay();
    playAll();
  } else {
    // Single track mode
    showMusicControls();
    showTrackDisplay();

    // Set up single track playback
    audioPlayer.src = `./assets/music/${musicValue}.mp3`;
    updateTrackName(musicValue);

    // Remove Play All event listener if exists
    audioPlayer.removeEventListener("ended", audioPlayer.onended);

    // Handle looping for single track
    const isLooping = elements.loopLabel.textContent === "On";
    audioPlayer.loop = isLooping;
  }

  elements.musicSelect.style.width = musicValue === "none" ? "80px" : "200px";
}

// Make sure to add this event listener
elements.musicControl.addEventListener("ended", handleTrackEnd);

function showMusicControls() {
  elements.musicControl.removeAttribute("hidden");
  elements.audioReset.removeAttribute("hidden");
}

function hideMusicControls() {
  elements.audioReset.setAttribute("hidden", "hidden");
  elements.musicControl.setAttribute("hidden", "hidden");
  elements.musicControl.src = "";
}

function resetPlayer() {
  const audioPlayer = elements.musicControl;
  const loopIcon = elements.loopIcon;
  const loopLabel = elements.loopLabel;

  // Remove all event listeners
  audioPlayer.removeEventListener("ended", audioPlayer.onended);
  audioPlayer.loop = false;
  loopIcon.setAttribute("title", "Loop Off");
  loopLabel.textContent = "Off";

  hideMusicControls();
  localStorage.setItem("music", "none");
  elements.musicSelect.value = "none";
  hideTrackDisplay();
  localStorage.removeItem("trackForPlayAll");
}

// Utility Functions
function updateCopyright() {
  const currentYear = new Date().getFullYear();
  elements.copyright.innerHTML = `Copyright &copy; ${currentYear} LivenLab`;
}

function setNumberOfCards() {
  localStorage.setItem("cardsNumber", elements.cardNumberSelect.value);
  restart();
}

function setCardSets() {
  localStorage.setItem("cardSets", elements.cardSetsSelect.value);
  restart();
}

function resetScores() {
  const bestScoreKey = `bestScore${gameState.numberOfCards}`;
  localStorage.setItem(bestScoreKey, "0");
  elements.scoreBoard.best.textContent = "0";
}

function restart() {
  setCards();
}

// Initialize the game
(function () {
  console.clear();
  renderBoard();
})();
