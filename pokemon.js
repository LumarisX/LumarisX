import { BattleTypeChart } from "./data/typechart.js";

var pokemonData;
export const types = ["Normal", "Grass", "Water", "Fire", "Electric", "Ground", "Rock", "Flying", "Ice", "Fighting", "Poison", "Bug", "Psychic", "Dark", "Ghost", "Dragon", "Steel", "Fairy"];

$.ajax({
  dataType: "json",
  url: "https://play.pokemonshowdown.com/data/pokedex.json",
  async: false,
  success: function(data) {
    pokemonData = data
    return true;
  }
});

export function getSprite(pokemon, size = "big", shiny = false, format = "") {
  var path = "https://play.pokemonshowdown.com/sprites/gen5"
  if (format === "home") {
    path = "https://play.pokemonshowdown.com/sprites/dex"
  } else if (format === "afd") {

  }
  if (shiny) {
    path = path + "-shiny"
  }
  if (size === "big") {
    let name = pokemonData[pokemon]["name"].toLowerCase().replace(/[\s.]+/g, "")

    if ("baseSpecies" in pokemonData[pokemon]) {
      name = name.replace(/-(\w)$/g, "$1");
    } else {
      name = name.replace(/-+/g, "");
    }
    return (path + "/" + name + ".png");
  }
}

export function getName(name) {
  if (name in pokemonData) {
    return (pokemonData[name]["name"]);
  }
  return ("unknown");
}

export function getBase(name) {
  return (pokemonData[name]["baseStats"]);
}

export function getStat(stat, base, ev = 252, nature = 1.1, iv = 31, level = 100, stage = 0, mult = 1) {
  if (stat === "hp") {
    return (Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10);
  } else {
    if (stage > 0) {
      mult = mult * (2 + stage) / 2;
    } else if (stage < 0) {
      mult = mult * 2 / (2 - stage);
    }
  }

  return (Math.floor(Math.floor((Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5) * nature) * mult));
}

export function getWeak(name) {
  if (name in pokemonData) {
    var weak = null;
    let types = pokemonData[name]["types"];
    for (let t in types) {
      if (weak === null) {
        weak = structuredClone(BattleTypeChart[types[t].toLowerCase()]["damageTaken"]);
      } else {
        var ot = structuredClone(BattleTypeChart[types[t].toLowerCase()]["damageTaken"]);
        for (let w in weak) {
          if (w in ot) {
            weak[w] = weak[w] * ot[w];
          }
          delete ot[w];
        }
        for (let w in ot) {
          weak[w] = ot[w];
        }
      }
    }
    for(let a in pokemonData[name]["abilities"]){
      let ability = toKey(pokemonData[name]["abilities"][a]);
      if(ability in BattleTypeChart){
        var ot = structuredClone(BattleTypeChart[ability]["damageTaken"]);
        for (let w in weak) {
          if (w in ot) {
            weak[w] = weak[w] * ot[w];
          }
          delete ot[w];
        }
        for (let w in ot) {
          weak[w] = ot[w];
        }
      }
    }
    return weak;
  }
}

export function getPrevo(name) {
  return toKey(pokemonData[name]["prevo"]);
}

export function getBaseForm(name) {
  return toKey(pokemonData[name]["baseSpecies"]);
}

export function getTypes(name) {
  return pokemonData[name]["types"];
}

export function getFormeChange(name) {
  let forme = toKey(pokemonData[name]["changesFrom"]);
  return forme;
}

export function toKey(name) {
  if (name != undefined) {
    name = name.toLowerCase().replace(/[ .-]+/g, '');
  }
  return name;
}