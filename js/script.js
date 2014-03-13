$( document ).ready(function() {
	makeDraggable();
});

function newGraphBlock() {
	var newGraphBlock = document.createElement("span");
	newGraphBlock.className = "graphBlock"; 
	newGraphBlock.id = "testplokk";
	newGraphBlock.innerHTML = "Lorem ipsum dolor sit amet";
	//newGraphBlock.setAttribute("contenteditable", "true");
	document.getElementById("workbench").appendChild(newGraphBlock); 
	makeDraggable();
	$( "#initial-instructions" ).remove();
}

function makeDraggable() {
  $( ".graphBlock" ).draggable({ containment: "#workbench ", scroll: false, stack: ".graphBlock" }).resizable();
}


 $(function() {
var tabs = $( "#workarea" ).tabs();
tabs.find( ".ui-tabs-nav" ).sortable({
axis: "x",
stop: function() {
tabs.tabs( "refresh" );
}
});
});


/*function moveGraphBlock() {
	document.getElementById("testplokk").innerHTML="CHANGED";
	
}*/

/*document.getElementById("testplokk").onmousedown=function(){
	document.getElementById("testplokk").innerHTML="CHANGED";
};
*/

