import { BattleTypeChart } from "./data/typechart.js";

$(function(){
  $('.sprite').on("click", function(){
    console.log("swapped");
    
  });
  
  $('.value').on("click", function(){
    console.log("value");
    if($(this).hasClass('opacity-50')){
      $(this).removeClass('opacity-50');
    } else {
      $(this).Class('opacity-50');
    }
  });
});