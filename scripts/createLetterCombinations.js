const letters = ["a", "o", "e", "u", "h", "t", "n", "s"];

function createTwoLetterCombos(arr) {
  let combinationsArr = [];
  letters.map((letter1) => {
    letters.map((letter2) => {
      if (letter1 !== letter2) {
        combinationsArr.push(letter1.concat(letter2));
      }
    });
  });
  console.log(combinationsArr);
}

function createThreeLetterCombos(arr) {
  let combinationsArr = [];
  arr.flatMap((letter1) => {
    arr.flatMap((letter2) => {
      arr.map((letter3) => {
        if (letter1 !== letter2 && letter1 !== letter2 && letter2 !== letter3 && letter1 !== letter3) {
          combinationsArr.push(letter1.concat(letter2).concat(letter3));
        }
      });
    });
  });

  console.log(combinationsArr);
  return combinationsArr;
}

const twoLettersArr = createTwoLetterCombos(letters);
const threeLettersArr = createThreeLetterCombos(letters);
