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
// @author       Dynasty-Scans Scripters
// @include      https://dynasty-scans.com/*
// @exclude      https://dynasty-scans.com/system/*
// @exclude      https://dynasty.scans.com/*.jsons
// @run-at       document-end
// ==/UserScript==

//---Global Variables and Objects---
const tagsJSON = "https://dynasty-scans.com/tags.json";
const tagURLstub = "https://dynasty-scans.com/tags/";
const currentURL = window.location.pathname;
let SCd = {
    yourid: "Not set!",
    spoilers: false,
    navbar: false,
    pagination: false,
    bbcode: false,
    quote2quickreply: false,
    movequickreply: false,
    magnifier: false,
    fontsize: 0,
    mag: {
        sizeRes: "512",
        sizeMeasure: "px",
        minSizeRes: "512",
        minSizeMeasure: "px",
        zoomFactor: "250",
        border: "0"
    },
    ver: "0"
};
var SC = getItem("SC", SCd), ver = "0.1";

console.log(`Script-chan Version: ${SC.ver} `);

if (SC.ver !== ver) {SC.ver = ver;}

function getItem(key, def) {
    let out = localStorage.getItem(key);
    if (out == null) { return def; }
    else { return JSON.parse(out);}
}

function setItem(key, val) {
    if (typeof val === "object") { val = JSON.stringify(val);}
    localStorage.setItem(key,val);
}

//Main Function
$.when($.ready).done(function(){
    initUI();
    $('#scriptchan').click(function(){
        if(!$('#scmenu').is(':visible')){
            //console.log("Script-chan: No Menu Present, Deploying Menu");
            $('#scmenu').slideDown();
        }
        else if($('#scmenu').is(':visible')) {
            //console.log("Script-chan: Menu Present, Removing Menu");
            $('#scmenu').slideUp();
        }
        else {
            console.log("Script-chan: Menu Error");
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
    <div id="scmenu" class="unselectable">
        <h3>Script-chan Control Panel</h3>
            <h4>Browsing Tweaks</h4>
                <li><input type="checkbox" id="thingifier-fixed-navbar"><label for="thingifier-fixed-navbar">Fixed Navbar</label></li>
                <li><input type="checkbox" id="thingifier-pagination"><label for="thingifier-pagination">Top Page Selector</label></li>
                <li><input type="checkbox" id="cyricc-mark-read"><label for="cyricc-mark-read">Mark Read</label></li>
                <li><input type="checkbox" id="cyricc-tag-hider"><label for="cyricc-tag-hider">Tag Hider</label></li>
                <li>Font Size&nbsp;&nbsp;<input type="range" id="thingifier-font-size" min="1" max="5"><span id="thingifier-font-size-value" style="padding:0px 5px">(00px)</span><button type="button" id="thingifier-reset-font" style="margin-left:10px" title="Resets Font Size Change"Mom>Reset</button></li>
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
    $('body').append(`
        <div id="sc-mag-bar" class="unselectable">
            <b title="Script-chan Magnifier">&#128269;</b>
            <li><button type="button" id="thingifier-magnifier-control" title="Click or Press 'Z' To ENABLE Magnifier"><span class="sc-icon">&#128505;</span><span class="sc-label">Turn On</span></button></li>
            <li><button type="button" id="thingifier-magnifier-settings-button" title="Click to OPEN Magnifier Settings"><span class="sc-icon">&#9881;</span><span class="sc-label">Open Settings</span></button></li>
        </div>
        <div id="thingifier-magnifier-settings-menu">
            <h3>Magnifier Settings</h3>
            <li><label for="sizenum">Size</label><input type="number" max="750" min="5" value="250" id="sizenum"><select name="sizemeasure" title="Select Size Measurement"><option value="vh">vh</option><option value="vw">vw</option><option value="vmin">vmin</option><option value="vmax">vmax</option><option value="%">%</option><option value="px" selected>px</option></select></li>
            <li><label for="minsizenum">Min. Size</label><input type="number" max="750" min="5" value="250" id="minsizenum"><select name="minsizemeasure" title="Select Size Measurement"><option value="vh">vh</option><option value="vw">vw</option><option value="vmin">vmin</option><option value="vmax">vmax</option><option value="%">%</option><option value="px" selected>px</option></select>
            <li><label for="zoomfactor">Zoom Factor (%)</label><input type="number" id="zoomfactor" max="500" min="50" value="250" placeholder="Number As %"></li>
            <li><label for="magnifier-shape">Mag. Shape</label><select name="magnifier-shape"><option value="circle" selected>Circle</option><option value="square">Square</option></select></li>
            <div id="magnifier-setting-buttons"><input type="button" id="magnifier-menu-submit" value="Save"><input type="button" id="magnifier-menu-cancel" value="Cancel"></div>
        </div>
    `);
}

function appendUIcss() {
    $('head').append('<link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"> ');
    $('head').append(`
<style media="screen" type="text/css">
    .unselectable {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -a-user-select: none;
    }
    #scmenu {
        width:300px;
        padding-bottom:10px;
        position:fixed;
        display:block;
        right:20px;
        top:50px;
        z-index:2;
        background-color:rgba(0, 51, 102, 0.8);
        border:2px solid rgb(0,51,102);
        border-radius:5px;
        box-shadow: 1px 1px 8px rgb(0,51,102);
        color:white;
        font-variant:small-caps;
        font-size: 13px;
    }
    #sc-mag-bar {
        position: fixed;
        bottom: 0px;
        left: 0px;
        z-index: 3;
        padding: 5px 10px;
        background-color:rgba(0, 51, 102, 0.5);
        border:2px solid rgb(0,51,102);
        border-left: none;
        border-bottom: 1px solid rgb(0,51,102);
        border-radius: 0px 20px 10px 0px;
        font-variant: small-caps;
    }
    #thingifier-magnifier-settings-menu {
        display: none;
        z-index: 2;
        position: fixed;
        width: 250px;
        left: 10px;
        bottom: 50px;
        text-align: center;
        background-color:rgba(0, 51, 102, 0.8);
        border:2px solid rgb(0,51,102);
        border-radius:5px;
        box-shadow: 1px 1px 8px rgb(0,51,102);
        color: white;
    }
    #thingifier-magnifier-settings-menu input[type=number], #thingifier-magnifier-settings-menu select {
        width: 50px;
        display: inline-block;
        margin: none;
    }
    #thingifier-magnifier-settings-menu select[name=magnifier-shape] {
        width: 75px;
    }
    #thingifier-magnifier-settings-menu label {
        display: inline-block;
        margin: 0;
        position: relative;
        bottom: 3px;
        left: -8px;
        font-variant:small-caps;
    }
    #thingifier-magnifier-settings-menu li {
        display: block;
        list-style: none;
        text-align: center;
        vertical-align: middle;
    }
    #thingifier-magnifier-settings-menu h3 {
        margin-bottom: 6px;
        font-size: 19px;
        padding: 7px;
        border-bottom:2px solid rgba(0,51,102);
    }
    #magnifier-setting-buttons {
        border-top: 2px solid rgba(0,51,102);
        padding: 7px 0px;
        background-color: rgba(255,255,255,0.2);
    }
    #magnifier-setting-buttons input {
        margin: 0 6px;
    }
    #scmenu h1, #scmenu h2, #scmenu h3, #scmenu h4, #scmenu h5, #sc-mag-bar h3, #thingifier-magnifier-settings-menu h3 {
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
    #scmenu li, #sc-mag-bar li {
        list-style: none;
        text-align: center;
        vertical-align: middle;
        display: inline-block;
    }
    #scmenu li {padding: 0px 10px;}
    #sc-mag-bar li {padding: 0px; margin-left: 5px;}
    #sc-mag-bar li .sc-icon {margin-right: 3px}
    #scmenu input[type=checkbox] {
        margin: 5px;
        cursor: pointer;
        border-radius: 5px;
        transform: scale(1.25);
    }
    #scmenu label, #thingifier-magnifier-settings sc-label {
        text-align: center;
        clear: both;
        display: inherit;
        font-size: 13px;
    }
    #scmenu button, #sc-mag-bar button {
        border: none;
        background-color: white;
        border-radius: 7px;
        display: inline-block;
        font-variant: inherit;
    }
    #scmenu button:hover, #sc-mag-bar button:hover {
        background-color: azure;
    }
    #scmenu button:disabled, #sc-mag-bar button:disabled {
        cursor:not-allowed;
        background-color:lightgrey;
    }
    #scmenu input[type=range] {
        max-width: 95px;
    }

    /*Range Styling from http://danielstern.ca/range.css/*/
    input[type=range] {
      width: 100%;
      margin: 10.5px 0;
      background-color: transparent;
      -webkit-appearance: none;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      background: #ffffff;
      border: 0.2px solid #010101;
      border-radius: 1px;
      width: 100%;
      height: 2px;
      cursor: pointer;
    }
    input[type=range]::-webkit-slider-thumb {
      margin-top: -10.7px;
      width: 9px;
      height: 23px;
      background: #ffffff;
      border: 1px solid #000000;
      border-radius: 10px;
      cursor: pointer;
      -webkit-appearance: none;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #ffffff;
    }
    input[type=range]::-moz-range-track {
      background: #ffffff;
      border: 0.2px solid #010101;
      border-radius: 1px;
      width: 100%;
      height: 2px;
      cursor: pointer;
    }
    input[type=range]::-moz-range-thumb {
      width: 9px;
      height: 23px;
      background: #ffffff;
      border: 1px solid #000000;
      border-radius: 10px;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      background: transparent;
      border-color: transparent;
      border-width: 10.5px 0;
      color: transparent;
      width: 100%;
      height: 2px;
      cursor: pointer;
    }
    input[type=range]::-ms-fill-lower {
      background: #d6d6d6;
      border: 0.2px solid #010101;
      border-radius: 2px;
    }
    input[type=range]::-ms-fill-upper {
      background: #ffffff;
      border: 0.2px solid #010101;
      border-radius: 2px;
    }
    input[type=range]::-ms-thumb {
      width: 9px;
      height: 23px;
      background: #ffffff;
      border: 1px solid #000000;
      border-radius: 10px;
      cursor: pointer;
      margin-top: 0px;
      /*Needed to keep the Edge thumb centred*/
    }
    input[type=range]:focus::-ms-fill-lower {
      background: #ffffff;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #ffffff;
    }
    /*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out how to remove the virtical space around the range input in IE*/
    @supports (-ms-ime-align:auto) {
      /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
      input[type=range] {
        margin: 0;
        /*Edge starts the margin from the thumb, not the track as other browsers do*/
      }
    }

</style>`);
}

//Magnifier Bar Controller
$('#thingifier-magnifier-control').click(function(){
    if($(this).data('clicked') == false || $(this).data('clicked') == null) {
        $(this).data('clicked',true);
        $('#thingifier-magnifier-control .sc-icon').html("&#128503;");
        $('#thingifier-magnifier-control .sc-label').html("Turn Off");
        $(this).prop('title','Click or Press \'Z\' To DISABLE Magnifier');
    }
    else if ($(this).data('clicked') == true){
        $(this).data('clicked',false);
        $('#thingifier-magnifier-control .sc-icon').html("&#128505;");
        $('#thingifier-magnifier-control .sc-label').html("Turn On");
        $(this).prop('title','Click or Press \'Z\' To ENABLE Magnifier');
    }
});
$('#thingifier-magnifier-settings-button').click(function(){
    if($(this).data('clicked') == false || $(this).data('clicked') == null) {
        $(this).data('clicked',true);
        $('#thingifier-magnifier-settings-button .sc-icon').html("&#128446;");
        $('#thingifier-magnifier-settings-button .sc-label').html("Close Settings");
        $(this).prop('title','Click to CLOSE Magnifier Settings');
        $('#thingifier-magnifier-settings-menu').slideDown();
    }
    else if ($(this).data('clicked') == true){
        $(this).data('clicked',false);
        $('#thingifier-magnifier-settings-button .sc-icon').html("&#9881;");
        $('#thingifier-magnifier-settings-button .sc-label').html("Open Settings");
        $(this).prop('title','Click to OPEN Magnifier Settings');
        $('#thingifier-magnifier-settings-menu').slideUp();
    }
});


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