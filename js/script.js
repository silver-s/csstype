$( document ).ready(function() {
	makeDraggable();
});

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

	document.getElementById(currentTab).appendChild(newGraphBlock);
	makeDraggable();
	$( "#initial-instructions" ).remove();
}

function makeDraggable(tabID) {
	if (tabID === undefined) {
		tabID = currentTab;
	}
	$( "." + tabID + "-blocks" ).draggable({ containment: "#" + tabID, scroll: false, stack: ".graphBlock", handle: ".graphBlock-handle" }).resizable();
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
	$( "div#" + id ).children().removeClass( currentTab + "-blocks" ).addClass(id + "-blocks");
	makeDraggable(id);
}

/* ========= */
