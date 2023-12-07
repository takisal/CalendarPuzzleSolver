const dayNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
];
const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdaysSet = new Set(weekdays);
const monthsSet = new Set(months);
const allDateCombinations = new Set();
for (let dayNumber = 1; dayNumber <= 31; dayNumber++) {
  for (let j = 0; j < 7; j++) {
    for (let k = 0; k < 12; k++) {
      let date = weekdays[j] + ", " + months[k] + " " + dayNumber;
      allDateCombinations.add(date);
    }
  }
}
function newBoard() {
  return [
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", null],
    ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", null],
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31, "Sun", "Mon", "Tues", "Wed"],
    [null, null, null, null, "Thur", "Fri", "Sat"],
  ];
}
function copyBoard(inputBoard) {
  let result = [];
  for (let i = 0; i < inputBoard.length; i++) {
    result.push(inputBoard[i].slice());
  }
  return result;
}
const board = newBoard();
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
function flipVertically(piece) {
  let newPiece = [];
  for (let y = piece.length - 1; y >= 0; y--) {
    let newRow = [];
    for (let x = 0; x < piece[y].length; x++) {
      newRow.push(piece[y][x]);
    }
    newPiece.push(newRow);
  }
  return newPiece;
}
function flipHorizontally(piece) {
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
  let hFlippedPiece = flipHorizontally(rawPieces[i]);
  piece.push(hFlippedPiece);
  for (let i = 0; i < 3; i++) {
    hFlippedPiece = rotate(hFlippedPiece);
    piece.push(hFlippedPiece);
  }
  let vFlippedPiece = flipVertically(rawPieces[i]);
  piece.push(vFlippedPiece);
  for (let i = 0; i < 3; i++) {
    vFlippedPiece = rotate(vFlippedPiece);
    piece.push(vFlippedPiece);
  }
  pieces.push(piece);
}
let monthsCoordsSet = new Set();
let weekdaysCoordsSet = new Set();
let coordMap = new Map();
for (let i = 0; i < board.length; i++) {
  for (let j = 0; j < board[i].length; j++) {
    let spot = board[i][j];
    if (monthsSet.has(spot)) {
      monthsCoordsSet.add(i + "," + j);
    } else if (weekdaysSet.has(spot)) {
      weekdaysCoordsSet.add(i + "," + j);
    }
    coordMap.set(i + "," + j, board[i][j]);
  }
}
function findShownDay(remainingCoordsSet) {
  if (remainingCoordsSet.size != 3) {
    return "";
  }
  let month = "";
  let weekday = "";
  let dayNumber = "";
  remainingCoordsSet.forEach((spot) => {
    if (monthsCoordsSet.has(spot)) {
      month = spot;
    } else if (weekdaysCoordsSet.has(spot)) {
      weekday = spot;
    } else {
      dayNumber = spot;
    }
  });
  let dateString = coordMap.get(weekday) + ", " + coordMap.get(month) + " " + coordMap.get(dayNumber);
  return dateString;
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
function checkValid(currentPiece, remainingCoordsSet, x, y) {
  if (!remainingCoordsSet.has(y + "," + x)) {
    return false;
  }
  let coordsAdded = [];
  let monthsAdded = 0;
  let weekdaysAdded = 0;
  let dayNumbersAdded = 0;
  for (let i = 0; i < currentPiece.length; i++) {
    for (let j = 0; j < currentPiece[i].length; j++) {
      if (currentPiece[i][j] == true) {
        if (x + j >= 7 || y + i >= 8 || x + j < 0 || y + i < 0) {
          return false;
        }
        if (!remainingCoordsSet.has(y + i + "," + (x + j))) {
          return false;
        }
        let spot = board[y + i][x + j];
        if (monthsSet.has(spot)) {
          monthsAdded++;
        } else if (weekdaysSet.has(spot)) {
          weekdaysAdded++;
        } else {
          dayNumbersAdded++;
        }
        coordsAdded.push(y + i + "," + (x + j));
      }
    }
  }
  let newRemainingCoords = new Set(remainingCoordsSet);
  for (let i = 0; i < coordsAdded.length; i++) {
    newRemainingCoords.delete(coordsAdded[i]);
  }
  return { remainingCoords: newRemainingCoords, monthsAdded, weekdaysAdded, dayNumbersAdded };
}
let visited = new Set();
const unshownDays = allDateCombinations;
function recur(remainingCoordsSet, rounds, monthsCount, weekdaysCount, dayNumbersCount) {
  if (monthsCount == 0 || weekdaysCount == 0 || dayNumbersCount == 0) {
    return;
  }
  if (rounds == 10) {
    dayShown = findShownDay(remainingCoordsSet);
    if (dayShown == "") {
      return;
    }
    if (unshownDays.has(dayShown)) {
      unshownDays.delete(dayShown);
      console.log("Got day: ", dayShown);
      console.log("Remaining days: ", unshownDays.size);
    }
    return;
  }

  for (let k = 0; k < pieces[rounds].length; k++) {
    let currentPiece = pieces[rounds][k];
    for (let y = monthsCount == 1 ? 2 : 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        let validityObject = checkValid(currentPiece, remainingCoordsSet, x, y);
        if (validityObject != false) {
          let { remainingCoords, monthsAdded, weekdaysAdded, dayNumbersAdded } = validityObject;
          recur(
            remainingCoords,
            rounds + 1,
            monthsCount - monthsAdded,
            weekdaysCount - weekdaysAdded,
            dayNumbersCount - dayNumbersAdded
          );
        }
      }
    }
  }
}
let coordsSet = new Set();
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 8; j++) {
    coordsSet.add(j + "," + i);
  }
}
coordsSet.delete("0,6");
coordsSet.delete("1,6");
coordsSet.delete("7,0");
coordsSet.delete("7,1");
coordsSet.delete("7,2");
coordsSet.delete("7,3");
recur(coordsSet, 0, 12, 7, 31);
console.log(unshownDays.size);
