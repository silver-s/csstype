$( document ).ready(function() {
	shortcutKeys();
	designMode = new Boolean(true);
	setWorkbenchHeight();
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
var tabGbCounter = [0]; // Count the number of graphblocks in stack (per tab) for new graphblock positioning
var zindexCounter = 0;
var baseFontSize = 10;

$("#baseFontSize").change(function() {
	setBaseFontSize($(this).val());
});

function setWorkbenchHeight() {
	$(".workbench").css({"height": 0.84 * screen.height, "max-height": 0.84 * screen.height});
}

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
	li = "<li id=" + id + "-tab ><a href='#" + id + "'>" + tabCounter + "</a></li>";
	$("#li-copyTab").before($(li));
	tabs.append( "<div id='" + id + "' class='workbench'></div>" );
	tabs.tabs( "refresh" );
	$( "#workarea" ).tabs( "option", "active", tabCounter-1);
	tabGbCounter.push(0);
	tabCounter++;
	setWorkbenchHeight();
}

function copyCurrentTab() {
	var id = "workbench-" + tabCounter,
	li = "<li id=" + id + "-tab ><a href='#" + id + "'>" + tabCounter + "</a></li>";
	$("#li-copyTab").before($(li));
	tabs.append( "<div id='" + id + "' class='workbench'></div>" );
	tabs.tabs( "refresh" );
	$("#" + id).html($('#' + currentTab).html());
	$( "div#" + id ).children().removeClass( currentTab + "-blocks"  ).addClass(id + "-blocks");
	makeDraggable(id);
	setWorkbenchHeight();
	
	$("#"+ id).children().each(	function() {
		var graphBlockId = "graphBlock-" + graphBlockCounter;
		var oldId = $(this).attr("id");
		$(this).attr("id", graphBlockId);
		$("#" + graphBlockId + " > #" + oldId + "-content").attr("id", graphBlockId + "-content");
		$("#" + graphBlockId + " > #" + oldId + "-toolbox").remove();
		setEventHandlers(graphBlockId);
		graphBlockCounter++;
	});

	tabGbCounter.push(tabGbCounter[currentTab.substr(10,currentTab.length)-1]);
	$( "#workarea" ).tabs( "option", "active", tabCounter-1);
	tabCounter++;
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
		"letter-spacing: " + $("#" + graphBlockId + "-lspacing").val() + "em;<br>" + 
		"width: " + $("#" + graphBlockId + "-width").val() + "%;<br>" +
		"padding: " + $("#" + graphBlockId + "-padding-top").val() + "em " + $("#" + graphBlockId + "-padding-right").val() + "em " + $("#" + graphBlockId + "-padding-bottom").val() + "em " + $("#" + graphBlockId + "-padding-left").val() +"em;<br>" +
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
	$( "#" + graphBlockId + "-toolbox").find(".toolbox-additional").attr("id", graphBlockId + "-additional");
	$( "#" + graphBlockId + "-toolbox").find(".btn-delGraphBlock").attr("id", graphBlockId + "-delBtn");
	
	// Hide toolbox if in design mode
	if (designMode == false) { 
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
	var fontSize = document.getElementById(graphBlockId + "-content").style.fontSize;
	if (fontSize != "") { $("#" + graphBlockId + "-fontSize").val(fontSize.substring(0, fontSize.length - 2)); }
	$("#" + graphBlockId + "-fontSize").change(function() {
		setFontSize( $(this).val(), graphBlockId);
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find("#gb-line-height").attr("id", graphBlockId + "-lineHeight");
	var lineHeight = document.getElementById(graphBlockId + "-content").style.lineHeight;
	if (lineHeight != "") {	$("#" + graphBlockId + "-lineHeight").val(lineHeight.substring(0, lineHeight.length - 2)); }
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

	$("#" + graphBlockId + "-font").chosen();
	
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


	// Add new font button
	$(".btn-newFont").click(function() {
		$("#newFontDialog").zIndex(zindexCounter);
		$("#newFontOverlay").zIndex(zindexCounter);
		$("#newFontContent").zIndex(zindexCounter);
		$("#newFontDialog").removeClass("hidden");
		zindexCounter++;

		$("#newFontOverlay").mouseup(function() {
    		$("#newFontDialog").addClass("hidden");
    	});

	});

	$("#newFont-add").click(function() {
		var newFont = $("#input-font").val();
		if (isUrl(newFont)) {
			var newFontUrl = newFont;
			var fontNameSplit = newFont.split("=");
			fontNameSplit = fontNameSplit[1].split(":");
			fontNameSplit = fontNameSplit[0].split("+");
			newFont = "";
			for (var i=0; i < fontNameSplit.length; i++ ) {
				newFont += fontNameSplit[i] +" ";
			}
			newFont = newFont.substring(0, newFont.length-1);

			importGoogleFont(newFontUrl);

			customFonts.push([[newFont], newFont]);
			googleFontURLs.push(newFontUrl);

			$(".select-font").append("<option id='" + newFont + "' value='" + newFont + "'>" + newFont + "</option>");
			$("[id='" + newFont + "']").css("font-family", "\"" + newFont + "\"");
			
		}
		else {
			var newFontSplit = newFont.split(/(,\s|,)/g);
			var values = [];
			for (var i=0; i < newFontSplit.length; i++) {
				if (newFontSplit[i] != ", " && newFontSplit[i] != ",") {
					values.push("\"" + newFontSplit[i] + "\"");
				}
			}
			newFontText = newFontSplit[0];
			var customFont = [ values, newFontText ];
			customFonts.push(customFont);

			$(".select-font").append("<option id='" + newFontText + "' value='" + newFont + "'>" + newFontText + "</option>");
			$("[id='" + newFontText + "']").css("font-family", values);
		}
	

		$(".select-font").trigger("chosen:updated");
		$("#newFontDialog").addClass("hidden");
		$("#input-font").val('');
		
	});

	$("#newFont-cancel").click(function() {
		$("#newFontDialog").addClass("hidden");
		$("#input-font").val('');
	});


	// Additional toolbar
	$("#" + graphBlockId + "-toolbox").find("#gb-padding-top").attr("id", graphBlockId + "-padding-top");
	var paddingTop = document.getElementById(graphBlockId + "-content").style.paddingTop;
	if (paddingTop != "") { $("#" + graphBlockId + "-padding-top").val(paddingTop.substring(0, paddingTop.length-2)); }
	$("#" + graphBlockId + "-padding-top").change(function() {
		$("#" + graphBlockId + "-content").css("padding-top", $(this).val() + "em");
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find("#gb-padding-right").attr("id", graphBlockId + "-padding-right");
	var paddingRight = document.getElementById(graphBlockId + "-content").style.paddingRight;
	if (paddingRight != "") { $("#" + graphBlockId + "-padding-right").val(paddingRight.substring(0, paddingRight.length-2)); }
	$("#" + graphBlockId + "-padding-right" ).change(function() {
		$("#" + graphBlockId + "-content").css("padding-right", $(this).val() + "em");
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find("#gb-padding-bottom").attr("id", graphBlockId + "-padding-bottom");
	var paddingBottom = document.getElementById(graphBlockId + "-content").style.paddingBottom;
	if (paddingBottom != "") { $("#" + graphBlockId + "-padding-bottom").val(paddingBottom.substring(0, paddingBottom.length-2)); }
	$("#" + graphBlockId + "-padding-bottom" ).change(function() {
		$("#" + graphBlockId + "-content").css("padding-bottom", $(this).val() + "em");
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find("#gb-padding-left").attr("id", graphBlockId + "-padding-left");
	var paddingLeft = document.getElementById(graphBlockId + "-content").style.paddingLeft;
	if (paddingLeft != "") { $("#" + graphBlockId + "-padding-left").val(paddingLeft.substring(0, paddingLeft.length-2)); }
	$("#" + graphBlockId + "-padding-left" ).change(function() {
		$("#" + graphBlockId + "-content").css("padding-left", $(this).val() + "em");
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find("#gb-width").attr("id", graphBlockId + "-width");
	var graphBlockWidth = document.getElementById(graphBlockId).style.width;
	if (graphBlockWidth != "") { $("#" + graphBlockId + "-width").val(graphBlockWidth.substring(0, graphBlockWidth.length-1)); }
	$("#" + graphBlockId + "-width" ).change(function() {
		$("#" + graphBlockId).css("width", $(this).val() + "%");
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find("#gb-lspacing").attr("id", graphBlockId + "-lspacing");
	var graphLetterSpacing = document.getElementById(graphBlockId + "-content").style.letterSpacing;
	if (graphLetterSpacing != "") { $("#" + graphBlockId + "-lspacing").val(graphLetterSpacing.substring(0, graphLetterSpacing.length-2)); }
	$("#" + graphBlockId + "-lspacing" ).change(function() {
		$("#" + graphBlockId + "-content").css("letter-spacing", $(this).val() + "em");
		updateCssCodeBox(graphBlockId);
	});

	$("#" + graphBlockId + "-toolbox").find(".btn-additional").attr("id", graphBlockId + "-btnAdditional");
	$("#" + graphBlockId + "-btnAdditional" ).click(function() {
		$("#" + graphBlockId + "-additional").toggle();
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
		var currentTabNr = currentTab.substr(10,currentTab.length)-1;
		if (tabGbCounter[currentTabNr] > 0) {
			tabGbCounter[currentTabNr]--;
		}
	});

	$("#" + graphBlockId).on( "dragstop", function( event, ui ) {
		if (designMode == true) {
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


// Validate URL http://dzone.com/snippets/validate-url-regexp

function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}


/* Shortcut keys */

function shortcutKeys() {
	$(document).bind('keydown', 'ctrl+d', function(){
		if (designMode == true) {
			$(".toolbox").css("display", "none");
			designMode = false;
 		}
		else {
			$(".toolbox").css("display", "inline");
			designMode = true;	
		}
		return false;
	 });
	$(document).bind('keydown', 'ctrl+g', function(){ newGraphBlock(); return false; });
}

function importGoogleFont(url) {
	var newLink=document.createElement("link");
	newLink.setAttribute("href", url);
	newLink.setAttribute("rel", "stylesheet");
	newLink.setAttribute("type", "text/css");
	document.getElementsByTagName("head")[0].appendChild(newLink);
}

function saveToStorage() {
	$("#icon-save").removeClass("fa-floppy-o").addClass("fa-cog fa-spin");
	for (var i = 1; i < tabCounter; i++ ) {
		localStorage.setItem("workbench-" + i, $("#workbench-" + i).html());
	}
	localStorage.setItem("baseFontSize", baseFontSize);
	if (customFonts.length > 0) {
		localStorage.setItem("customFonts", JSON.stringify(customFonts));

		if (googleFontURLs.length > 0) {
			localStorage.setItem("googleFontURLs", JSON.stringify(googleFontURLs));
		}
	}
	setTimeout(function(){ $("#icon-save").removeClass("fa-cog fa-spin").addClass("fa-floppy-o") },900);
}

function loadFromStorage() {
	$( "#initial-instructions" ).remove();

	// Load any custom fonts
	if (localStorage.getItem("customFonts") != null) {
		if (localStorage.getItem("googleFontURLs") != null) {
			googleFontURLs = JSON.parse(localStorage.getItem("googleFontURLs"));
			for (var m = 0; m < googleFontURLs.length; m++) {
				importGoogleFont(googleFontURLs[m]);
			}
		}

		customFonts = JSON.parse(localStorage.getItem("customFonts"));

		for (var k = 0; k < customFonts.length; k++) {
			var fontText = customFonts[k][1];
			var fontValues = customFonts[k][0];
			var fontValueString = "";
			for (var l = 0; l < fontValues.length; l++) {
				fontValueString += "\"" + fontValues[l] +"\", " ;
			}
			fontValueString = fontValueString.substring(0, fontValueString.length - 2);
			$(".select-font").append("<option id='" + fontText + "' value='" + fontValues + "'>" + fontText + "</option>");
			$("[id='" + fontText + "']").css("font-family", fontValueString);		
		}
	}


	$("#workbench-1").append(localStorage.getItem("workbench-1"));
	makeDraggable("workbench-1");
	var tabId;
	if (localStorage.length > 1) {
		for (var i = 2; i != localStorage.length; i++) {
			tabId = "workbench-" + i;
			
			if (localStorage.getItem(tabId) != null) {
				addNewTab();
				$("#" + tabId).append(localStorage.getItem(tabId));
				makeDraggable(tabId);
			}
			else {
				break;
			}
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

function clearStorage() {
	$("#icon-clear").removeClass("fa-trash-o").addClass("fa-cog fa-spin");
	localStorage.clear();
	for (var i=tabCounter; i>1; i--) {
		$("#workbench-" + i).remove();
		$("#workbench-" + i + "-tab").remove();
	}
	tabs.tabs("refresh");
    $("#workbench-1").html("");
    tabGbCounter = [0];
    setTimeout(function(){ $("#icon-clear").removeClass("fa-cog fa-spin").addClass("fa-trash-o") },600);
}

var customFonts = [];
var googleFontURLs = [];
var fontStack = [
	{ value: [ "Alex Brush" ] , text: "Alex Brush" },
	{ value: [ "Arial", "Helvetica Neue", "Helvetica", "sans-serif" ], text: "Arial" },
	{ value: [ "Arial Black", "Arial Bold", "Gadget", "sans-serif" ], text: "Arial Black" },
	{ value: [ "Arial Narrow", "Arial", "sans-serif" ], text: "Arial Narrow" },
	{ value: [ "Arial Rounded MT Bold", "Helvetica Rounded", "Arial", "sans-serif" ], text: "Arial Rounded MT Bold" },
	{ value: [ "Avant Garde", "Avantgarde", "Century Gothic", "CenturyGothic", "AppleGothic", "sans-serif" ], text: "Avant Garde" },
	{ value: [ "Baskerville", "Baskerville Old Face", "Hoefler Text", "Garamond", "Times New Roman", "serif" ], text: "Baskerville" },
	{ value: [ "Big Caslon", "Book Antiqua", "Palatino Linotype", "Georgia", "serif" ], text: "Big Caslon" },
	{ value: [ "Bodoni MT", "Didot", "Didot LT STD", "Hoefler Text", "Garamond", "Times New Roman", "serif" ], text: "Bodoni MT" },
	{ value: [ "Book Antiqua", "Palatino", "Palatino Linotype", "Palatino LT STD", "Georgia", "serif" ], text: "Book Antiqua" },
	{ value: [ "Calibri", "Candara", "Segoe", "Segoe UI", "Optima", "Arial", "sans-serif" ], text: "Calibri" },
	{ value: [ "Calisto MT", "Bookman Old Style", "Bookman", "Goudy Old Style", "Garamond", "Hoefler Text", "Bitstream Charter", "Georgia", "serif" ], text: "Calisto MT" }, 
	{ value: [ "Cambria", "Georgia", "serif" ], text: "Cambria" }, 
	{ value: [ "Candara", "Calibri", "Segoe", "Segoe UI", "Optima", "Arial", "sans-serif" ], text: "Candara" },
	{ value: [ "Century Gothic", "CenturyGothic", "AppleGothic", "sans-serif" ], text: "Century Gothic" },
	{ value: [ "Comic Sans MS" ], text: "Comic Sans MS" },
	{ value: [ "Courier New", "Courier", "Lucida Sans Typewriter", "Lucida Typewriter", "monospace" ], text: "Courier New" },
	{ value: [ "Dancing Script" ], text: "Dancing Script" },
	{ value: [ "Devonshire" ], text: "Devonshire" },
	{ value: [ "Didot", "Didot LT STD", "Hoefler Text", "Garamond", "Times New Roman", "serif" ], text: "Didot" },
	{ value: [ "Franklin Gothic Medium", "Franklin Gothic", "ITC Franklin Gothic", "Arial", "sans-serif" ], text: "Franklin Gothic Medium" },
	{ value: [ "Futura", "Trebuchet MS", "Arial", "sans-serif" ], text: "Futura" },
	{ value: [ "Garamond", "Baskerville", "Baskerville Old Face", "Hoefler Text", "Times New Roman", "serif" ], text: "Garamond" }, 
	{ value: [ "Geneva", "Tahoma", "Verdana", "sans-serif" ], text: "Geneva" },
	{ value: [ "Georgia", "Times", "Times New Roman", "serif" ], text: "Georgia" },
	{ value: [ "Gill Sans", "Gill Sans MT", "Calibri", "sans-serif" ], text: "Gill Sans" },
	{ value: [ "Goudy Old Style", "Garamond", "Big Caslon", "Times New Roman", "serif" ], text: "Goudy Old Style" },
	{ value: [ "Helvetica", "Helvetica Neue", "Arial", "sans-serif" ], text: "Helvetica" },
	{ value: [ "Hoefler Text", "Baskerville old face", "Garamond", "Times New Roman", "serif" ], text: "Hoefler Text" },
	{ value: [ "Impact", "Haettenschweiler", "Franklin Gothic Bold", "Charcoal", "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", "sans serif" ], text: "Impact" },
	{ value: [ "Lucida Bright", "Georgia", "serif" ], text: "Lucida Bright" },
	{ value: [ "Lucida Console", "Lucida Sans Typewriter", "Monaco", "Bitstream Vera Sans Mono", "monospace"], text: "Lucida Console" },
	{ value: [ "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", "Geneva", "Verdana", "sans-serif" ], text: "Lucida Grande" },
	{ value: [ "Optima", "Segoe", "Segoe UI", "Candara", "Calibri", "Arial", "sans-serif" ], text: "Optima" },
	{ value: [ "Palatino", "Palatino Linotype", "Palatino LT STD", "Book Antiqua", "Georgia", "serif" ], text: "Palatino" },
	{ value: [ "Parisienne" ], text: "Parisienne" },
	{ value: [ "Perpetua", "Baskerville", "Big Caslon", "Palatino Linotype", "Palatino", "URW Palladio L", "Nimbus Roman No9 L", "serif" ], text: "Perpetua" },
	{ value: [ "Rockwell", "Courier Bold", "Courier", "Georgia", "Times", "Times New Roman", "serif" ], text: "Rockwell" },
	{ value: [ "Rockwell Extra Bold", "Rockwell Bold", "monospace" ], text: "Rockwell Extra Bold" },
	{ value: [ "Segoe UI", "Frutiger", "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", "Arial", "sans-serif" ], text: "Segoe UI" },
	{ value: [ "Tahoma", "Verdana", "Segoe", "sans-serif" ], text: "Tahoma" },
	{ value: [ "Times New Roman", "TimesNewRoman", "Times", "Baskerville", "Georgia", "serif" ], text: "Times New Roman" },
	{ value: [ "Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", "Tahoma", "sans-serif" ], text: "Trebuchet MS" },
	{ value: [ "Verdana", "Geneva", "sans-serif" ], text: "Verdana" },
	{ value: [ "Yesteryear" ], text: "Yesteryear" }	
];
