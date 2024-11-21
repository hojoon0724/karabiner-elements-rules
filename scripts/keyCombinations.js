const fs = require("fs").promises;

const singlesAndQuadRules = [
  {
    from: {
      simultaneous: [{ key_code: "a" }, { key_code: "o" }, { key_code: "e" }, { key_code: "u" }],
    },
    to_if_held_down: [{ key_code: "left_shift", modifiers: ["left_command", "left_option", "left_control"] }],
    type: "basic",
  },
  {
    from: { key_code: "a" },
    to_delayed_action: { to_if_canceled: [{ key_code: "a" }], to_if_invoked: [{ key_code: "vk_none" }] },
    to_if_alone: [{ halt: true, key_code: "a" }],
    to_if_held_down: [{ halt: true, key_code: "left_shift" }],
    type: "basic",
  },
  {
    from: { key_code: "o" },
    to_delayed_action: { to_if_canceled: [{ key_code: "o" }], to_if_invoked: [{ key_code: "vk_none" }] },
    to_if_alone: [{ halt: true, key_code: "o" }],
    to_if_held_down: [{ halt: true, key_code: "left_control" }],
    type: "basic",
  },
  {
    from: { key_code: "e" },
    to_delayed_action: { to_if_canceled: [{ key_code: "e" }], to_if_invoked: [{ key_code: "vk_none" }] },
    to_if_alone: [{ halt: true, key_code: "e" }],
    to_if_held_down: [{ halt: true, key_code: "left_option" }],
    type: "basic",
  },
  {
    from: { key_code: "u" },
    to_delayed_action: { to_if_canceled: [{ key_code: "u" }], to_if_invoked: [{ key_code: "vk_none" }] },
    to_if_alone: [{ halt: true, key_code: "u" }],
    to_if_held_down: [{ halt: true, key_code: "left_command" }],
    type: "basic",
  },
  {
    from: {
      simultaneous: [{ key_code: "h" }, { key_code: "t" }, { key_code: "n" }, { key_code: "s" }],
    },
    to_if_held_down: [{ key_code: "right_shift", modifiers: ["right_command", "right_option", "right_control"] }],
    type: "basic",
  },
  {
    from: { key_code: "h" },
    to_delayed_action: { to_if_canceled: [{ key_code: "h" }], to_if_invoked: [{ key_code: "vk_none" }] },
    to_if_alone: [{ halt: true, key_code: "h" }],
    to_if_held_down: [{ halt: true, key_code: "right_command" }],
    type: "basic",
  },
  {
    from: { key_code: "t" },
    to_delayed_action: { to_if_canceled: [{ key_code: "t" }], to_if_invoked: [{ key_code: "vk_none" }] },
    to_if_alone: [{ halt: true, key_code: "t" }],
    to_if_held_down: [{ halt: true, key_code: "right_option" }],
    type: "basic",
  },
  {
    from: { key_code: "n" },
    to_delayed_action: { to_if_canceled: [{ key_code: "n" }], to_if_invoked: [{ key_code: "vk_none" }] },
    to_if_alone: [{ halt: true, key_code: "n" }],
    to_if_held_down: [{ halt: true, key_code: "right_control" }],
    type: "basic",
  },
  {
    from: { key_code: "s" },
    to_delayed_action: { to_if_canceled: [{ key_code: "s" }], to_if_invoked: [{ key_code: "vk_none" }] },
    to_if_alone: [{ halt: true, key_code: "s" }],
    to_if_held_down: [{ halt: true, key_code: "right_shift" }],
    type: "basic",
  },
];

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

  return combinationsArr;
}

function createThreeLetterCombos(arr) {
  let combinationsArr = [];
  arr.map((letter1) => {
    arr.map((letter2) => {
      arr.map((letter3) => {
        if (letter1 !== letter2 && letter2 !== letter3 && letter1 !== letter3) {
          combinationsArr.push(letter1.concat(letter2).concat(letter3));
        }
      });
    });
  });

  return combinationsArr;
}

const twoLettersArr = createTwoLetterCombos(letters);
const threeLettersArr = createThreeLetterCombos(letters);

const keyAssignmentMap = new Map([
  ["a", "left_shift"],
  ["o", "left_control"],
  ["e", "left_option"],
  ["u", "left_command"],
  ["s", "right_shift"],
  ["n", "right_control"],
  ["t", "right_option"],
  ["h", "right_command"],
]);

const destinationFile = "./scriptGeneratedCombinations.json";

function writeToFile(destinationFile, content) {
  fs.writeFile(destinationFile, JSON.stringify(content, null, 2));
}

function createKeyCombinationRule(str) {
  const strArr = str.split("");

  const simultaneousAndToIfAlone = [];
  strArr.map((letter) => {
    let object = { key_code: letter };
    simultaneousAndToIfAlone.push(object);
  });

  const toIfHeldDown = [];
  let modifiersArr = [];

  for (i = 0; i < strArr.length; i++) {
    if (i === 0) {
      toIfHeldDown.push({ key_code: keyAssignmentMap.get(strArr[i]) });
    } else {
      modifiersArr.push(keyAssignmentMap.get(strArr[i]));
    }
  }

  toIfHeldDown[0] = { ...toIfHeldDown[0], modifiers: modifiersArr };

  let assembledRule = {
    from: {
      simultaneous: simultaneousAndToIfAlone,
      // simultaneous_options: { key_down_order: "strict" },
    },
    to_if_alone: simultaneousAndToIfAlone,
    to_if_held_down: toIfHeldDown,
    type: "basic",
  };

  return assembledRule;
}

function processKeyCombinationArr(arr) {
  const rules = [];
  arr.map((str) => {
    rules.push(createKeyCombinationRule(str));
  });
  return rules;
}

let compiledRules = [...singlesAndQuadRules, ...processKeyCombinationArr(twoLettersArr), ...processKeyCombinationArr(threeLettersArr)];

writeToFile(destinationFile, compiledRules);
