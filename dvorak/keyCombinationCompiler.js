const { writeFileSync } = require("fs");

const keys = {
  "'": { key: "quote", modifier: null },
  ",": { key: "comma", modifier: null },
  ".": { key: "period", modifier: null },
  p: { key: "p", modifier: null },
  y: { key: "y", modifier: null },
  f: { key: "f", modifier: null },
  g: { key: "g", modifier: null },
  c: { key: "c", modifier: null },
  r: { key: "r", modifier: null },
  l: { key: "l", modifier: null },
  "/": { key: "slash", modifier: null },
  "=": { key: "equal_sign", modifier: null },
  a: { key: "a", modifier: "left_shift" },
  o: { key: "o", modifier: "left_control" },
  e: { key: "e", modifier: "left_option" },
  u: { key: "u", modifier: "left_command" },
  i: { key: "i", modifier: null },
  d: { key: "d", modifier: null },
  h: { key: "h", modifier: "right_command" },
  t: { key: "t", modifier: "right_option" },
  n: { key: "n", modifier: "right_control" },
  s: { key: "s", modifier: "right_shift" },
  "-": { key: "hyphen", modifier: null },
  ";": { key: "semicolon", modifier: null },
  q: { key: "q", modifier: null },
  j: { key: "j", modifier: null },
  k: { key: "k", modifier: null },
  x: { key: "x", modifier: null },
  b: { key: "b", modifier: null },
  m: { key: "m", modifier: null },
  w: { key: "w", modifier: null },
  v: { key: "v", modifier: null },
  z: { key: "z", modifier: null },
};

function createRule(key1, key2) {
  // Case 1: Both keys have modifiers - create rules for both key orders
  if (key1.modifier && key2.modifier) {
    return [
      {
        type: "basic",
        from: {
          simultaneous: [{ key_code: key1.key }, { key_code: key2.key }],
          simultaneous_options: { key_down_order: "strict" },
        },
        to_if_alone: [{ key_code: key1.key }, { key_code: key2.key }],
        to_if_held_down: [{ key_code: key1.modifier, modifiers: [key2.modifier], lazy: true }],
      },
      {
        type: "basic",
        from: {
          simultaneous: [{ key_code: key2.key }, { key_code: key1.key }],
          simultaneous_options: { key_down_order: "strict" },
        },
        to_if_alone: [{ key_code: key2.key }, { key_code: key1.key }],
        to_if_held_down: [{ key_code: key2.modifier, modifiers: [key1.modifier], lazy: true }],
      },
    ];
  }

  // Case 2: Neither key has modifiers - skip these combinations
  if (!key1.modifier && !key2.modifier) {
    return null;
  }

  // Case 3: Exactly one key has a modifier - use modifier functionality
  const modifierKey = key1.modifier ? key1 : key2;
  const regularKey = key1.modifier ? key2 : key1;

  return [
    {
      type: "basic",
      from: {
        simultaneous: [{ key_code: modifierKey.key }, { key_code: regularKey.key }],
        simultaneous_options: { key_down_order: "strict" },
      },
      to_if_alone: [{ key_code: modifierKey.key }, { key_code: regularKey.key }],
      to_if_held_down: [{ key_code: regularKey.key, modifiers: [modifierKey.modifier], lazy: true }],
    },
  ];
}

function compileKeyCombinations(combinations) {
  const rules = [];
  combinations.forEach((combination) => {
    const [key1, key2] = combination.split("");
    if (keys[key1] && keys[key2]) {
      const rule = createRule(keys[key1], keys[key2]);
      if (rule) {
        rules.push(...rule);
      }
    }
  });
  return rules;
}

// loop through all combinations of two keys (avoiding duplicates)
function generateAllCombinations() {
  const keyList = Object.keys(keys);
  const combinations = [];
  for (let i = 0; i < keyList.length; i++) {
    for (let j = i + 1; j < keyList.length; j++) {
      combinations.push(keyList[i] + keyList[j]);
    }
  }
  return combinations;
}

const allCombinations = generateAllCombinations();
const compiledRules = compileKeyCombinations(allCombinations);

writeFileSync(
  "dvorak_key_combinations.json",
  JSON.stringify({ title: "Dvorak Key Combinations", rules: [{ description: "Key combinations for Dvorak layout", manipulators: compiledRules }] }, null, 2),
);
