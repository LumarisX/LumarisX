import * as pd from "./pokemon.js";
import * as cstr from "./constructor.js";
import * as ls from "./learnsets.js";
import * as moves from "./moves.js";

var myTeam, oppTeam;

$(function() {
  update();
});

function update() {

  var league = sessionStorage.getItem("team");
  //DELETE ME
  league = 1;
  if (league == null) {
    window.location.href = 'leagues.html';
    return;
  }
  let oppKey = sessionStorage.getItem("oppteam");
  //DELETE ME
  oppKey = 4;
  if (oppKey == null) {
    window.location.href = 'team.html'
    return;
  }

  league = JSON.parse(localStorage.getItem("team"))[league];
  let oppInfo = league["opponents"][oppKey];
  oppTeam = oppInfo["team"];
  myTeam = league["team"];

  getTeamData(myTeam);
  getTeamData(oppTeam);

  $("#leagueName").text(league["leagueName"])

  summeryWidget("spe", true);
  typechartWidget(oppTeam);
  speedTierWidget();
  coverageWidget(true);
  learnsetWidget(myTeam);
}

function summeryWidget(stat, desc) {
  let oppOrder = statSort(oppTeam, stat, desc);
  let myOrder = statSort(myTeam, stat, desc);
  $(".statHead").text(stat.toUpperCase());
  let myOV = $("#myOverview");
  let oppOV = $("#oppOverview");
  for (let key in myOrder) {
    let monName = myOrder[key];
    myOV.append($('<tr class="h-12 bg-cyan-300 border-b border-slate-400"><td class="w-8"><div class="-mr-2">' + cstr.captIcon(myTeam[monName]) + '</div></td><td class="w-12"><div class="w-12">' + cstr.spriteImg(monName, myTeam[monName]["shiny"], "gen5", true) + '</div></td><td class="w-32 text">' + pd.getName(monName) + '</td><td class="w-12 text-center">' + myTeam[monName]["base"][stat] + '</td></tr>'));
  }
  for (let key in oppOrder) {
    let monName = oppOrder[key];
    oppOV.append($('<tr class="h-12 bg-red-400  border-b border-slate-400"><td class="w-12 text-center">' + oppTeam[monName]["base"][stat] + '</td><td class="w-32 text-right text">' + pd.getName(monName) + '</td><td class="w-12"><div class="w-12">' + cstr.spriteImg(monName, oppTeam[monName]["shiny"]) + '</div></td><td class="w-8"><div class="h-12 -ml-2">' + cstr.captIcon(oppTeam[monName]) + '</div></td></tr>'));
  }
}

function typechartWidget(team) {
  let typeRow = $("#typeRow");
  let sums = {};
  for (let t in pd.types) {
    typeRow.append($(`<td class=""><img class="" src="https://play.pokemonshowdown.com/sprites/types/${pd.types[t]}.png" alt="${pd.types[t]}" ></td>`));
    sums[pd.types[t]] = { "weaks": 0, "resists": 0, "log": 0 };
  }

  let typeData = $("#typeData");
  for (let m in team) {
    let data = '<th class="sticky left-0 bg-slate-200 border-r-4 border-slate-400">' + team[m]["name"] + '</th>';
    for (let t in pd.types) {
      let weak = team[m]["weak"][pd.types[t]];
      let theme = "";
      if (weak > 1) {
        theme = "bg-rose-400";
        sums[pd.types[t]]["weaks"]++;
        if (weak > 2) {
          theme = "bg-rose-500";
          if (weak > 4) {
            theme = "bg-rose-600";
          }
        }
      } else if (weak < 1) {
        theme = "bg-emerald-400";
        sums[pd.types[t]]["resists"]++;
        if (weak < .5) {
          theme = "bg-emerald-500";
          if (weak < .25) {
            theme = "bg-emerald-600";
          }
        }
      }
      if (weak != 0) {
        sums[pd.types[t]]["log"] -= Math.log2(weak);
      } else {
        sums[pd.types[t]]["log"] += 2;
      }
      data = data + '<td class="' + theme + '">' + weak + '</td>';
    }
    typeData.append($('<tr>' + data + '</tr>'));
  }
  let weakRow = '<th class="sticky left-0 bg-slate-300 border-r-4 border-slate-400">Weaknesses</th>';
  let resistRow = '<th class="sticky left-0 bg-slate-300 border-r-4 border-slate-400">Resistances</th>';
  let diffRow = '<th class="sticky left-0 bg-slate-300 border-r-4 border-slate-400">Difference</th>';
  let logRow = '<th class="sticky left-0 bg-slate-300 border-r-4 border-slate-400">Logarithmic</th>';
  for (let t in pd.types) {
    weakRow += '<td class="' + tcTheme(sums[pd.types[t]]["weaks"] * -1, -4, -3, -2, -1, 0) + '">' + sums[pd.types[t]]["weaks"] + '</td>';
    resistRow += '<td class="' + tcTheme(sums[pd.types[t]]["resists"], 0, 1, 2, 3, 4) + '">' + sums[pd.types[t]]["resists"] + '</td>';
    let theme = "";
    let diff = sums[pd.types[t]]["resists"] - sums[pd.types[t]]["weaks"];
    diffRow += '<td class="' + tcTheme(diff, -2, -1, 0, 1, 2) + '">' + diff + '</td>';
    logRow += '<td class="' + tcTheme(sums[pd.types[t]]["log"], -2, -1, 0, 1, 2) + '">' + Math.round(sums[pd.types[t]]["log"]) + '</td>';
  }
  $("#typeSum").append($('<tr>' + weakRow + '</tr>'));
  $("#typeSum").append($('<tr>' + resistRow + '</tr>'));
  $("#typeSum").append($('<tr>' + diffRow + '</tr>'));
  $("#typeSum").append($('<tr>' + logRow + '</tr>'));
}

function tcTheme(value, low2, low1, base, high1, high2) {
  let theme = "";
  if (value > base && value <= high1) {
    theme = "bg-emerald-400";
  } else if (value > high1 && value <= high2) {
    theme = "bg-emerald-500";
  } else if (value > high2) {
    theme = "bg-emerald-600";
  } else if (value < base && value >= low1) {
    theme = "bg-rose-400";
  } else if (value < low1 && value >= low2) {
    theme = "bg-rose-500";
  } else if (value < low2) {
    theme = "bg-rose-600";
  }
  return (theme);
}

function speedTierWidget() {
  let tiers = [];
  for (let m in myTeam) {
    tiers = tiers.concat(getSpeedTiers(myTeam[m]["name"], myTeam[m]["base"]["spe"], 50, true));
  }
  for (let m in oppTeam) {
    tiers = tiers.concat(getSpeedTiers(oppTeam[m]["name"], oppTeam[m]["base"]["spe"], 50, false));
  }

  let speAsc = 1;
  tiers.sort(function(x, y) {
    if (x["spe"] < y["spe"]) {
      return (1 * speAsc);
    }
    if (x["spe"] > y["spe"]) {
      return (-1 * speAsc);
    }
    return (0);
  });

  for (let t in tiers) {
    let color = "bg-red-400";
    if (tiers[t]["team"]) {
      color = "bg-cyan-300";
    }
    $("#speedTiers").append(`<tr class="spetier border-b border-slate-400 ${color}"><td class="pl-${tiers[t]["ind"]}">${tiers[t]["name"]}</td><td>${tiers[t]["desc"]}</td><td>${tiers[t]["spe"]}</td></tr>`);
  }
}

function coverageWidget(team) {
  let forTeam = oppTeam;
  let othTeam = myTeam;
  if (team) {
    forTeam = myTeam;
    othTeam = oppTeam;
  }
  for (let monName in forTeam) {
    let typeCoverage = ls.getCoverage(monName);
    //let pcoverage = calcCoverage(monName, typeCoverage.Physical);
    //let scoverage = calcCoverage(monName, typeCoverage.Special);
    let typeSelected = {};
    let sprite = '<div class="h-full w-fit bg-red-400">' + cstr.spriteImg(monName, forTeam[monName]["shiny"], "gen5", true) + '</div>';
    let monDiv = $('<div class="h-32 max-w-64 w-full flex bg-red-400 border-red-300 border-2"></div>');
    let numDiv = $(`<div class="h-full p-2 "><div class="se p-2 h-1/2 border-2 border-slate-400 bg-emerald-400 text-md text-bold flex justify-center items-center rounded-full"></div><div class="ne p-2 h-1/2 border-2 border-slate-400 bg-rose-400 text-md text-bold flex justify-center items-center rounded-full"></div></div>`);
    let physCov = $('<div class="grid grid-cols-6 grid-rows-flex p-1 h-auto w-full items-center bg-red-300"></div>');
    for (let type in typeCoverage["Physical"]) {
      let stab = "opacity-40 ";
      if (forTeam[monName]["types"].includes(type)) {
        stab = "";
      }
      let physImg = $(`<img class="${stab}" src="https://play.pokemonshowdown.com/sprites/types/${type}.png" title="${typeCoverage["Physical"][type]["name"]}" type="${type}">`);
      physImg.on("click", function() {
        let clickType = $(this).attr("type");
        if (Object.keys(typeSelected).length < 4 && $(this).hasClass('opacity-40')) {
          monDiv.find(`[type="${clickType}"`).removeClass('opacity-40');
          typeSelected[clickType] = true;
        } else {
          monDiv.find(`[type="${clickType}"`).addClass('opacity-40');
          delete typeSelected[clickType];
        }
        updateCoverage(typeSelected, othTeam, numDiv);
      });
      physCov.append(physImg);
    }
    let physDiv = $('<div class="w-full h-1/2 text-xs bg-red-400 p-1"><img src="https://play.pokemonshowdown.com/sprites/categories/Physical.png"></div>');
    physDiv.append(physCov);

    let specCov = $('<div class="grid grid-cols-6 grid-rows-flex p-1 h-auto w-full items-center bg-red-300"></div>');
    for (let type in typeCoverage["Special"]) {
      let stab = "opacity-40 ";
      if (forTeam[monName]["types"].includes(type)) {
        stab = "";
        typeSelected[type] = true;
      }
      let specImg = $(`<img class="${stab}" src="https://play.pokemonshowdown.com/sprites/types/${type}.png" title="${typeCoverage["Special"][type]["name"]}" type="${type}">`);
      specImg.on("click", function() {
        let clickType = $(this).attr("type");
        if (Object.keys(typeSelected).length < 4 && $(this).hasClass('opacity-40')) {
          monDiv.find(`[type="${clickType}"`).removeClass('opacity-40');
          typeSelected[clickType] = true;
        } else {
          monDiv.find(`[type="${clickType}"`).addClass('opacity-40');
          delete typeSelected[clickType];
        }
        updateCoverage(typeSelected, othTeam, numDiv);
      });
      specCov.append(specImg);
    }
    let specDiv = $('<div class="w-full text-xs bg-red-400 p-1 h-1/2"><img src="https://play.pokemonshowdown.com/sprites/categories/Special.png"></div>');
    specDiv.append(specCov);
    monDiv.append($(sprite));
    let covDiv = $("<div></div>");
    covDiv.append(physDiv);
    covDiv.append(specDiv);
    monDiv.append(covDiv);
    monDiv.append(numDiv);
    updateCoverage(typeSelected, othTeam, numDiv);
    $("#coverageWidget").append(monDiv);
    $(".coverageSwitch").on("click", function() {
      $(".coverageSwitch").toggle();
    })
  }
}

function learnsetWidget(team) {
  const lsMoves = {"Priority":["accelerock","aquajet","bulletpunch","extremespeed","fakeout","feint","firstimpression","iceshard","jetpunch","machpunch","quickattack","shadowsneak","suckerpunch","vacuumwave","watershuriken","zippyzap"],"Setup":["acidarmor","agility","amnesia","aromaticmist","autotomize","barrier","bulkup","calmmind","charge","clangoroussoul","coaching","coil","cosmicpower","cottonguard","decorate","defendorder","defensecurl","doubleteam","dragondance","extremeevoboost","filletaway","flatter","geomancy","growth","harden","honeclaws","howl","irondefense","meditate","minimize","nastyplot","noretreat","quiverdance","rockpolish","sharpen","shellsmash","shelter","shiftgear","spicyextract","swagger","swordsdance","tailglow","victorydance","withdraw","workup"],"Cleric":["floralhealing","healingwish","healorder","healpulse","junglehealing","lifedew","lunarblessing","lunardance","milkdrink","moonlight","morningsun","purify","recover","rest","roost","shoreup","slackoff","softboiled","strengthsap","swallow","synthesis","wish","aromatherapy","healbell"],"Momentum":["batonpass","chillyreception","flipturn","partingshot","revivalblessing","shedtail","teleport","uturn","voltswitch"],"Hazard Control":["spikes","stealthrock","stickyweb","defog","rapidspin","mortalspin","tidyup","toxicspikes"],"Speed Control":["tailwind","stickyweb","trickroom","bleakwindstorm","bulldoze","electroweb","glaciate","icywind"],"Support":["reflect","lightscreen","auroraveil","helpinghand","coaching","allyswitch","ragepowder","followme","quickguard","wideguard","beatup","craftyshield","luckychant","matblock","mist","safeguard"],"Status":["darkvoid","glare","grasswhistle","hypnosis","lovelykiss","mortalspin","nuzzle","poisongas","poisonpowder","sing","sleeppowder","spore","stunspore","thunderwave","toxic","toxicthread","willowisp","yawn"],"Disruption":["taunt","encore","knockoff","trick","switcheroo","corrosivegas","imprison","circlethrow","dragontail","roar","whirlwind","haze","clearsmog"],"Condition":["chillyreception","electricterrain","grassyterrain","hail","mistyterrain","psychicterrain","raindance","sandstorm","snowscape","sunnyday","terrainpulse","naturepower","weatherball","solarbeam","risingvoltage","expandingforce","grassyglide","mistyexplosion","hurricane","solarblade"]};
  let lsMod = $("#learnsetWidget");
  for (let category in lsMoves) {
    let catTable = $(`<div class="catTable hidden"></div>`);
    for (let m in lsMoves[category]) {
      let mov = lsMoves[category][m];
      let monSprites = "";
      for (let mon in team) {
        if (ls.learn(mon, mov)) {
          monSprites += cstr.spriteImg(mon, team[mon]["shiny"], "gen5");
        }
      }
      if (monSprites != "") {
        catTable.append($(`<div class="flex border-b-2 border-slate-400 bg-slate-200"><div class="basis-1/3 border-r border-slate-400">${moves.getName(mov)}</div><div class="basis-2/3 h-8 flex">${monSprites}</div></div>`))
      }
    }
    let catDiv=$(`<div><div class="lsheader bg-slate-300 sticky top-0 left-0 border-b-2 border-slate-400">${category}</div></div>`);
    catDiv.append(catTable)
    lsMod.append(catDiv)
  }
  
  $(".lsheader").on("click",function(){
    console.log("clicked")
    $(".catTable").hide();
    $(this).parent().find(".catTable").toggle();
  })
  /*
      for (let monName in team) {
        if (ls.learn(monName, mov)) {
          monGrid += cstr.spriteImg(monName, team[monName]["shiny"])
        }
      }
      if (monGrid != '') {
        monGrid = '<div class="flex flex-row h-8">' + monGrid + '</div>'
        catTable += `<div class=""><div class="text-sm>${moves.getName(mov)}</div>${monGrid}</div>`
      }
    }
    catTable += `</div>`;
    let catDiv = `<div><div>${category}</div>${catTable}</div>`;
    lsMod.append($(catDiv));
  }*/
}

function getSpeedTiers(name, baseSpe, level, team) {
  let tiers = [];
  tiers.push({
    "name": name,
    "team": team,
    "spe": pd.getStat("", baseSpe, 0, .9, 0, level),
    "desc": "Min Speed",
    "ind": 2
  });
  tiers.push({ "name": name, "team": team, "spe": pd.getStat("", baseSpe, 0, 1, 31, level), "desc": "Base Speed", "ind": 0 });
  tiers.push({ "name": name, "team": team, "spe": pd.getStat("", baseSpe, 252, 1, 31, level), "desc": "Max Speed Neutral", "ind": 1 });
  tiers.push({ "name": name, "team": team, "spe": pd.getStat("", baseSpe, 252, 1.1, 31, level), "desc": "Max Speed", "ind": 2 });
  tiers.push({ "name": name, "team": team, "spe": pd.getStat("", baseSpe, 252, 1.1, 31, level, 1), "desc": "Max Speed +1", "ind": 4 });
  tiers.push({ "name": name, "team": team, "spe": pd.getStat("", baseSpe, 252, 1.1, 31, level, 2), "desc": "Max Speed +2", "ind": 6 });
  return (tiers);
}

function getTeamData(team) {
  for (let mon in team) {
    team[mon]["name"] = pd.getName(mon);
    team[mon]["weak"] = pd.getWeak(mon);
    team[mon]["base"] = pd.getBase(mon);
    team[mon]["types"] = pd.getTypes(mon);
  }
}

function statSort(team, stat, desc = true) {
  let order = [];
  out:
    for (let mon in team) {
      let mstat = team[mon]["base"][stat];
      let o = 0;
      for (o in order) {
        let ostat = team[order[o]]["base"][stat];
        if ((desc && ostat < mstat) || (!desc && mstat < ostat)) {
          order.splice(o, 0, mon);
          continue out;
        }
      }
      order.push(mon);
    }
  return order;
}

function updateCoverage(typeSelected, team, ele) {
  let seCount = 0;
  let neCount = 0;
  if (Object.keys(typeSelected).length > 0) {
    for (let m in team) {
      let max = 0;
      for (let t in typeSelected) {
        if (team[m]["weak"][t] > max) {
          max = team[m]["weak"][t];
        }
      }
      if (max > 1) {
        seCount++;
      } else if (max < 1) {
        neCount++;
      }
    }
    ele.find(".se").text(`${seCount}/${Object.keys(team).length}`);
    ele.find(".ne").text(`${neCount}/${Object.keys(team).length}`);

  } else {
    ele.find(".se").text();
    ele.find(".ne").text();
  }
}

function calcBestCoverage(name, typeCoverage) {
  let keys = Object.keys(typeCoverage);
  let maxSum = 0;
  let maxScore = 0;
  let bestTypes = [];
  if (keys.length < 5) {


  } else {
    for (let i = 0; i < keys.length; i++) {
      for (let ii = i + 1; ii < keys.length; ii++) {
        for (let iii = ii + 1; iii < keys.length; iii++) {
          for (let iv = iii + 1; iv < keys.length; iv++) {
            let sum = 0;
            let score = 0;
            let mTypes = [keys[i], keys[ii], keys[iii], keys[iv]];
            for (let mon in oppTeam) {
              let weak = oppTeam[mon]["weak"];
              let values = [weak[keys[i]], weak[keys[ii]], weak[keys[iii]], weak[keys[iv]]];
              for (let t in mTypes) {
                if (myTeam[name]["types"].includes(mTypes[t])) {
                  values[t] = values[t] * 1.5;
                }
              }
              let max = Math.max(...values);
              if (max >= 2) {
                sum++;
              }
              score += max;
            }
            if (sum > maxSum) {
              bestTypes = [keys[i], keys[ii], keys[iii], keys[iv]];
              maxSum = sum;
              maxScore = score;
            } else if (sum == maxSum) {
              if (score > maxScore) {
                bestTypes = [keys[i], keys[ii], keys[iii], keys[iv]];
                maxScore = score;
              }
            }
          }
        }
      }
    }
  }
  console.log(name, maxSum, maxScore, bestTypes);
}