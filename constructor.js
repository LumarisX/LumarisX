import * as pd from "./pokemon.js"

export function spriteImg(pokemon, shiny=false, format, flip=false, addClass=""){
    let c = "pokemon";
    if (flip){
        c = c+" transform -scale-x-100";
    }
    return(`<img class="${c} ${addClass}" src="${pd.getSprite(pokemon, "big", shiny, format)}" onerror=this.src="https://play.pokemonshowdown.com/sprites/gen5/0.png";>`)
}

export function captIcon(d){
  let s = '<div class="bg-slate-400 rounded-full mx-1">';
  if("tera" in d){
    if("z" in d){
      s = '<div class="bg-slate-400 rounded-full h-full mx-1"><img class="h-1/2" src="tera.png"><img class="h-1/2" src="z.png">';
    } else {
      s = s+'<img src="tera.png">';
    }  
  } else if("z" in d){
    s = s+'<img src="z.png">';
  }
  s = s+"</div>";
  return s;
}
