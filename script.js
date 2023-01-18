// Matching game
// Render the board randomly for a new game:
function renderBoard() {
  const cardsOrd = [
    "image-1",
    "image-1",
    "image-2",
    "image-2",
    "image-3",
    "image-3",
    "image-4",
    "image-4",
    "image-5",
    "image-5",
    "image-6",
    "image-6",
    "image-1",
    "image-1",
    "image-2",
    "image-2",
    "image-3",
    "image-3",
    "image-4",
    "image-4",
    "image-5",
    "image-5",
    "image-6",
    "image-6",
  ];

  const defaultNumberOfCards = 12;
  let numberOfCards = localStorage.getItem("cardsnumber");
  if (numberOfCards == null) {
    numberOfCards = defaultNumberOfCards;
    localStorage.setItem("cardsnumber", 0);
  } else {
    document.querySelector("#number-cards").value =
      localStorage.getItem("cardsnumber");
  }
  let cardsRandom = shuffle(cardsOrd, numberOfCards);

  localStorage.setItem("cardsnumber", numberOfCards);

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
  document.querySelector(
    "#cards-number"
  ).textContent = ` ${localStorage.getItem("cardsnumber")} `;

  document.querySelector(".congrats-container").style.display = "none";

  for (let i = 0; i < cardsRandom.length; i++) {
    let div = document.createElement("div");
    div.className = "card";
    document.querySelector(".board").appendChild(div);
  }

  // get list of cards;
  const cards = document.querySelectorAll(".card");
  // game setup
  cards.forEach((elem) => {
    elem.classList.add(cardsRandom.pop());
    elem.addEventListener("click", onCardClick);
  });
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

// Check if the pair of cards are a match:
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
  restart();
}

function resetScores() {
  let currentNum = document.querySelector("#cards-number").textContent.trim();
  localStorage.setItem(`bestscore${currentNum}`, 0);
  document.querySelector("#score-best").textContent = `${localStorage.getItem(
    `bestscore${currentNum}`
  )}`;
}

// randomize an array
function shuffle(array, length) {
  let currentIndex = length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  while (array.length > length) {
    array.pop();
  }
  return array;
}

function restart() {
  window.location.reload();
}

// Start the game on page load
(function () {
  console.clear();
  renderBoard();
})();
