import * as pd from "./pokemon.js";
import * as cstr from "./constructor.js";

$(function() {
  update();
});

function update() {

  let leagueCode = sessionStorage.getItem("team");
  if (leagueCode == null) {
    window.location.href = 'leagues.html';
    return;
  }
  let leagueData = JSON.parse(localStorage.getItem("team"))[leagueCode];
  $("#leagueName").text(leagueData["leagueName"])
  let teamData = leagueData["team"];
  let sprites = $("#sprites");
  for (let monName in teamData) {
    sprites.append($(cstr.spriteImg(monName, teamData[monName]["shiny"],"gen5", true)));
  }
  
  let muTable = $("#matchups");
  let mus = leagueData["opponents"];
  for(let key in mus){
    let mu = mus[key];
    let theme = "slate";
    let score = "";
    if(mu["score"].length>1){
      score = mu["score"][0]+" - "+mu["score"][1]
      if(mu["score"][0]>mu["score"][1]){
        theme = "emerald";
      } else {
        theme = "red";
      }
    }
    let muDiv = `<div class="muDiv p-2 m-2 rounded-xl bg-red-400 shadow-md hover:shadow shadow-${theme}-600" match="${key}"><div class="bg-red-300 rounded-full w-1/2 shadow-inner shadow-red-600 px-4 text-center">${mu["stage"]}</div><div class="flex"><div class="basis-1/6 bg-red-300 rounded-xl text-center m-1 text-xs shadow-inner shadow-red-600 p-1">${score}</div><div class="basis-2/3 bg-red-300 rounded-xl text-center m-1 text-xs p-1 shadow-inner shadow-red-600">${mu["teamName"]}</div><div class="basis-1/6 bg-red-300 rounded-xl text-center m-1 text-xs p-1 shadow shadow-red-600">Edit</div></div><div class="grid grid-cols-6 grid-rows-flex">`
    for(let m in mu["team"]){
      muDiv = muDiv+cstr.spriteImg(m,mu["team"]["shiny"])
    }
    muDiv = muDiv +'</div></div>'
    muTable.prepend(muDiv);
  }
  
  $(".teamrow").on("click", function() {
    sessionStorage.setItem("oppteam", $(this).attr("match"));
    window.location.href = "matchup.html";
  });
}