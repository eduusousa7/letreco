const tiles = document.querySelector(".tile-container");
const backspaceAndEnterRow = document.querySelector("#backspaceAndEnterRow");
const keyboardFirstRow = document.querySelector("#keyboardFirstRow");
const keyboardSecondRow = document.querySelector("#keyboardSecondRow");
const keyboardThirdRow = document.querySelector("#keyboardThirdRow");

const keysFirstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysSecondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysThirdRow = ["Z", "X", "C", "V", "B", "N", "M"];

let sort = Math.floor(Math.random() * letreco.length);
const rows = 6;
const columns = letreco[sort].length;
let currentRow = 0;
let currentColumn = 0;
let letrecoMap = Object.entries(letreco[sort]).map((item) => item[1]);

const guesses = [];
for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
  guesses[rowIndex] = new Array(columns);
  const tileRow = document.createElement("div");
  tileRow.setAttribute("id", "row" + rowIndex);
  tileRow.setAttribute("class", "tile-row");
  for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
    const tileColumn = document.createElement("div");
    tileColumn.setAttribute("id", "row" + rowIndex + "column" + columnIndex);
    tileColumn.setAttribute(
      "class",
      rowIndex === 0 ? "tile-column typing" : "tile-column disabled"
    );
    tileRow.append(tileColumn);
    guesses[rowIndex][columnIndex] = "";
  }
  tiles.append(tileRow);
}
function verifyExist(verifyLatter) {
  return letreco
    .filter((latter) => latter.length == columns)
    .includes(verifyLatter);
}
function addClass(id, classe) {
  var elemento = document.getElementById(id);
  var classes = elemento.className.split(" ");
  var getIndex = classes.indexOf(classe);

  if (getIndex === -1) {
    classes.push(classe);
    elemento.className = classes.join(" ");
  }
}

function removeClass(id, classe) {
  var elemento = document.getElementById(id);
  var classes = elemento.className.split(" ");
  var getIndex = classes.indexOf(classe);

  if (getIndex > -1) {
    classes.splice(getIndex, 1);
  }
  elemento.className = classes.join(" ");
}

const checkGuess = () => {
  enableKeyboard();
  const guess = guesses[currentRow].join("");
  const sequence = Object.entries(guesses[currentRow].join("")).map(
    (item) => item[1]
  );
  let usedWord = [];
  if (guess.length !== columns) return;
  var currentColumns = document.querySelectorAll(".typing");
  for (let index = 0; index < columns; index++) {
    const letter = sequence[index];
    const item = letrecoMap[index];
    if (!letrecoMap.includes(letter)) usedWord.push({ letter, state: "wrong" });
    else {
      if (item === letter) usedWord.push({ letter, state: "right" });
      else {
        if (
          item !== letter &&
          !usedWord.includes(letter) &&
          usedWord
            .filter((item) => item.letter == letter)
            .map((item) => item.state).length === 0
        )
          usedWord.push({ letter, state: "displaced" });
        else usedWord.push({ letter, state: "wrong" });
      }
    }
    if (verifyExist(guess)) {
      usedWord.forEach((columns, index) => {
        currentColumns[index].classList.remove("notExist");
        currentColumns[index].classList.add(columns.state);
        addClass(guess[index], columns.state);
      });
    } else {
      usedWord.forEach((columns, index) => {
        currentColumns[index].classList.add("notExist");
      });
    }
  }
  if (verifyExist(guess)) {
    if (guess === letreco[sort]) {
      disableKeyboard();
      disableActionButton();
      window.alert("tu é demais, simplesmente o detetivao do entreterimento!");
      return;
    }

    if (currentRow === rows - 1) {
      disableKeyboard();
      disableActionButton();
      window.alert("Errrrrrou!");
    } else {
      moveToNextRow();
    }
  }
};

const moveToNextRow = () => {
  var typingColumns = document.querySelectorAll(".typing");
  for (let index = 0; index < typingColumns.length; index++) {
    typingColumns[index].classList.remove("typing");
    typingColumns[index].classList.remove("notExist");
    typingColumns[index].classList.add("disabled");
  }
  currentRow++;
  currentColumn = 0;

  const currentRowEl = document.querySelector("#row" + currentRow);
  var currentColumns = currentRowEl.querySelectorAll(".tile-column");
  for (let index = 0; index < currentColumns.length; index++) {
    currentColumns[index].classList.remove("disabled");
    currentColumns[index].classList.add("typing");
  }
};

const handleKeyboardOnClick = (key) => {
  if (currentColumn === columns) return;
  if (currentColumn === columns - 1) disableKeyboard();
  const currentTile = document.querySelector(
    "#row" + currentRow + "column" + currentColumn
  );
  currentTile.textContent = key;
  guesses[currentRow][currentColumn] = key;
  currentColumn++;
};

const createKeyboardRow = (keys, keyboardRow) => {
  keys.forEach((key) => {
    var buttonElement = document.createElement("button");
    buttonElement.textContent = key;
    buttonElement.setAttribute("id", key);
    buttonElement.setAttribute("class", "keyItem");
    buttonElement.addEventListener("click", () => handleKeyboardOnClick(key));
    keyboardRow.append(buttonElement);
  });
};

createKeyboardRow(keysFirstRow, keyboardFirstRow);
createKeyboardRow(keysSecondRow, keyboardSecondRow);
createKeyboardRow(keysThirdRow, keyboardThirdRow);

const disableActionButton = () => {
  const currentEl = document.querySelectorAll(".actionButton");
  currentEl.forEach((buttons) => {
    buttons.setAttribute("disabled", true);
    buttons.style.cursor = "default";
  });
};
const disableKeyboard = () => {
  const currentEl = document.querySelectorAll(".keyItem");
  currentEl.forEach((buttons) => {
    buttons.setAttribute("disabled", true);
    buttons.style.cursor = "default";
  });
};
const enableKeyboard = () => {
  const currentEl = document.querySelectorAll(".keyItem");
  currentEl.forEach((buttons) => {
    buttons.removeAttribute("disabled");
    buttons.style.cursor = "pointer";
  });
};

const handleBackspace = () => {
  if (currentColumn === 0) {
    return;
  }

  enableKeyboard();
  currentColumn--;
  guesses[currentRow][currentColumn] = "";
  const tile = document.querySelector(
    "#row" + currentRow + "column" + currentColumn
  );
  tile.textContent = "";
  tile.classList.remove("notExist");
};

const backspaceButton = document.createElement("button");
backspaceButton.addEventListener("click", handleBackspace);
backspaceButton.setAttribute("class", "actionButton");
backspaceButton.textContent = "<";
backspaceAndEnterRow.append(backspaceButton);

const enterButton = document.createElement("button");
enterButton.addEventListener("click", checkGuess);
enterButton.setAttribute("class", "actionButton");
enterButton.textContent = "ENTER";
backspaceAndEnterRow.append(enterButton);

document.onkeydown = function (evt) {
    evt = evt || window.evt
    if(evt.key === "Enter"){
        checkGuess();
    } else if (evt.key === "Backspace") {
        handleBackspace()
    } else if (/^[a-z]$/i.test(evt.key)) {
        handleKeyboardOnClick(evt.key.toUpperCase())
    }
};
