const totalSets = 8;
const totalCards = 9 * totalSets;
const defaultNumberOfCards = 12;
const defaultCardSets = "all";
let numberOfCards = defaultNumberOfCards;
let cardSets = defaultCardSets;
let cards = [];

function renderBoard() {
  let dateCopyright = todayDate();
  document.querySelector(
    ".copyright"
  ).innerHTML = `Copyright &copy; ${dateCopyright} LivenLab`;

  setMusic();
  setCards();
}

function setCards() {
  let cardSet = [];

  document.querySelector(".congrats-container").style.display = "none";
  setCardsNumber();
  setStartingCardSets();
  setScores();
  clearCards();

  for (let i = 1; i <= totalCards; i++) {
    cardSet.push(i);
  }

  if (cardSets == "totoro") {
    cardSet = cardSet.slice(0, 9);
  } else if (cardSets == "kiki") {
    cardSet = cardSet.slice(9, 18);
  } else if (cardSets == "woth") {
    cardSet = cardSet.slice(18, 27);
  } else if (cardSets == "mononoke") {
    cardSet = cardSet.slice(27, 36);
  } else if (cardSets == "spirited-away") {
    cardSet = cardSet.slice(36, 45);
  } else if (cardSets == "howl") {
    cardSet = cardSet.slice(45, 54);
  } else if (cardSets == "arrietty") {
    cardSet = cardSet.slice(54, 63);
  } else if (cardSets == "marnie") {
    cardSet = cardSet.slice(63, 72);
  }

  cardSet = cardSet.concat(cardSet);

  let cardsRandom = shuffle(cardSet, numberOfCards);

  for (let i = 0; i < cardsRandom.length; i++) {
    let div = document.createElement("div");
    div.className = "card";
    document.querySelector(".cards-container").appendChild(div);
  }

  cards = document.querySelectorAll(".card");

  cards.forEach((elem) => {
    let cardNumber = cardsRandom.pop();
    elem.classList.add("image-" + cardNumber);
    elem.classList.add("pos-" + (cardNumber % 9 + 1));
    elem.classList.add(getSet(cardNumber));
    elem.addEventListener("click", onCardClick);
  });
}

function getSet(cardNumber) {
  let set = "";

  if (cardNumber <= 9) {
    set = "totoro";
  } else if (cardNumber <= 18) {
    set = "kiki";
  } else if (cardNumber <= 27) {
    set = "woth"
  } else if (cardNumber <= 36) {
    set = "mononoke"
  } else if (cardNumber <= 45) {
    set = "spirited-away"
  } else if (cardNumber <= 54) {
    set = "howl"
  } else if (cardNumber <= 63) {
    set = "arrietty"
  } else if (cardNumber <= 72) {
    set = "marnie"
  }

  return set;
}

function clearCards() {
  const container = document.querySelector(".cards-container");
  while (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

function setScores() {
  let numBestResult = localStorage.getItem(`bestscore${numberOfCards}`);
  if (numBestResult == null) {
    localStorage.setItem(`bestscore${numberOfCards}`, 0);
  }
  localStorage.setItem("lastscore", 0);

  document.querySelector("#score-best").textContent = `${localStorage.getItem(
    `bestscore${numberOfCards}`
  )}`;

  document.querySelector("#score-last").textContent = `${localStorage.getItem(
    "lastscore"
  )} `;
}

function setCardsNumber() {
  if (localStorage.getItem("cardsnumber") == null) {
    localStorage.setItem("cardsnumber", defaultNumberOfCards);
  } else {
    document.querySelector("#number-cards").value =
      localStorage.getItem("cardsnumber");
  }
  numberOfCards = localStorage.getItem("cardsnumber");

  document.querySelector(
    "#cards-number"
  ).textContent = ` ${numberOfCards} `;
}

function setStartingCardSets() {
  if (localStorage.getItem("cardsets") == null) {
    localStorage.setItem("cardsets", defaultCardSets);
  } else {
    document.querySelector("#card-sets").value =
      localStorage.getItem("cardsets");
  }
  cardSets = localStorage.getItem("cardsets");
}

// generate a random number
function calcRandomNumber(newLength) {
  return Math.floor(Math.random() * newLength);
}

// adjust array size
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

// randomize an array
function shuffle(array, newLength) {
  let currentIndex = newLength - 1;
  let adjustedArray = arraySize(array, newLength);

  while (currentIndex != 0) {
    let randomIndex = calcRandomNumber(newLength);

    [adjustedArray[currentIndex], adjustedArray[randomIndex]] = [
      adjustedArray[randomIndex],
      adjustedArray[currentIndex],
    ];
    currentIndex--;
  }
  return adjustedArray;
}

function onCardClick(e) {
  let el = e.target;
  let maxOpenCards =
    document.querySelectorAll(".flipped-up").length -
    document.querySelectorAll(".done").length;
  localStorage.setItem("lastscore", +localStorage.getItem("lastscore") + 1);
  if (maxOpenCards < 2) {
    flipCard(el);
    document.querySelector(
      "#score-last"
    ).textContent = ` ${localStorage.getItem("lastscore")} `;
  }
}

function flipCard(el) {
  let card = el.getAttribute("class");
  if (!card.split(" ").includes("done")) {
    if (card.split(" ").includes("flipped-up")) {
      el.classList.remove("flipped-up");
    } else {
      if (document.querySelectorAll(".flipped-up").length) {
        isMatchingPair(card, el);
      } else {
        el.classList.add("flipped-up");
      }
    }
  }
}

// check if the pair of cards are match:
function isMatchingPair(card, el) {
  const waitingTime = 1000;
  let cardImg = card
    .replace("card", "")
    .split(" ")
    .filter((n) => n);
  document.querySelectorAll(".flipped-up").forEach(function (elFlipped) {
    if (
      elFlipped.classList.value.split(" ").includes(cardImg[0]) &&
      !elFlipped.classList.value.split(" ").includes("done")
    ) {
      el.classList.add("flipped-up");
      elFlipped.classList.add("done");
      el.classList.add("done");
    } else {
      el.classList.add("flipped-up");
    }
    if (!elFlipped.classList.value.split(" ").includes("done")) {
      setTimeout(() => elFlipped.classList.remove("flipped-up"), waitingTime);
      setTimeout(() => el.classList.remove("flipped-up"), waitingTime);
    }
  });
  if (
    document.querySelectorAll(".done").length >
      localStorage.getItem("cardsnumber") - 1 &&
    document.querySelectorAll(".flipped-up").length >
      localStorage.getItem("cardsnumber") - 1
  ) {
    isGameOver();
  }
}

function loopMusic() {
  if (document.querySelector("#music-control").getAttribute("loop") == null) {
    document.querySelector("#music-control").setAttribute("loop", "loop");
    document.querySelector(".fa-rotate").setAttribute("title", "Loop On");
    document.querySelector(".loopLabel").textContent = "On";
  } else {
    document.querySelector("#music-control").removeAttribute("loop");
    document.querySelector(".fa-rotate").setAttribute("title", "Loop Off");
    document.querySelector(".loopLabel").textContent = "Off";
  }
}

function isGameOver() {
  let currentNum = document.querySelector("#cards-number").textContent.trim();
  if (
    +localStorage.getItem(`bestscore${currentNum}`) >
      +localStorage.getItem("lastscore") ||
    +localStorage.getItem(`bestscore${currentNum}`) == 0
  ) {
    localStorage.setItem(
      `bestscore${currentNum}`,
      localStorage.getItem("lastscore")
    );
  }
  document.querySelector("#score-best").textContent = localStorage.getItem(
    `bestscore${currentNum}`
  );
  setTimeout(() => {
    document.querySelector(".congrats-container").style.display = "block";
  }, 500);
}

function setNumberOfCards() {
  localStorage.setItem(
    "cardsnumber",
    document.querySelector("#number-cards").value
  );
  localStorage.getItem("cardsnumber");
  restart();
}

function setCardSets() {
  localStorage.setItem(
    "cardsets",
    document.querySelector("#card-sets").value
  );
  localStorage.getItem("card-sets");
  restart();
}

function playAll() {
  let i = 1;
  let nextSong = "";
  const audioPlayer = document.querySelector("#music-control");
  if (
    localStorage.getItem("music") != "none" &&
    localStorage.getItem("music") != "Play All" &&
    localStorage.getItem("music") != null
  ) {
    audioPlayer.src = `./assets/music/${localStorage.getItem("music")}.mp3`;
  } else if (localStorage.getItem("trackForPlayAll") != null) {
    audioPlayer.src = `./assets/music/${localStorage.getItem(
      "trackForPlayAll"
    )}.mp3`;
  } else {
    console.log("last");
    localStorage.setItem("trackForPlayAll", i);
    audioPlayer.src = `./assets/music/${localStorage.getItem(
      "trackForPlayAll"
    )}.mp3`;
  }

  document.querySelector("#music-control").addEventListener(
    "ended",
    function () {
      i += 1;
      nextSong = `./assets/music/${i}.mp3`;
      localStorage.setItem("trackForPlayAll", i);
      audioPlayer.src = nextSong;
      audioPlayer.load();
      audioPlayer.play();
      if (i == 24) {
        i = 0;
      }
    },
    false
  );
}
function setMusic() {
  let musicControl = document.querySelector("#music-control");
  let playerReset = document.querySelector("#audio-reset");
  localStorage.setItem("music", document.querySelector("#music").value);
  if (
    localStorage.getItem("music") != "none" &&
    localStorage.getItem("music") != "Play All"
  ) {
    musicControl.removeAttribute("hidden");
    playerReset.removeAttribute("hidden");
    musicControl.setAttribute(
      "src",
      `./assets/music/${localStorage.getItem("music")}.mp3`
    );
  } else if (
    localStorage.getItem("music") == "none" &&
    !musicControl.getAttribute("hidden")
  ) {
    playerReset.setAttribute("hidden", "hidden");
    musicControl.setAttribute("hidden", "hidden");
    musicControl.setAttribute("src", "");
  } else if (localStorage.getItem("music") == "Play All") {
    playerReset.removeAttribute("hidden");
    musicControl.removeAttribute("hidden");
    playAll();
  }
  if (document.querySelector("#music").value == "none") {
    document.querySelector("#music").style.width = "80px";
  } else {
    document.querySelector("#music").style.width = "200px";
  }
}

function resetPlayer() {
  let musicControl = document.querySelector("#music-control");
  let playerReset = document.querySelector("#audio-reset");
  playerReset.setAttribute("hidden", "hidden");
  musicControl.setAttribute("hidden", "hidden");
  musicControl.setAttribute("src", "");
  localStorage.setItem("music", "none");
  document.querySelector("#music").value = localStorage.getItem("music");
  localStorage.removeItem("music");
  localStorage.removeItem("trackForPlayAll");
}

function resetScores() {
  let currentNum = document.querySelector("#cards-number").textContent.trim();
  localStorage.setItem(`bestscore${currentNum}`, 0);
  document.querySelector("#score-best").textContent = `${localStorage.getItem(
    `bestscore${currentNum}`
  )}`;
}

// copyright
function todayDate() {
  let date = new Date().getFullYear();
  return date;
}

function restart() {
  setCards();
}

// start the game on page load
(function () {
  console.clear();
  renderBoard();
})();
