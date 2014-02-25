function newGraphBlock() {
	var newBlock = document.createElement("div");
	newBlock.className = "ui-widget-content graphic-block"; 
    newBlock.innerHTML = "<p>Lorem ipsum dolor sit amet</p>"; 
	document.body.appendChild(newBlock); 
	$(function() {
	$( ".graphic-block" ).draggable().resizable();
});

}

$(function() {
	$( ".graphic-block" ).draggable().resizable();
});
