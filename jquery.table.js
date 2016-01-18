$(function(){

    $.fn.table = function(options){
	
	var opts = $.extend({},$.fn.table.defaults,options);
	var table = $("<table>");
	var tr = $("<tr>");
	$.each(opts.header,function(){
	    tr.append("<th>"+this+"</th>");
	});
	table.append($("<thead>").append(tr));

	var tbody = $("<tbody>");
	for(var y=0;y<opts.rows;y++){
	    var tr = $("<tr>");
	    for(var x=0;x<opts.header.length;x++){
		tbody.append(tr.append($("<td>").append(
		    $("<input type=\"text\" id=\"" + x + "-" + y + "\">")))
		);
	    }
	}
	table.append(tbody);
	$(this).append(table);

	$.each(opts.data,function(y,v){
	    $.each(v,function(x,v2){
		$("#" + x + "-" + y).val(v2);
	    });
	});
	var fx=0;fy=0;
	$("#"+fx+"-"+fy).focus();
	
	$(this).keydown(function(e){
	    if(e.keyCode == 37) fx--;
	    else if(e.keyCode == 38) fy--;
	    else if(e.keyCode == 39) fx++;
	    else if(e.keyCode == 40) fy++;
	    else return;

	    if(fx<0) fx=0;
	    if(fy<0) fy=0;
	    if(fx>opts.header.length-1) fx=opts.header.length-1;
	    if(fy>opts.rows-1) fy=opts.rows-1;
	    
	    $("#"+fx+"-"+fy).focus();
	});
    }

    $.fn.table.defaults = {
	rows : 10
    };
    
});  