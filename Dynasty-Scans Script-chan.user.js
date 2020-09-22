// ==UserScript==
// @name         Dynasty-Scans Script-chan
// @name:jp      「ディナスティースキャンズ」- 「ユーザースクリプトちゃん」
// @namespace    dynasty-scans.com/scriptchan
// @website      https://github.com/gwennie-chan/Dynasty-Scans-Script-chan
// @supportURL   https://dynasty-scans.com/forum/topics/7297-dynasty-reader-userscripts
// @version      0.1
// @downloadURL  https://github.com/gwennie-chan/Dynasty-Scans-Script-chan/raw/master/Dynasty-Scans%20Script-chan.user.js
// @updateURL    https://github.com/gwennie-chan/Dynasty-Scans-Script-chan/raw/master/Dynasty-Scans%20Script-chan.user.js
// @description  Implements various userscripts for Dynasty-Scans.com into one neat package!
// @author       Dynasty-Scans Scripters (Alice Cheshire, cyricc, gwennie-chan)
// @include      https://dynasty-scans.com/*
// @exclude      https://dynasty-scans.com/system/*
// @exclude      https://dynasty.scans.com/*.json
// @grant        GM_getValue
// @grant        GM_listValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getResourceText
// @run-at       document-end
// ==/UserScript==

//---Global Variables---
const tagsJSON = "https://dynasty-scans.com/tags.json";
const tagURLstub = "https://dynasty-scans.com/tags/";
const currentURL = window.location.pathname;

$.when($.ready).done(function(){
    initUI();
    $('#scriptchan').click(function(){
        if(!$('#scmenu').is(':visible')){
           //console.log("No Menu Present, Deploying Menu");
           $('#scmenu').slideDown();
        }
        else if($('#scmenu').is(':visible')) {
           //console.log("Menu Present, Removing Menu");
           $('#scmenu').slideUp();
        }
        else {
           //console.log("Menu Error");
           alert("Script-chan Menu Error!");
        }
    });
});

function initUI(){
    //Create Nav Bar Button For SC Menu
    $('.nav-collapse .pull-right:first-child').append('<li id="scriptchan" title="Dynasty-Scans Script-chan!" style="background-color: rgba(255,255,255,0.2); margin-right: -20px;"><a><i class="icon-wrench icon-white"></i></a></li>');
    //Inject UI CSS
    appendUIcss();
    //Inject SC Menu - Hidden By Default
    $('.nav-collapse .pull-right:first-child').append(`
    <div id="scmenu">
        <h3>Script-chan Control Panel</h3>
            <h4>Browsing Tweaks</h4>
                <li><input type="checkbox" id="thingifier-fixed-navbar"><label for="thingifier-fixed-navbar">Fixed Navbar</label></li>
                <li><input type="checkbox" id="thingifier-pagination"><label for="thingifier-pagination">Top Page Selector</label></li>
                <li><input type="checkbox" id="cyricc-mark-read"><label for="cyricc-mark-read">Mark Read</label></li>
                <li><input type="checkbox" id="cyricc-tag-hider"><label for="cyricc-tag-hider">Tag Hider</label></li>
                <li>Font Size&nbsp;&nbsp;<input type="range" id="thingifier-font-size" min="1" max="5"><span id="thingifier-font-size" style="padding:0px 5px">(XXpx)</span><button type="button" id="thingifier-reset-font" style="margin-left:10px" title="Resets Font Size Change"Mom>Reset</button></li>
            <h4>Forum Tweaks</h4>
                <li><input type="checkbox" id="thingifier-unhide-spoilers"><label for="thingifier-unhide-spoilers">Unhide Spoilers</label></li>
                <li><button type="button" id="thingifier-ownposts" style="position: relative; left: 40px; top: -5px;" title="Navigate to a forum page you've posted on to automatically enable this button!" disabled>Your Posts</button></li>
                <li><input type="checkbox" id="thingifier-bbcode-buttons"><label for="thingifier-bbcode-buttons">Enable Quick Reply (QR) Posts</label></li>
                <li><input type="checkbox" id="thingifier-quote-to-quickreply"><label for="thingifier-quote-to-quickreply">QR On Page</label></li>
                <li><input type="checkbox" id="thingifier-quote-move-quickreply"><label for="thingifier-quote-move-quickreply">QR Below Post</label></li>
                <li><input type="checkbox" id="gc-forum-tagger"><label for="gc-forum-tagger">Forum Tagger</label></li>
                <li><input type="checkbox" id="gc-stats-shortener"><label for="gc-stats-shortener">Stats Shortner</label></li>
            <h4>Gallery Tweaks</h4>
                <li><input type="checkbox" id="cyricc-gallery-viewer"><label for="cyricc-gallery-viewer">Gallery Viewer</label></li>
                <li><input type="checkbox" id="thingifier-magnifier"><label for="thingifier">Magnifier</label></li>
            <h4>Misc. Tweaks</h4>
                <li><input type="checkbox" id="gc-tss"><label for="gc-tss">Suggestions Status Page Switcher</label></li>
                <li><input type="checkbox" id="thingifier-mangadex"><label for="thingifier-mangadex">MangaDex Searcher</label></li>
                <li><input type="checkbox" id="thingifier-rething"><label for="thingifier-rething">Reverse Browser Page Title</label></li>
                <li><input type="checkbox" id="thingifier-mousewheel"><label for="thingifier-mousewheel">L/R Mousewheel Page Navigation</label></li>
    </div>`);
}

function appendUIcss() {
     $('head').append('<link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"> ');
     $('head').append(`
<style type="text/css">
    #scmenu {
        width:300px;
        padding-bottom:10px;
        position:fixed;
        display:block;
        right:20px;
        top:50px;
        z-index:2;
        background-color:rgba(0, 51, 102, 0.8);
        border:2px solid rgba(0,51,102);
        border-radius:5px;
        box-shadow: 1px 1px 8px rgb(0,51,102);
        color:white;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
    #scmenu h1, #scmenu h2, #scmenu h3, #scmenu h4, #scmenu h5 {
        font-weight: bold;
        font-family: 'Courier Prime', monospace;
        background-color: rgba(255,255,255,0.2);
        text-align: center;
        text-transform: uppercase;
    }
    #scmenu h3 {
        font-size: 19px;
        padding: 7px;
        margin-bottom: 2px;
        border-bottom:2px solid rgba(0,51,102);
    }
    #scmenu h4 {
        padding: 2px;
        font-size: 16px;
        letter-spacing: 4px;
        border-bottom:2px solid rgba(0,51,102);
        border-top:2px solid rgba(0,51,102);
        margin-top: 10px;
        margin-bottom: 10px;
    }
    #scmenu li {
        list-style-type:none;
        padding: 0px 10px;
        text-align: center;
        vertical-align: middle;
        display: inline-block;
    }
    #scmenu input[type=checkbox] {
        margin: 5px;
        cursor: pointer;
        border-radius: 5px;
        transform: scale(1.25);
    }
    #scmenu label {
        text-align: center;
        clear: both;
        display: inherit;
    }
    #scmenu button, #scmenu input[type=button] {
        border: none;
        background-color: white;
        border-radius: 7px;
    }
    #scmenu button:hover, #scmenu input[type=button]:hover {
        background-color: azure;
    }
    #scmenu button:disabled {cursor:not-allowed;background-color:lightgrey}
</style>`);
}

//Alice Cheshire - Title Rethingifier
function rethingify() {
    document.title = document.title.replace(/Dynasty Reader »(.+)/, "$1 | Dynasty Reader");
}

//gwennie-chan - Tagifier
function createTagMap() {
	return $.getJSON(tagsJSON).then(data => {
		const tagMap = {};
		Object.values(data).forEach(tagBin =>
			tagBin.forEach(nameLink =>
				tagMap[nameLink.name.toLowerCase()] = nameLink));
		return tagMap;
	});
}

function forumTagger() {
	createTagMap().then(tagMap => {
		$('code').each(function(){
			// Lookup the tag table and linkify if key exists
			var lowerHTML = this.innerHTML.toLowerCase();
			if (tagMap.hasOwnProperty(lowerHTML)) {
				var nameLink = tagMap[lowerHTML];
				$(this).html(`<a href=${tagURLstub}${nameLink.permalink} class="tagified" style="text-decoration:none;color:inherit;">${nameLink.name}</a>`);
			}
		});
	});
}

function tagifierCSS() {
	$("<style>").prop("type", "text/css").html('\.tagified:hover{text-decoration:underline !important;color:#990000 !important;}\#controller{text-align:center;font-size:0.75em;font-weight:normal;}\#controller input{margin: 10px 20px;display:inline-block;}').prependTo("head");
}

function tagSelectionSwitcher() {
	//console.log("Starting TCC");
	$('#main h2').html('<h2>Suggestions Status</h2><div id="controller"><input type="checkbox" id="acceptedCont" checked><span class="text-success">Accepted</span></input><input type="checkbox" id="pendingCont" checked><span class="text-info">Pending</span></input><input type="checkbox" id="rejectedCont" checked><span class="text-error">Rejected</span></input></div>');
}

function statsShortener() {
    $('.views_count b').each(function(){
        var vCount = parseFloat(this.innerHTML.replace(/,/g, ''));
        //console.log("Converted View Count " + vCount);
        $(this).html(numShorten(vCount));
    });
    $('.posts_count b').each(function(){
        var vCount = parseFloat(this.innerHTML.replace(/,/g, ''));
        //console.log("Converted View Count " + vCount);
        $(this).html(numShorten(vCount));
    });
}

function numShorten(num) {
    if(num >= 1000000){return parseFloat(num/1000000).toFixed(1) + "M";}
    else if (num >= 100000){return Math.round(num/1000) + "K";}
    else if (num >= 10000){return Math.round(num/100) + "K";}
    else if (num >= 1000){return parseFloat(num/1000).toFixed(2) + "K";}
    else {return num;}
}