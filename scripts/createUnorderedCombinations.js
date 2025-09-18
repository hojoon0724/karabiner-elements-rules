const fs = require("fs").promises;

const leftLetters = ["ao", "ae", "au", "oe", "ou", "eu", "aoe", "aou", "oeu", "aoeu"];
const rightLetters = ["ht", "hn", "hs", "tn", "ts", "ns", "htn", "hts", "tns", "htns"];

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

const destinationFile = "./homeRowMod.json";

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

  const sample = {
    from: { key_code: "a" },
    to_if_held_down: [{ key_code: "left_shift", lazy: true }],
    to_if_alone: [{ key_code: "a" }],
    to_delayed_action: {
      to_if_canceled: { halt: true, key_code: "a" },
    },
    parameters: {
      "basic.to_if_held_down_threshold_milliseconds": 75,
      "basic.to_delayed_action_delay_milliseconds": 30,
    },
    type: "basic",
  };

  let assembledRule = {
    from: {
      simultaneous: simultaneousAndToIfAlone,
    },
    to_if_held_down: toIfHeldDown,
    to_if_alone: simultaneousAndToIfAlone,
    parameters: {
      "basic.to_if_held_down_threshold_milliseconds": 75,
      "basic.to_delayed_action_delay_milliseconds": 30,
    },
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

console.dir(processKeyCombinationArr(leftLetters), { depth: null });

let compiledRules = [...processKeyCombinationArr(leftLetters), ...processKeyCombinationArr(rightLetters)];

writeToFile(destinationFile, compiledRules);
