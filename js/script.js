$( document ).ready(function() {
	shortcutKeys();
	designMode = new Boolean(false);
	$(".workbench").css({"height": 0.84 * screen.height, "max-height": 0.84 * screen.height});
		
	// Add fonts to the select box
	for (var i = 0; i < fontStack.length; i++) {
		var fontText = fontStack[i]['text'];
		var fontValue = fontStack[i]['value'];
		var fontValueString ="";
		for (var j = 0; j < fontValue.length; j++) {
			fontValueString += "\"" + fontValue[j] +"\", " ;
		}
		fontValueString = fontValueString.substring(0, fontValueString.length - 2);
		$("#select-font-hidden").append("<option id='" + fontText + "' value='" + fontValue + "'>" + fontText + "</option>");
		$("[id='" + fontText + "']").css("font-family", fontValueString);		
	}
	
	if (localStorage.length > 0) { loadFromStorage(); }
});

var graphBlockCounter = 1;
var tabGbCounter = [0]; // Count graphblocks per tab for positioning
var zindexCounter = 0;
var baseFontSize = 10;

$("#baseFontSize").change(function() {
	setBaseFontSize($(this).val());
});

function setBaseFontSize(newBaseFontSize) {
	$(".workbench").css("font-size", newBaseFontSize + "px");
	baseFontSize = newBaseFontSize;
}

function newGraphBlock() {
	var graphBlockId = "graphBlock-" + graphBlockCounter;
	var newGraphBlock = document.createElement("span");
	newGraphBlock.className = "graphBlock " + currentTab + "-blocks";
	newGraphBlock.id = graphBlockId;
	
	// Handle	
	var newGraphBlockHandle = document.createElement("span");
	newGraphBlockHandle.className = "graphBlock-handle";
	newGraphBlock.appendChild(newGraphBlockHandle);

	// Content
	var newGraphBlockContent = document.createElement("span");
	newGraphBlockContent.className = "graphBlock-content";
	newGraphBlockContent.id = graphBlockId + "-content";
	newGraphBlockContent.innerHTML = "The quick brown fox jumps over the lazy dog";
	newGraphBlockContent.setAttribute("contenteditable", "true");
	newGraphBlockContent.setAttribute("spellcheck", false);
	newGraphBlock.appendChild(newGraphBlockContent);
	
	document.getElementById(currentTab).appendChild(newGraphBlock);
	
	setEventHandlers(graphBlockId);
	
	// Position graphblock
	currentTabNr = currentTab.substr(10,currentTab.length);
	$("#" + graphBlockId).css({"top": tabGbCounter[currentTabNr-1] * 15  + 5 + "px", "left": tabGbCounter[currentTabNr-1] * 15 + 15 + "px"});

	makeDraggable();
	graphBlockCounter++;
	tabGbCounter[currentTabNr-1]++;
	$( "#initial-instructions" ).remove();
    
}


function makeDraggable(tabId) {
	if (tabId === undefined) {
		tabId = currentTab;
	}
	$( "." + tabId + "-blocks" ).draggable({ 
		containment: "#" + tabId, 
		scroll: false, 
		/*stack: ".graphBlock",*/ 
		handle: ".graphBlock-handle"
	});
}

/* ===Tabs=== */

var currentTab = "workbench-1";
var tabCounter = 2;
var tabs = $( "#workarea" ).tabs({
	active: 0,
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
		if (ui.newPanel[0].id === "copyCurrentTab") {
			copyCurrentTab();
			return false;
		}
	}
});


function addNewTab() {
	var id = "workbench-" + tabCounter,
	li = "<li><a href='#" + id + "'>" + tabCounter + "</a></li>";
	$("#li-copyTab").before($(li));
	tabs.append( "<div id='" + id + "' class='workbench'></div>" );
	tabs.tabs( "refresh" );
	$( "#workarea" ).tabs( "option", "active", tabCounter-1);
	tabGbCounter.push(0);
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
	
	makeDraggable(id);
	$( "#workarea" ).tabs( "option", "active", tabCounter);
}



/* Toolbar stuff */

function updateCssCodeBox(graphBlockId) {
	$("#" + graphBlockId + "-cssCode").html(
		"font-family: " + $("#" + graphBlockId + "-content").css("font-family") + ";<br>" +
		"font-size: " + $("#" + graphBlockId + "-fontSize").val() + "em;<br>" + 
		"font-style: " + $("#" + graphBlockId + "-content").css("font-style") + ";<br>" + 
		"font-weight: " + $("#" + graphBlockId + "-content").css("font-weight") + ";<br>" + 
		"text-decoration: " + $("#" + graphBlockId + "-content").css("text-decoration") + ";<br>" + 
		"line-height: " + $("#" + graphBlockId + "-lineHeight").val() + "em;<br>" + 
		"color: " + $("#" + graphBlockId + "-fontColor").spectrum("get") + ";<br>" + 
		"background-color: " + $("#" + graphBlockId + "-bgColor").spectrum("get") +";"
	);
}


function setFontColor(color, graphBlockId) {
	$("#" + graphBlockId + "-content").css("color", color);
};

function setBgColor(color, graphBlockId) {
	$("#" + graphBlockId + "-content").css("background-color", color);
};

function setFontSize( size, graphBlockId ) {
	$("#" + graphBlockId + "-content").css("font-size", size + "em");
}

function setLineHeight( height, graphBlockId ) {
	$("#" + graphBlockId + "-content").css("line-height", height + "em");
}

function setFont( font, graphBlockId ) {
	$("#" + graphBlockId + "-content").css("font-family", font);
	$("#" + graphBlockId + "-chosen-single").css("font-family", font);
}


function setEventHandlers(graphBlockId) {
	// Copy toolbox
	$( "#toolboxTemplate" ).clone().appendTo($("#" + graphBlockId));
	
	$( "#" + graphBlockId ).children("#toolboxTemplate").attr({ id: graphBlockId + "-toolbox", class: "toolbox" });
	$( "#" + graphBlockId + "-toolbox" ).css("display", "inline");
	$( "#" + graphBlockId + "-toolbox").find("#cssCodeTemplate").attr({ id: graphBlockId + "-cssCode", class: "css-code hidden" });
	$( "#" + graphBlockId + "-toolbox").find(".btn-delGraphBlock").attr("id", graphBlockId + "-delBtn");
	
	// Hide toolbox if in design mode
	if (designMode === true) { 
		$("#" + graphBlockId + "-toolbox").css("display", "none");
	}


	// Font color handler
	$("#" + graphBlockId + "-toolbox").find(".gb-font-color").attr("id", graphBlockId + "-fontColor");
	$("#" + graphBlockId + "-fontColor").spectrum({
		color: $("#" + graphBlockId + "-content").css("color"),
		showInput: true,
	    showPalette: true,
	    showSelectionPalette: true,
	    palette: [ ],
	    clickoutFiresChange: true,
	    showInitial: true,
	    showButtons: false,
	    className: 'spectrum-font',
	    preferredFormat: "hex",
	    move: function(color) {
	    	var newColor = color.toHexString();
	    	setFontColor(newColor, graphBlockId);
	    	updateCssCodeBox(graphBlockId);
		},
		change: function(color) {
	    	var newColor = color.toHexString();
	    	setFontColor(newColor, graphBlockId);
	    	updateCssCodeBox(graphBlockId);
		}
	});	


	// Background color handler
	$("#" + graphBlockId + "-toolbox").find(".gb-bg-color").attr("id", graphBlockId + "-bgColor");
	$("#" + graphBlockId + "-bgColor").spectrum({
	    color: $("#" + graphBlockId + "-content").css("background-color"),
	    showInput: true,
	    showPalette: true,
	    showSelectionPalette: true,
	    palette: [ ],
	    clickoutFiresChange: true,
	    showInitial: true,
	    showButtons: false,
	    className: 'spectrum-bg',
	    preferredFormat: "hex",
	    move: function(color) {
	    	var newColor = color.toHexString();
	    	setBgColor(newColor, graphBlockId);
	    	updateCssCodeBox(graphBlockId);
		},
		change: function(color) {
 			var newColor = color.toHexString();
	    	setBgColor(newColor, graphBlockId);
	    	updateCssCodeBox(graphBlockId);
		}
	});

	$("#" + graphBlockId + "-toolbox").find(".spectrum-font").attr("title", "Font color");
	$("#" + graphBlockId + "-toolbox").find(".spectrum-bg").attr("title", "Background color");

	$("#" + graphBlockId + "-toolbox").find("#gb-font-size").attr("id", graphBlockId + "-fontSize");
	$("#" + graphBlockId + "-fontSize" ).change(function() {
		setFontSize( $(this).val(), graphBlockId);
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find("#gb-line-height").attr("id", graphBlockId + "-lineHeight");
	$("#" + graphBlockId + "-lineHeight" ).change(function() {
		setLineHeight( $(this).val(), graphBlockId);
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find(".select-font").attr("id", graphBlockId + "-font");
	$("#" + graphBlockId + "-font" ).change(function() {
		setFont( $(this).val(), graphBlockId);
		updateCssCodeBox(graphBlockId);
	});

	var graphBlockFont = $("#" + graphBlockId + "-content").css("font-family").split(",");
	graphBlockFont = graphBlockFont[0];
	$("#" + graphBlockId + "-font > option[id=" + graphBlockFont + "]").attr("selected", true);

	$("#" + graphBlockId + "-font").chosen({width: "100%"});
	
	$("#" + graphBlockId + "-toolbox").find(".chosen-single").attr("id", graphBlockId + "-chosen-single");
	$("#" + graphBlockId + "-toolbox").find(".chosen-results").attr("id", graphBlockId + "-chosen-results");
	$("#" + graphBlockId + "-chosen-results, #" + graphBlockId + "-chosen-single").css({ "font-family": $("#" + graphBlockId + "-content").css("font-family") });
	if ($("#" + graphBlockId + "-content").hasClass("bold")) { $("#" + graphBlockId + "-chosen-results, #" + graphBlockId + "-chosen-single").addClass("bold"); }
	if ($("#" + graphBlockId + "-content").hasClass("italic")) { $("#" + graphBlockId + "-chosen-results, #" + graphBlockId + "-chosen-single").addClass("italic"); }
	if ($("#" + graphBlockId + "-content").hasClass("underline")) { $("#" + graphBlockId + "-chosen-results, #" + graphBlockId + "-chosen-single").addClass("underline"); }
	
	$("#" + graphBlockId + "-toolbox").find(".btn-bold").attr("id", graphBlockId + "-bold");
	$("#" + graphBlockId + "-bold" ).click(function() {
		$("#" + graphBlockId + "-content, #" + graphBlockId + "-chosen-results, #" + graphBlockId + "-chosen-single").toggleClass("bold");
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find(".btn-italic").attr("id", graphBlockId + "-italic");
	$("#" + graphBlockId + "-italic" ).click(function() {
		$("#" + graphBlockId + "-content, #" + graphBlockId + "-chosen-results, #" + graphBlockId + "-chosen-single").toggleClass("italic");
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find(".btn-underline").attr("id", graphBlockId + "-underline");
	$("#" + graphBlockId + "-underline" ).click(function() {
		$("#" + graphBlockId + "-content, #" + graphBlockId + "-chosen-results, #" + graphBlockId + "-chosen-single").toggleClass("underline");
		updateCssCodeBox(graphBlockId);
	});


	$("#" + graphBlockId + "-toolbox").find(".btn-css").attr("id", graphBlockId + "-btnCss");
	$("#" + graphBlockId + "-btnCss" ).click(function() {
		updateCssCodeBox(graphBlockId);
		$("#" + graphBlockId + "-cssCode").toggle();
	});


	// GraphBlock delete button
	$("#" + graphBlockId + "-delBtn").click(function() {
		$("#" + graphBlockId).remove();
	});


	// Zindex
	$("#" + graphBlockId).zIndex(zindexCounter);
	zindexCounter++;

	$("#" + graphBlockId).mousedown(function() {
		$("#" + graphBlockId).zIndex(zindexCounter);
		zindexCounter++;
	});


	// Hide toolbar when dragging
	$("#" + graphBlockId).on( "dragstart", function( event, ui ) {
		$("#" + graphBlockId + "-toolbox").css("display", "none");
		if (tabGbCounter > 0) {
			tabGbCounter[currentTabNr-1]--;
		}
	});

	$("#" + graphBlockId).on( "dragstop", function( event, ui ) {
		if (designMode == false) {
			$("#" + graphBlockId + "-toolbox").css("display", "inline");
		}
	});

	// Swith graphblock font on hover
	$("#" + graphBlockId + "-toolbox").find(".toolbox-bottombar").attr("id", graphBlockId + "-toolbox-bottombar");
	$("#" + graphBlockId + "-toolbox-bottombar").click(function() {
		var currentFont = $("#" + graphBlockId + "-content").css("font-family");
		var selectedFont;
		$(".active-result").on( {
			click: function() {
				$("#" + graphBlockId + "-content").css("font-family", selectedFont);
	    	},
	    	mouseover: function() {
	        	selectedFont = $(this).css("font-family");
				$("#" + graphBlockId + "-content").css("font-family", selectedFont);
	    	},
	    	mouseleave: function() {
	    		$("#" + graphBlockId + "-content").css("font-family", currentFont);
	    	}
    	});
	});

}


/* Shortcut keys */

function shortcutKeys() {
	$(document).bind('keydown', 'ctrl+d', function(){
		if (designMode === true) {
			$(".toolbox").toggle();
			$(".btn-delGraphBlock").toggle();
			designMode = false;
 		}
		else {
			$(".toolbox").toggle();
			$(".btn-delGraphBlock").toggle();
			designMode = true;	
		}
		return false;
	 });
	$(document).bind('keydown', 'ctrl+g', function(){ newGraphBlock(); return false; });

	$(document).bind('keydown', 'ctrl+n', function(){ addNewTab(); return false });

	$(document).bind('keydown', 'ctrl+s', function(){ saveToStorage(); return false });
}



function saveToStorage() {
	$("#saveSpinner").css("display", "inline-block");
	for (var i = 1; i < tabCounter; i++ ) {
		localStorage.setItem("workbench-" + i, $("#workbench-" + i).html());
	}
	localStorage.setItem("baseFontSize", baseFontSize);
	setTimeout(function(){ $("#saveSpinner").css("display", "none") },900);
}

function loadFromStorage() {
	$( "#initial-instructions" ).remove();

	$("#workbench-1").append(localStorage.getItem("workbench-1"));
	makeDraggable("workbench-1");
	var tabId;
	if (localStorage.length > 1) {
		for (var i = 2; i != localStorage.length; i++) {
			tabId = "workbench-" + i;
			addNewTab();
			$("#" + tabId).append(localStorage.getItem(tabId));
			makeDraggable(tabId);
		}
	}

	$("#workarea").tabs( "option", "active", 0 );

	var graphBlocks = ($(".graphBlock"));
	var graphBlockId;

	for (var j = 0; j < graphBlocks.length; j++) {
		graphBlockId = graphBlocks[j].id;

		// Remove old toolbox and add toolbox with working event handlers
		$("#" + graphBlockId + "-toolbox").remove();
		setEventHandlers(graphBlockId);
		graphBlockCounter++;
	}
	setBaseFontSize(localStorage.getItem("baseFontSize"));
	$("#baseFontSize").val(baseFontSize);
}


var fontStack = [
	{ value: [ "Alex Brush" ] , text: "Alex Brush" },
	{ value: [ "Arial", "Helvetica Neue", "Helvetica", "sans-serif" ], text: "Arial" },
	{ value: [ "Arial Black", "Arial Bold", "Gadget", "sans-serif" ], text: "Arial Black" },
	{ value: [ "Arial Narrow", "Arial", "sans-serif" ], text: "Arial Narrow" },
	{ value: [ "Arial Rounded MT Bold", "Helvetica Rounded", "Arial", "sans-serif" ], text: "Arial Rounded MT Bold" },
	{ value: [ "Calibri", "Candara", "Segoe", "Segoe UI", "Optima", "Arial", "sans-serif" ], text: "Calibri" },
	{ value: [ "Candara, Calibri", "Segoe", "Segoe UI", "Optima", "Arial", "sans-serif" ], text: "Candara" },
	{ value: [ "Century Gothic", "CenturyGothic", "AppleGothic", "sans-serif" ], text: "Century Gothic" },
	{ value: [ "Comic Sans MS" ], text: "Comic Sans MS" },
	{ value: [ "Courier New" ], text: "Courier New" },
	{ value: [ "Dancing Script" ], text: "Dancing Script" },
	{ value: [ "Devonshire" ], text: "Devonshire" },
	{ value: [ "Franklin Gothic Medium", "Franklin Gothic", "ITC Franklin Gothic", "Arial", "sans-serif" ], text: "Franklin Gothic Medium" },
	{ value: [ "Futura", "Trebuchet MS", "Arial", "sans-serif" ], text: "Futura" },
	{ value: [ "Geneva", "Tahoma", "Verdana", "sans-serif" ], text: "Geneva" },
	{ value: [ "Gill Sans", "Gill Sans MT", "Calibri", "sans-serif" ], text: "Gill Sans" },
	{ value: [ "Georgia" ], text: "Georgia" },
	{ value: [ "Helvetica", "Helvetica Neue", "Arial", "sans-serif" ], text: "Helvetica" },
	{ value: [ "Impact", "Haettenschweiler", "Franklin Gothic Bold", "Charcoal", "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", "sans serif" ], text: "Impact" },
	{ value: [ "Parisienne" ], text: "Parisienne" },
	{ value: [ "Segoe UI", "Frutiger", "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", "Arial", "sans-serif" ], text: "Segoe UI" },
	{ value: [ "Tahoma", "Verdana", "Segoe", "sans-serif" ], text: "Tahoma" },
	{ value: [ "Times New Roman" ], text: "Times New Roman" },
	{ value: [ "Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", "Tahoma", "sans-serif" ], text: "Trebuchet MS" },
	{ value: [ "Verdana", "Geneva", "sans-serif" ], text: "Verdana" },
	{ value: [ "Yesteryear" ], text: "Yesteryear" }	
];