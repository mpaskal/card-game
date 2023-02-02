// set cards
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
    "image-7",
    "image-7",
    "image-8",
    "image-8",
    "image-9",
    "image-9",
    "image-10",
    "image-10",
    "image-11",
    "image-11",
    "image-12",
    "image-12",
  ];

  const defaultNumberOfCards = 12;
  if (localStorage.getItem("cardsnumber") == null) {
    localStorage.setItem("cardsnumber", defaultNumberOfCards);
  } else {
    document.querySelector("#number-cards").value =
      localStorage.getItem("cardsnumber");
  }
  let numberOfCards = localStorage.getItem("cardsnumber");
  let cardsRandom = shuffle(cardsOrd, numberOfCards);
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

  // set music
  if (
    localStorage.getItem("music") != null ||
    localStorage.getItem("music") != undefined
  ) {
    document.querySelector("#music").value = localStorage.getItem("music");
  } else {
    localStorage.setItem("music", document.querySelector("#music").value);
    document.querySelector("#music").value = localStorage.getItem("music");
  }
  if (document.querySelector("#music").value.length < 5) {
    document.querySelector("#music").style.width = "80px";
  } else {
    document.querySelector("#music").style.width = "200px";
  }

  let dateCopyright = todayDate();
  document.querySelector(
    ".copyright"
  ).innerHTML = `Copyright &copy; ${dateCopyright} LivenLab`;

  setMusic();
  // get list of cards
  const cards = document.querySelectorAll(".card");

  // game setup
  cards.forEach((elem) => {
    elem.classList.add(cardsRandom.pop());
    elem.addEventListener("click", onCardClick);
  });
}

// generate a random number
function calcRandomNumber(newLength) {
  return Math.floor(Math.random() * newLength);
}

// adjust array size
function arraySize(array, newLength) {
  let originalArrayLength = array.length;
  while (originalArrayLength > newLength) {
    array.pop();
    originalArrayLength--;
  }
  return array;
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

function playAll() {
  let i = 1;
  let nextSong = "";
  const audioPlayer = document.querySelector("#music-control");
  audioPlayer.src = `./assets/music/1.mp3`;
  document.querySelector("#music-control").addEventListener(
    "ended",
    function () {
      i += 1;
      nextSong = `./assets/music/${i}.mp3`;
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
  localStorage.setItem("music", document.querySelector("#music").value);
  if (
    localStorage.getItem("music") != "none" &&
    localStorage.getItem("music") != "Play All"
  ) {
    musicControl.removeAttribute("hidden");
    musicControl.setAttribute(
      "src",
      `./assets/music/${localStorage.getItem("music")}.mp3`
    );
  } else if (
    localStorage.getItem("music") == "none" &&
    !musicControl.getAttribute("hidden")
  ) {
    musicControl.setAttribute("hidden", "hidden");
    musicControl.setAttribute("src", "");
  } else if (localStorage.getItem("music") == "Play All") {
    musicControl.removeAttribute("hidden");
    playAll();
  }
  if (document.querySelector("#music").value == "none") {
    document.querySelector("#music").style.width = "80px";
  } else {
    document.querySelector("#music").style.width = "200px";
  }
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
  window.location.reload();
}

// start the game on page load
(function () {
  console.clear();
  renderBoard();
})();
