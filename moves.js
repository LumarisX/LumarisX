var moveData;

$.ajax({
  dataType: "json",
  url: "https://play.pokemonshowdown.com/data/moves.json",
  async: false,
  success: function(data) {
    moveData = data
    return true;
  }
});

export function getMove(move) {
  return moveData[move.toLowerCase()];
}

export function getName(move) {
  return moveData[move]["name"];
}

export function getValue(moveName) {
  let move = moveData[moveName];
  let value = move["basePower"] * move["accuracy"] / 100;
  let flags = move["flags"];
  if ("charge" in flags || "recharge" in flags) {
    value = value / 2;
  }
  if ("condition" in move && "duration" in move["condition"]) {
    let duration = move["condition"]["duration"];
    if (duration == 1) {
      value = value / 4;
    }
    if (duration == 2) {
      value = value / 2;
    }
  }
  if ("self" in move) {
    if ("volatileStatus" in move["self"]) {
      if (move["self"]["volatileStatus"] === "lockedmove") {
        value = value / 2;
      }
    }
  }
  return value;
}
