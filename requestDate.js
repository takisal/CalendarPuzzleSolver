const dayNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
];

const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdaysSet = new Set(weekdays);
const monthsSet = new Set(months);
const daysSet = new Set(dayNumbers);
function searchForSolution(weekdayTarget, monthTarget, dateTarget) {
  console.log({ weekdayTarget, monthTarget, dateTarget });
  const allDateCombinations = new Set();
  for (let dayNumber = 1; dayNumber <= 31; dayNumber++) {
    for (let j = 0; j < 7; j++) {
      for (let k = 0; k < 12; k++) {
        let date = weekdays[j] + ", " + months[k] + " " + dayNumber;
        allDateCombinations.add(date);
      }
    }
  }
  function createBoard() {
    let board = [
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", null],
      ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", null],
      [1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19, 20, 21],
      [22, 23, 24, 25, 26, 27, 28],
      [29, 30, 31, "Sun", "Mon", "Tues", "Wed"],
      [null, null, null, null, "Thur", "Fri", "Sat"],
    ];
    return board;
  }
  let board = createBoard();
  let coordMap = new Map();
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      coordMap.set(combine(i, j), board[i][j]);
    }
  }
  function combine(y, x) {
    return y * 7 + x;
  }
  function uncombine(z) {
    let x = z % 7;
    let y = (z - x) / 7;
    return { y, x };
  }
  let rawPieces = [
    [
      [true, true, true],
      [true, true, false],
    ],
    [
      [true, true],
      [true, false],
      [true, true],
    ],
    [
      [true, true],
      [true, false],
      [true, false],
    ],
    [
      [true, false, false],
      [true, true, true],
      [false, false, true],
    ],
    [[true, true, true, true]],
    [
      [true, true, true, true],
      [false, false, false, true],
    ],
    [
      [true, true, true],
      [false, true, false],
      [false, true, false],
    ],
    [
      [false, true],
      [false, true],
      [true, true],
      [true, false],
    ],
    [
      [true, false],
      [true, true],
      [false, true],
    ],
    [
      [false, false, true],
      [false, false, true],
      [true, true, true],
    ],
  ];
  let pieces = [];
  function rotate(piece) {
    let newPiece = [];
    for (let x = 0; x < piece[0].length; x++) {
      let newRow = [];
      for (let y = piece.length - 1; y >= 0; y--) {
        newRow.push(piece[y][x]);
      }
      newPiece.push(newRow);
    }
    return newPiece;
  }

  function flip(piece) {
    let newPiece = [];
    for (let y = 0; y < piece.length; y++) {
      let newRow = [];
      for (let x = piece[y].length - 1; x >= 0; x--) {
        newRow.push(piece[y][x]);
      }
      newPiece.push(newRow);
    }
    return newPiece;
  }

  for (let i = 0; i < rawPieces.length; i++) {
    let piece = [];
    piece.push(rawPieces[i]);
    let currentPiece = rawPieces[i];
    for (let i = 0; i < 3; i++) {
      currentPiece = rotate(currentPiece);
      piece.push(currentPiece);
    }
    let flippedPiece = flip(rawPieces[i]);
    piece.push(flippedPiece);
    for (let i = 0; i < 3; i++) {
      flippedPiece = rotate(flippedPiece);
      piece.push(flippedPiece);
    }
    pieces.push(piece);
  }

  function findShownDay(coordsMask) {
    let month = "";
    let weekday = "";
    let dayNumber = "";
    for (let i = 0; i < coordsMask.length; i++) {
      if (coordsMask[i] == false) {
        if (i < 14) {
          month = i;
        } else if (i < 45) {
          dayNumber = i;
        } else {
          weekday = i;
        }
      }
    }
    let dateObject = { weekday: coordMap.get(weekday), month: coordMap.get(month), day: coordMap.get(dayNumber) };
    return dateObject;
  }
  function filterPiece(pieceOrientations) {
    outerLoop: for (let i = 1; i < pieceOrientations.length; i++) {
      for (let j = i - 1; j >= 0; j--) {
        if (pieceOrientations[i].join("X") === pieceOrientations[j].join("X")) {
          pieceOrientations.splice(i, 1);
          i--;
          continue outerLoop;
        }
      }
    }
  }
  for (let i = 0; i < pieces.length; i++) {
    filterPiece(pieces[i]);
  }
  function checkValid(currentPiece, x, y, usedCoordsMask, pieceNumber) {
    let coordsAdded = [];
    let monthsAdded = 0;
    let weekdaysAdded = 0;
    let dayNumbersAdded = 0;
    for (let i = 0; i < currentPiece.length; i++) {
      for (let j = 0; j < currentPiece[i].length; j++) {
        if (currentPiece[i][j] == true) {
          let singleDimensionCoord = combine(y + i, x + j);
          if (usedCoordsMask[singleDimensionCoord]) {
            return false;
          }
          let newlyCoveredSpot = coordMap.get(singleDimensionCoord);
          if (
            newlyCoveredSpot === weekdayTarget ||
            newlyCoveredSpot === monthTarget ||
            newlyCoveredSpot === dateTarget
          ) {
            return false;
          }
          if (singleDimensionCoord < 14) {
            monthsAdded++;
          } else if (singleDimensionCoord < 45) {
            dayNumbersAdded++;
          } else {
            weekdaysAdded++;
          }
          coordsAdded.push(singleDimensionCoord);
        }
      }
    }
    let newMask = usedCoordsMask.slice();

    for (let i = 0; i < coordsAdded.length; i++) {
      newMask[coordsAdded[i]] = pieceNumber;
    }
    return {
      monthsAdded,
      weekdaysAdded,
      dayNumbersAdded,
      nextMask: newMask,
    };
  }
  let split = [];
  function splitFunction(root) {
    let a = 0;
    let b = 0;
    if (root < 29) {
      a = 2 ** root;
    } else {
      b = 2 ** (root - 29);
    }
    return { a, b };
  }
  for (let i = 0; i < 60; i++) {
    split.push(splitFunction(i));
  }
  function convertToBoard(mask) {
    let displayBoard = createBoard();
    let k = 0;
    for (let i = 0; i < displayBoard.length; i++) {
      for (let j = 0; j < displayBoard[i].length; j++) {
        if (mask[k] !== true && mask[k] !== false) {
          displayBoard[i][j] = "-" + mask[k] + "-";
        }
        if (mask[k] === true) {
          displayBoard[i][j] = "___";
        } else if (displayBoard[i][j] === dateTarget) {
          displayBoard[i][j] = " " + displayBoard[i][j].toString() + " ";
        }
        k++;
      }
    }
    return displayBoard;
  }
  let progress = 0.0;
  let visited = new Set();
  let targetDateFlag = false;
  let progressCalculations = 0;
  console.time("Runtime");
  function recur(rounds, monthsCount, weekdaysCount, dayNumbersCount, usedCoordsMask) {
    if (targetDateFlag) {
      return;
    }
    if (monthsCount === 0 || weekdaysCount === 0 || dayNumbersCount === 0) {
      return;
    }

    if (rounds == 10) {
      dayShown = findShownDay(usedCoordsMask);
      if (dayShown == "") {
        return;
      }
      console.timeEnd("Runtime");
      console.log("Got day: ", dayShown);
      console.log("Solution:");
      console.dir(
        convertToBoard(usedCoordsMask).map((d) => d.join(", ")),
        { depth: null, outerWidth: 8 }
      );
      targetDateFlag = true;
      return;
    }

    for (let k = 0; k < pieces[rounds].length; k++) {
      let currentPiece = pieces[rounds][k];
      for (let z = monthsCount == 1 ? 14 : 0; z < (weekdaysCount == 1 ? 45 : 48); z++) {
        if (rounds === 1 && targetDateFlag === false) {
          progress += 1 / (pieces[rounds].length * 46) ** 2;
          progressCalculations++;
          if (progressCalculations % 10 == 0) {
            console.log("Worst-case scenario progress: " + (progress * 100).toString().slice(0, 7) + "%");
          }
        }
        if (usedCoordsMask[z] !== false) {
          continue;
        }
        let { x, y } = uncombine(z);
        let j = currentPiece[0].length - 1;
        let i = currentPiece.length - 1;
        if (x + j >= 7 || y + i >= 8 || x + j < 0 || y + i < 0) {
          continue;
        }
        let validityObject = checkValid(currentPiece, x, y, usedCoordsMask, rounds == 0 ? "Y" : rounds);
        if (validityObject != false) {
          let { monthsAdded, weekdaysAdded, dayNumbersAdded, nextMask } = validityObject;
          recur(
            rounds + 1,
            monthsCount - monthsAdded,
            weekdaysCount - weekdaysAdded,
            dayNumbersCount - dayNumbersAdded,
            nextMask
          );
        }
      }
    }
  }

  let mask = new Array(56).fill(false);
  function prep(x) {
    mask[x] = true;
  }
  prep(combine(0, 6));
  prep(combine(1, 6));
  prep(combine(7, 0));
  prep(combine(7, 1));
  prep(combine(7, 2));
  prep(combine(7, 3));
  recur(0, 12, 7, 31, mask);
}
let inputArray = process.argv.slice(2).map((d) => d[0].toUpperCase() + d.substr(1).toLowerCase());
let inputDay;
let inputWeekday;
let inputMonth;
for (let i = 0; i < inputArray.length; i++) {
  let currentInput = inputArray[i];
  if (daysSet.has(parseInt(currentInput))) {
    inputDay = parseInt(currentInput);
  } else if (weekdaysSet.has(currentInput)) {
    inputWeekday = currentInput;
  } else if (monthsSet.has(currentInput)) {
    inputMonth = currentInput;
  } else {
    console.log("Error: Invalid arguments");
    return;
  }
}
searchForSolution(inputWeekday, inputMonth, inputDay);
