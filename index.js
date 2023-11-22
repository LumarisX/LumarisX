import {getMoveData} from "./moves.js";


window.onload = function () {
    var select = document.getElementById("dropdown");
    console.log("g1");
    var moveData = getMoveData();
    var options = Object.keys(moveData);
    for (var key in moveData) {
        var opt = moveData[key]["name"];
        var el = document.createElement("a");
        el.textContent = opt;
        el.value = opt;
        el.className = "dropdownOption"
        select.appendChild(el);
    }
}


