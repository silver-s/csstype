$( document ).ready(function() {
	//makeDraggable();
	shortcutKeys();

	designMode = new Boolean(false);
		
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
	$("#Verdana").attr("selected","selected");
	
});

var graphBlockCounter = 1;
var tabGbCounter = [0]; // Count graphblocks per tab for positioning
var zindexCounter = 0;

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
	
	// Toolbar
	$( "#toolboxTemplate" ).clone().appendTo( newGraphBlock );
	document.getElementById(currentTab).appendChild(newGraphBlock);
	$( "#" + graphBlockId ).children( "#toolboxTemplate" ).attr({ id: graphBlockId + "-toolbox", class: "toolbox" });
	$( "#" + graphBlockId + "-toolbox" ).css("display", "inline");

	
	$("#" + graphBlockId + "-toolbox").find(".gb-font-color").attr("id", graphBlockId + "-fontColor");
	$("#" + graphBlockId + "-fontColor").spectrum({
		color: "#000",
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

	$("#" + graphBlockId + "-toolbox").find(".gb-bg-color").attr("id", graphBlockId + "-bgColor");
	$("#" + graphBlockId + "-bgColor").spectrum({
	    color: "#fff",
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

	
	// Listeners
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

	$("#" + graphBlockId + "-font").chosen();

	$("#" + graphBlockId + "-toolbox").find(".select-font-style").attr("id", graphBlockId + "-fontStyle");
	$("#" + graphBlockId + "-fontStyle" ).change(function() {
		setFontStyle( $(this).val(), graphBlockId);
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find(".btn-css").attr("id", graphBlockId + "-btnCss");
	$("#" + graphBlockId + "-btnCss" ).click(function() {
		updateCssCodeBox(graphBlockId);
		$("#" + graphBlockId + "-cssCode").toggle();
	});

	$("#" + graphBlockId + "-toolbox").find(".chosen-single").attr("id", graphBlockId + "-chosen-single");

	// Paste detection
	$("#" + graphBlockId + "-content").bind('paste', function(e) {
		var pastedText = e.originalEvent.clipboardData.getData('Text');
        $("#" + graphBlockId + "-content").append(pastedText);
        return false;
    });


	// CSS Code box

	var newCssCodeBox = document.createElement("span");
	newCssCodeBox.className = "css-code hidden";
	newCssCodeBox.id = graphBlockId + "-cssCode";
	document.getElementById(graphBlockId + "-toolbox").appendChild(newCssCodeBox);


	$("#" + graphBlockId).zIndex(zindexCounter);
	zindexCounter++;

	$("#" + graphBlockId).mousedown(function() {
		$("#" + graphBlockId).zIndex(zindexCounter);
		zindexCounter++;
	});

    
    // Graphblock delete button
	var newGraphBlockDelBtn = document.createElement("span");
	newGraphBlockDelBtn.className = "btn-delGraphBlock";
	newGraphBlockDelBtn.id = graphBlockId + "-delBtn";
	document.getElementById(graphBlockId).appendChild(newGraphBlockDelBtn);
	$("#" + graphBlockId + "-delBtn").html("<i class='fa fa-times'></i>");

	$("#" + graphBlockId + "-delBtn").click(function() {
		$("#" + graphBlockId).remove();
	});


	// Hide toolboxes if in design mode
	if (designMode === true) { 
		$( "#" + graphBlockId + "-toolbox" ).css("display", "none");
		$("#" + graphBlockId + "-delBtn").css("display", "none");
	}


	// Position graphblock

	currentTabNr = currentTab.substr(currentTab.length-1);
	$("#" + graphBlockId).css({"top": tabGbCounter[currentTabNr-1] * 15  + "px", "left": tabGbCounter[currentTabNr-1] * 15 + 10 + "px"});


	makeDraggable();
	$("#" + graphBlockId).on( "dragstart", function( event, ui ) {
		$("#" + graphBlockId + "-toolbox").css("display", "none");
		tabGbCounter[currentTabNr-1]--;
	} );
	$("#" + graphBlockId).on( "dragstop", function( event, ui ) {
		$("#" + graphBlockId + "-toolbox").css("display", "inline");
	} );


	$( "#initial-instructions" ).remove();
	graphBlockCounter++;
	tabGbCounter[currentTabNr-1]++;
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
	active: 2,
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
	tabs.find( ".ui-tabs-nav" ).append( li );
	tabs.append( "<div id='" + id + "' class='workbench'></div>" );
	tabs.tabs( "refresh" );
	tabGbCounter.push(0);
	tabCounter++;
	$( "#workarea" ).tabs( "option", "active", tabCounter);
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
		"font-style: " + $("#" + graphBlockId + "-content").css("font-style") + ";<br>" + 
		"font-weight: " + $("#" + graphBlockId + "-content").css("font-weight") + ";<br>" + 
		"font-size: " + $("#" + graphBlockId + "-content").css("font-size") + ";<br>" + 
		"line-height: " + $("#" + graphBlockId + "-content").css("line-height") + ";<br>" + 
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
	$("#" + graphBlockId + "-content").css("font-size", size + "px");
}

function setLineHeight( height, graphBlockId ) {
	$("#" + graphBlockId + "-content").css("line-height", height + "px");
}

function setFont( font, graphBlockId ) {
	$("#" + graphBlockId + "-content").css("font-family", font);
	$("#" + graphBlockId + "-chosen-single").css("font-family", font);
}

function setFontStyle( fontstyle, graphBlockId ) {
	if (fontstyle === "bold italic") {
		$("#" + graphBlockId + "-content").css("font-style", "italic");
		$("#" + graphBlockId + "-content").css("font-weight", "bold");
	}
	else if (fontstyle === "bold") {
		$("#" + graphBlockId + "-content").css("font-style", "normal");
		$("#" + graphBlockId + "-content").css("font-weight", "bold");
	}
	else {
		$("#" + graphBlockId + "-content").css("font-style", fontstyle);
		$("#" + graphBlockId + "-content").css("font-weight", "normal");
	}
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
	{ value: [ "Helvetica Neue", "Helvetica", "Arial", "sans-serif" ], text: "Helvetica" },
	{ value: [ "Impact", "Haettenschweiler", "Franklin Gothic Bold", "Charcoal", "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", "sans serif" ], text: "Impact" },
	{ value: [ "Parisienne" ], text: "Parisienne" },
	{ value: [ "Segoe UI", "Frutiger", "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", "Arial", "sans-serif" ], text: "Segoe UI" },
	{ value: [ "Tahoma", "Verdana", "Segoe", "sans-serif" ], text: "Tahoma" },
	{ value: [ "Times New Roman" ], text: "Times New Roman" },
	{ value: [ "Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", "Tahoma", "sans-serif" ], text: "Trebuchet MS" },
	{ value: [ "Verdana", "Geneva", "sans-serif" ], text: "Verdana" },
	{ value: [ "Yesteryear" ], text: "Yesteryear" }	
];


/* Shortcut keys */

function shortcutKeys() {
	$(document).bind('keydown', 'ctrl+m', function(){
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
	 });
	$(document).bind('keydown', 'ctrl+g', function(){ newGraphBlock(); });
	$(document).bind('keydown', 'ctrl+x', function(){ addNewTab(); });
}

