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
const thCombinations = allCombinations.filter((combo) => combo.includes("t") && combo.includes("h"));
console.log("Combinations with t and h:", thCombinations);

const keyList = Object.keys(keys);
const tIndex = keyList.indexOf("t");
const hIndex = keyList.indexOf("h");
console.log("t index:", tIndex, "h index:", hIndex);
console.log("Order in keys object:", keyList.slice(Math.min(tIndex, hIndex) - 2, Math.max(tIndex, hIndex) + 3));
