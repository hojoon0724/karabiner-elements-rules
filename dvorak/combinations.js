import * as fs from "fs/promises";
import * as path from "path";
import { writeFile } from "fs/promises";

const pairs = ["an", "as", "at", "ah", "he", "ho", "no", "on", "so", "to", "us", "un", "en", "es", "ae", "oe", "eh", "ne", "et", "te", "th", "sh", "ha", "ta", "na", "sa"];

const triples = ["the", "hat", "hot", "son", "sun", "tan", "ton", "not", "net", "nut", "set", "ten", "toe", "one", "use", "ate", "ash", "hut", "has", "ant", "hen", "sen"];

const quads = ["tone", "hunt", "hate", "heat", "seat", "nest", "shot", "sent", "hast", "east", "ante", "than", "then", "thus", "shoe", "note", "sane", "neat", "hose", "host"];

const leftKeys = ["a", "o", "e", "u"];
const rightKeys = ["h", "t", "n", "s"];

const leftMap = new Map([
  ["a", "left_shift"],
  ["o", "left_control"],
  ["e", "left_option"],
  ["u", "left_command"],
  ["h", "right_shift"],
  ["t", "right_control"],
  ["n", "right_option"],
  ["s", "right_command"],
]);

function showSides(combination) {
  const letterArr = combination.split("");
  const result = [];
  for (const letter of letterArr) {
    if (leftKeys.includes(letter)) {
      result.push("left");
    } else if (rightKeys.includes(letter)) {
      result.push("right");
    } else {
      result.push("none");
    }
  }
  console.log(letterArr, result);
}

function buildKarabinerRules(combination) {
  const modifiers = [];
  const letterArr = combination.split("");
  for (const letter of letterArr) {
    modifiers.push(leftMap.get(letter));
  }
  // console.log(letterArr, modifiers);

  const rule = {
    from: {
      simultaneous: [{ key_code: `${letterArr[0]}` }, { key_code: `${letterArr[1]}` }],
      simultaneous_options: {
        detect_key_down_uninterruptedly: true,
        key_down_order: "strict",
      },
    },
    parameters: {
      "basic.simultaneous_threshold_milliseconds": 150,
    },
    to_if_alone: [{ key_code: `${letterArr[0]}` }, { key_code: `${letterArr[1]}` }],
    to_if_held_down: [{ key_code: `${modifiers[0]}`, modifiers: [`${modifiers[1]}`] }],
    type: "basic",
  };
  // console.log(rule);
  const json = JSON.stringify(rule, null, 2);
  return rule;
}

let rules = [];
for (const pair of pairs) {
  rules.push(buildKarabinerRules(pair));
}

await writeFile("./rulesCompiled.json", JSON.stringify(rules, null, 2));
