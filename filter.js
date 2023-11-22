$(function() {
    //Set input as option
    $(".dropdownOption").mousedown(function(){
        var search = $(this).parent().parent().find(".searchInput");
        search.val($(this).text());
        search.trigger("change")
        $(this).parent().hide();
    });
    
    //Filter input
    $(".searchInput").on("input", function(){
        var value = $(this).val().toUpperCase().trim().replace(/\s+/g,'-');
        var drop = $(this).parent().find("#dropdown");
        if($(this).val()===""){
            drop.hide();
        } else {
            drop.show();
            var reg = new RegExp("(^|[-])"+value+".*")
            drop.find(".dropdownOption").each(function(index, ele){
                if(reg.test(ele.innerText.toUpperCase().replace(/\s+/g,'-'))){
                    $(ele).show();
                } else {
                    $(ele).hide();
                }     
            });
        }
    });

    //Hide on unfocus
    $(".searchInput").blur(function(){
        $(this).parent().find("#dropdown").hide()
    });

});
