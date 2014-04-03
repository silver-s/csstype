$( document ).ready(function() {
	makeDraggable();
	//$( ".graphBlock-content" ).resizable().draggable();
});

/* Later perhaps
var webSafeFonts = new Array(
	"Arial",
	"Comic Sans",
	"Courier New",
	"Times New Roman",
	"Impact",
	"Georgia",
	"Trebuchet",
	"Webdings",
	"Verdana"
);

var googleFonts = new Array(
	"Dancing Script"
);
*/


function newGraphBlock() {
	var newGraphBlock = document.createElement("span");
	newGraphBlock.className = "graphBlock " + currentTab + "-blocks";
		
	var newGraphBlockHandle = document.createElement("span");
	newGraphBlockHandle.className = "graphBlock-handle";
	newGraphBlock.appendChild(newGraphBlockHandle);

	var newGraphBlockContent = document.createElement("span");
	newGraphBlockContent.className = "graphBlock-content";
	newGraphBlockContent.innerHTML = "Lorem ipsum dolor sit amet";
	newGraphBlockContent.setAttribute("contenteditable", "true");
	newGraphBlock.appendChild(newGraphBlockContent);

	$( "#toolbox" ).clone().appendTo( newGraphBlock );
	document.getElementById(currentTab).appendChild(newGraphBlock);
	$( "." + currentTab + "-blocks" ).children().removeClass("hidden");
	makeDraggable();
	$( "#initial-instructions" ).remove();

}

function makeDraggable(tabId) {
	if (tabId === undefined) {
		tabId = currentTab;
	}
	$( "." + tabId + "-blocks" ).draggable({ containment: "#" + tabId, scroll: false, stack: ".graphBlock", handle: ".graphBlock-handle" });/*.resizable({ containment: "#" + tabId });*/
}

/* ===Tabs=== */

var currentTab = "workbench-1";
var tabCounter = 2;
var tabs = $( "#workarea" ).tabs({
	active: 1,
	activate: function( event, ui ) {
		var active = $("#workarea").tabs("option", "active");
        currentTabHash = $("#workarea ul>li a").eq(active).attr('href');
        currentTab = currentTabHash.substr(1, currentTabHash.length);
	},
	beforeActivate: function( event, ui ) {
		if (ui.newPanel[0].id === "addNewTab") {
			addNewTab();
			return false;
		}
	}
});


function addNewTab() {
	var id = "workbench-" + tabCounter,
	li = "<li><a href='#" + id + "'>" + tabCounter + "</a></li>";
	tabs.find( ".ui-tabs-nav" ).append( li );
	tabs.append( "<div id='" + id + "' class='workbench'></div>" );
	tabs.tabs( "refresh" );
	tabCounter++;
}

function copyCurrentTab() {
	var id = "workbench-" + tabCounter,
	li = "<li><a href='#" + id + "'>" + tabCounter + "</a></li>";
	tabs.find( ".ui-tabs-nav" ).append( li );
	tabs.append( "<div id='" + id + "' class='workbench'></div>" );
	tabs.tabs( "refresh" );
	tabCounter++;
	$('#' + id).html($('#' + currentTab).html());
	$( "div#" + id ).children().removeClass( currentTab + "-blocks"  ).addClass(id + "-blocks");
	//$( "." + id + "-blocks" ).children().removeClass("ui-resizable-e ui-resizable-se ui-resizable-s ui-resizable-handle");
	makeDraggable(id);
}

/* ========= */

/*
$(".graphBlock").hover( 
	function() {
		$( ".toolbox" ).removeClass("hidden").addClass("visible");
	}, function() {
		$( ".toolbox" ).removeClass("visible").addClass("hidden");
	}
);
*/

// Color picker

function setNewColor(color, graphBlockId) {
	
};

$(".gb-font-color").spectrum({
	color: "#fdfa00",
	showInput: true,
	showAlpha: true,
    showPalette: true,
    showSelectionPalette: true,
    palette: [ ],
    clickoutFiresChange: true,
    showInitial: true,
    showButtons: false,
    className: 'spectrum-font',
    preferredFormat: "hex",
    show: function(color) {
    	var graphBlockId;
	},
    move: function(color) {
    	var newColor = color.toHexString(); // #ff0000
    	setNewColor(newColor);
	}
});

$(".gb-bg-color").spectrum({
    color: "#4f495c",
    showInput: true,
    showAlpha: true,
    showPalette: true,
    showSelectionPalette: true,
    palette: [ ],
    clickoutFiresChange: true,
    showInitial: true,
    showButtons: false,
    className: 'spectrum-bg',
    preferredFormat: "hex"
});
