import * as pd from "./pokemon.js";
import * as moves from "./moves.js";

var learnsets;

$.ajax({
  dataType: "json",
  url: "https://play.pokemonshowdown.com/data/learnsets.json",
  async: false,
  success: function(data) {
    learnsets = data
    return true;
  }
});

export function getLearnset(name, gen = "nd") {
  let ls = [];
  let changeForme = pd.getFormeChange(name);
  if(changeForme!= undefined){
    ls = ls.concat(getLearnset(changeForme.toLowerCase(), gen));
  }
  let prevo = pd.getPrevo(name);
  if (prevo != undefined) {
    ls = ls.concat(getLearnset(prevo.toLowerCase(), gen));
  }
  let tls;
  if (name in learnsets && "learnset" in learnsets[name]) {
    tls = learnsets[name]["learnset"];
  } else {
    return (getLearnset(pd.getBaseForm(name), gen))
  }
  for (let m in tls) {
    if (ls.includes(m) || !genCheck(tls[m], gen)) {
      delete tls[m];
    }
  }

  return (ls.concat(Object.keys(tls)));
}

export function getLearnlist(move, gen = "nd", list = learnsets) {
  let ll = [];
  for (let m in learnsets) {
    if ("learnset" in learnsets[m] && move in learnsets[m]["learnset"] && genCheck(learnsets[m]["learnset"][move], gen)) {
      ll.push(m);
    }
  }
  return (ll);
}

export function getCoverage(name, gen = "nd") {
  let ls = getLearnset(name, gen);
  let coverage = { "Physical": {}, "Special": {} };
  for (let m in ls) {
    let md = moves.getMove(ls[m]);
    if (md["category"] != "Status") {
      let value = moves.getValue(ls[m]);
      if (!(md["type"] in coverage[md["category"]]) || coverage[md["category"]][md["type"]]["value"] < value) {
        coverage[md["category"]][md["type"]] = { "name": md["name"], "value": value };
      }
    }
  }
  return (coverage);
}

export function learn(name, moveName){
  let ls = getLearnset(name);
  return ls.includes(moveName);
}


function genCheck(move, gen) {
  if (gen === "nd") {
    return true;
  }
  for (let lk in move) {
    let genReg = new RegExp("^" + gen + "\\D");
    if (genReg.test(move[lk])) {
      return true;
    }
  }
  return false;
}