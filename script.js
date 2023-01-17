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
  ];

  const cardsRandom = shuffle(cardsOrd);

  if (localStorage.getItem("bestscore") !== null) {
    localStorage.setItem("bestscore", +localStorage.getItem("bestscore"));
  } else {
    localStorage.setItem("bestscore", 0);
  }
  localStorage.setItem("lastscore", 0);

  document.querySelector("#score-best").textContent = ` ${localStorage.getItem(
    "bestscore"
  )} `;
  document.querySelector("#score-last").textContent = ` ${localStorage.getItem(
    "lastscore"
  )} `;

  document.querySelector(".congrats-container").style.display = "none";

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
    if (elFlipped.classList.value.split(" ").includes(cardImg[0])) {
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
    document.querySelectorAll(".done").length > 11 &&
    document.querySelectorAll(".flipped-up").length > 11
  ) {
    isGameOver();
  }
}

function isGameOver() {
  if (+localStorage.getItem("bestscore") > +localStorage.getItem("lastscore")) {
    localStorage.setItem("bestscore", +localStorage.getItem("lastscore"));
  }
  document.querySelector("#score-best").textContent = `${localStorage.getItem(
    "bestscore"
  )}`;
  setTimeout(() => {
    document.querySelector(".congrats-container").style.display = "block";
  }, 500);
}

// randomize an array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
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
