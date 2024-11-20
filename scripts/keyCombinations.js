const fs = require("fs").promises;
const { write } = require("fs");
const path = require("path");

const twoKeyCombinations = ["oa", "ea", "ua", "ha", "ta", "na", "sa", "ao", "eo", "uo", "ho", "to", "no", "so", "ae", "oe", "ue", "he", "te", "ne", "se", "au", "ou", "eu", "hu", "tu", "nu", "su", "ah", "oh", "eh", "uh", "th", "nh", "sh", "at", "ot", "et", "ut", "ht", "nt", "st", "an", "on", "en", "un", "hn", "tn", "sn", "as", "os", "es", "us", "hs", "ts", "ns"];

const threeKeyCombinations = ["eoa", "uoa", "hoa", "toa", "noa", "soa", "oea", "uea", "hea", "tea", "nea", "sea", "oua", "eua", "hua", "tua", "nua", "sua", "oha", "eha", "uha", "tha", "nha", "sha", "ota", "eta", "uta", "hta", "nta", "sta", "ona", "ena", "una", "hna", "tna", "sna", "osa", "esa", "usa", "hsa", "tsa", "nsa", "eao", "uao", "hao", "tao", "nao", "sao", "aeo", "ueo", "heo", "teo", "neo", "seo", "auo", "euo", "huo", "tuo", "nuo", "suo", "aho", "eho", "uho", "tho", "nho", "sho", "ato", "eto", "uto", "hto", "nto", "sto", "ano", "eno", "uno", "hno", "tno", "sno", "aso", "eso", "uso", "hso", "tso", "nso", "oae", "uae", "hae", "tae", "nae", "sae", "aoe", "uoe", "hoe", "toe", "noe", "soe", "aue", "oue", "hue", "tue", "nue", "sue", "ahe", "ohe", "uhe", "the", "nhe", "she", "ate", "ote", "ute", "hte", "nte", "ste", "ane", "one", "une", "hne", "tne", "sne", "ase", "ose", "use", "hse", "tse", "nse", "oau", "eau", "hau", "tau", "nau", "sau", "aou", "eou", "hou", "tou", "nou", "sou", "aeu", "oeu", "heu", "teu", "neu", "seu", "ahu", "ohu", "ehu", "thu", "nhu", "shu", "atu", "otu", "etu", "htu", "ntu", "stu", "anu", "onu", "enu", "hnu", "tnu", "snu", "asu", "osu", "esu", "hsu", "tsu", "nsu", "oah", "eah", "uah", "tah", "nah", "sah", "aoh", "eoh", "uoh", "toh", "noh", "soh", "aeh", "oeh", "ueh", "teh", "neh", "seh", "auh", "ouh", "euh", "tuh", "nuh", "suh", "ath", "oth", "eth", "uth", "nth", "sth", "anh", "onh", "enh", "unh", "tnh", "snh", "ash", "osh", "esh", "ush", "tsh", "nsh", "oat", "eat", "uat", "hat", "nat", "sat", "aot", "eot", "uot", "hot", "not", "sot", "aet", "oet", "uet", "het", "net", "set", "aut", "out", "eut", "hut", "nut", "sut", "aht", "oht", "eht", "uht", "nht", "sht", "ant", "ont", "ent", "unt", "hnt", "snt", "ast", "ost", "est", "ust", "hst", "nst", "oan", "ean", "uan", "han", "tan", "san", "aon", "eon", "uon", "hon", "ton", "son", "aen", "oen", "uen", "hen", "ten", "sen", "aun", "oun", "eun", "hun", "tun", "sun", "ahn", "ohn", "ehn", "uhn", "thn", "shn", "atn", "otn", "etn", "utn", "htn", "stn", "asn", "osn", "esn", "usn", "hsn", "tsn", "oas", "eas", "uas", "has", "tas", "nas", "aos", "eos", "uos", "hos", "tos", "nos", "aes", "oes", "ues", "hes", "tes", "nes", "aus", "ous", "eus", "hus", "tus", "nus", "ahs", "ohs", "ehs", "uhs", "ths", "nhs", "ats", "ots", "ets", "uts", "hts", "nts", "ans", "ons", "ens", "uns", "hns", "tns"];

const keyMapped = {
  a: "left_shift",
  o: "left_control",
  e: "left_option",
  u: "left_command",
  s: "right_shift",
  n: "right_control",
  t: "right_option",
  h: "right_command",
};

const keyAssignmentMap = new Map();

const destinationFile = "./scriptGeneratedCombinations.json";

function writeToFile(destinationFile, content) {
  fs.writeFile(destinationFile, JSON.stringify(content, null, 2));
}

function createKeyMap(obj) {
  Object.entries(obj).map((entry) => {
    keyAssignmentMap.set(entry[0], entry[1]);
  });
}

createKeyMap(keyMapped);

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
      // let keyCodeZero = { key_code: keyAssignmentMap.get(strArr[i]) };
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

let compiledRules = [...processKeyCombinationArr(twoKeyCombinations), ...processKeyCombinationArr(threeKeyCombinations)];

// compiledRules.push(processKeyCombinationArr(twoKeyCombinations));
// compiledRules.push(processKeyCombinationArr(threeKeyCombinations));

writeToFile(destinationFile, compiledRules);

// const resultArr = allKeyCombinations.map((letters) => {
//   letterArr = letters.split("");
//   console.log(letters);
//   letterArr.forEach((letter) => {
//     console.log(letter, keyMapped[letter]);
//   });
// });

// console.log(allKeyCombinations);
// console.log(allKeyCombinations.length);
