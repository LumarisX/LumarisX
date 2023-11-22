import * as pd from "./pokemon.js";
import * as cstr from "./constructor.js";

function update() {
    var teamDiv = $("#teams");
    $(".team").remove();
    var leagues = JSON.parse(localStorage.getItem("team"));
    for (var key in leagues) {
        let league = leagues[key];
        let leagueEle = $('<li class="team bg-cyan-300 shadow-md hover:shadow-md shadow-cyan-600 m-2 p-2 rounded-xl" league=' + key + '><p class= "text-medium bg-cyan-200 w-1/3 rounded-full shadow-inner shadow-cyan-600 p-1 text-center">' + league["leagueName"] + "</p></li>");
        let spriteDiv = $('<div class="sprites grid grid-cols-6 px-4 pt-2"></div>')
        for (let monName in league["team"]) {
            let mon = league["team"][monName];
            spriteDiv.append($(cstr.spriteImg(monName, league["team"][monName]["shiny"], true)));
        }
        leagueEle.append(spriteDiv);
        teamDiv.append(leagueEle);
    }
    
    $(".team").on("click", function () {
        sessionStorage.setItem("team", $(this).attr("league"));
        window.location.href = "team.html";
    });
}
$(function () {
    update();

    $("#export").on("click", function () {
        $(this).hide();
        $("#importDiv").show();
        $("#teamInput").val(localStorage.getItem("team"));
        $("#teamInput").focus();
        $("#teamInput").select();
    });
    $("#import").on("click", function () {
        var iEle = $("#teamInput");
        try {
            JSON.parse(iEle.val()); localStorage.setItem("team", iEle.val());
            $("#importDiv").hide();
            $("#export").show();
            update();
        } catch (e) {
            iEle.val("Invalid");
            console.log("Invalid JSON format")
        }
    });
});
