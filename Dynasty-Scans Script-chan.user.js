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
// @grant        GM_info
// @run-at       document-end
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// ==/UserScript==

//---Global Variables and Objects---
const tagsJSON = 'https://dynasty-scans.com/tags.json';
const tagURLstub = 'https://dynasty-scans.com/tags/';
const username = $('a[href="/user"] strong').text().trim();
const cURL = window.location.toString().replace(/(#.+)/, '');
const cURLpath = window.location.pathname;
const originalTitle = document.title;
const rethingTitle = document.title.replace(/Dynasty Reader »(.+)/, '$1 | Dynasty Reader');
let postids = [];
let quote = [];
let postcount = 0;
let counter = 0;
const origStats = [[],[]];
const origTags = [];
let ss, se, sel, tb, te, pt, sa = [];
let SCdefault = {
    navbar: false,
    pagination: false,
    markread: false,
    taghider: false,
    fontsize: 'normal',
    fontset: {
        smallest: { fs: '10px', lh: '12px' },
        smaller: { fs: '12px', lh: '15px' },
        normal: { fs: '16px', lh: '19px' },
        bigger: { fs: '20px', lh: '23px' },
        biggest: { fs: '25px', lh: '28px' },
    },
    spoilers: false,
    yourid: false,
    bbcode: false,
    quote2quickreply: false,
    movequickreply: false,
    forumtagger: false,
    statsshortener: false,
    galleryviewer: false,
    magnifier: false,
    magsettings: {
        sizeRes: '250',
        sizeMeasure: 'px',
        minSizeRes: '250',
        minSizeMeasure: 'px',
        zoomFactor: '250',
        shape: 'circle',
    },
    sspswitcher: false,
    mangadex: false,
    rethingify: false,
    mousewheel: false,
};

Object.freeze(SCdefault);

function getItem(key, def) {
    let out = localStorage.getItem(key);
    if (out === null) { return def; }
    return JSON.parse(out);
}

function setItem(key, sval) {
    if (typeof sval === 'object') { sval = JSON.stringify(sval); }
    localStorage.setItem(key, sval);
}

function checkNull(sval2, def) {
    if (sval2 === null) { return def; }
    return sval2;
}

let SC = getItem('SC', SCdefault);

function save() {
    setItem('SC', SC);
}

save();
let meta = GM_info;
console.log(`Script-chan Version: ${meta.script.version} `);
console.log(SC);

if (cURL.match(/forum\/topics/)) {
    $('.forum_post').each(function () {
        postids.push(this.id); //For each element of the class forum_post push the element's id to our postids array
    });
    $('.time').each((i, obj) => {
        postcount++; //This is where we actually count how many posts are on the page
    });
}



//Initial Function
$.when($.ready).done(() => {
    initUI();
    $(document).bind("keydown","alt+down",clickMenu);
    function clickMenu() {
        $('#scriptchan').click();
    }
    $('#scriptchan').click(() => {
        if (!$('#scmenu').is(':visible')) {
            //console.log("Script-chan: No Menu Present, Deploying Menu");
            $('#scmenu').slideDown();
        } else if ($('#scmenu').is(':visible')) {
            //console.log("Script-chan: Menu Present, Removing Menu");
            $('#scmenu').slideUp();
        } else {
            console.log('Script-chan: Menu Error');
            alert('Script-chan Menu Error!');
        }
    });
});

function initUI() {
    //Create Nav Bar Button For SC Menu
    $('.nav-collapse .pull-right:first-child').append('<li id="scriptchan" title="Dynasty-Scans Script-chan! Click or ALT+DOWN To Open/Close Menu!" style="background-color: rgba(255,255,255,0.2); margin-right: -20px;"><a><i class="icon-wrench icon-white"></i></a></li>');
    //Inject UI CSS
    appendUIcss();
    //Inject SC Menu - Hidden By Default
    $('.nav-collapse .pull-right:first-child').append(`
    <div id="scmenu" class="unselectable">
        <h3 title="Script-chan Is A Collaboration Between Alice Cheshire, Cyrric, and Gwennie-Chan">Script-chan Control Panel</h3>
            <h4 title="For Browsing The Site">Browsing Tweaks</h4>
                <li><input type="checkbox" id="thingifier-fixed-navbar"><label for="thingifier-fixed-navbar" title="Sticks Navbar At The Top Of The Screen">Fixed Navbar</label></li>
                <li><input type="checkbox" id="thingifier-pagination"><label for="thingifier-pagination" title="Adds A Page Selector To The Top Near Navbar">Top Page Selector</label></li>
                <li><input type="checkbox" id="cyricc-mark-read"><label for="cyricc-mark-read" title="Greys Out Already-Read Titles">Mark Read</label></li>
                <li><input type="checkbox" id="cyricc-tag-hider"><label for="cyricc-tag-hider" title="Hides User-Selected Tags From Appearing In Tag List">Tag Hider</label></li>
            <h4 title="For Stanning Your OT3">Forum Tweaks</h4>
                <li><input type="checkbox" id="thingifier-unhide-spoilers"><label for="thingifier-unhide-spoilers" title="Unhides Forum Spoilers">Unhide Spoilers</label></li>
                <li><a target="_blank" id="ownposts-link"><button type="button" id="thingifier-ownposts" style="position: relative; left: 40px; top: -5px;" disabled>Your Posts</button></a></li>
                <li><input type="checkbox" id="thingifier-bbcode-buttons"><label for="thingifier-bbcode-buttons" title="Enables Quick Formatting/Reply Editor For Forum Posts">Enable Quick Reply (QR) Posts</label></li>
                <li><input type="checkbox" id="thingifier-quote-to-quickreply"><label for="thingifier-quote-to-quickreply" title="Puts Quick Reply On Forum Page Instead Of Its Own">QR On Page</label></li>
                <li><input type="checkbox" id="thingifier-quote-move-quickreply"><label for="thingifier-quote-move-quickreply" title="Moves Quick Reply On Forum Page Under Post Being Quoted">QR Below Post</label></li>
                <li><input type="checkbox" id="gc-forum-tagger"><label for="gc-forum-tagger" title="Automatically Linkifies Valid Tags On Forum and Image Comments">Forum Tagger</label></li>
                <li><input type="checkbox" id="gc-stats-shortener"><label for="gc-stats-shortener" title="Abbreviates Forum Directory Stats">Stats Shortner</label></li>
                <li><span title="Changes Forum Font Size">Font Size&nbsp;&nbsp;</span><input type="range" id="thingifier-font-size" min="1" max="5"><span id="thingifier-font-size-value" style="padding:0px 5px">(00px)</span><button type="button" id="thingifier-reset-font" style="margin-left:10px" title="Resets Font Size Change"Mom>Reset</button></li>
            <h4 title="For Being A Perverted Baka Oneesan">Gallery Tweaks</h4>
                <li><input type="checkbox" id="cyricc-gallery-viewer"><label for="cyricc-gallery-viewer" title="Enables Easy, High-Res Gallery Viewing From Main Images Page">Gallery Viewer</label></li>
                <li><input type="checkbox" id="thingifier-magnifier"><label for="thingifier" title="Magnifies Content On The Site">Magnifier</label></li>
            <h4 title="For Obscure Shit">Misc. Tweaks</h4>
                <li><input type="checkbox" id="gc-tss"><label for="gc-tss" title="Creates Easy Filtering Utility Bar On 'Suggestions Status' Page">Suggestions Status Page Switcher</label></li>
                <li><input type="checkbox" id="thingifier-mangadex"><label for="thingifier-mangadex" title="Adds Utility To Search For Work or Author on MangaDex">MangaDex Searcher</label></li>
                <li><input type="checkbox" id="thingifier-rething"><label for="thingifier-rething" title="Reverses Browser Title To Show What Page First, Dynasty Last">Reverse Browser Page Title</label></li>
                <li><input type="checkbox" id="thingifier-mousewheel"><label for="thingifier-mousewheel" title="Allows Clicking Through Manga With L/R Mousewheel Clicks">L/R Mousewheel Page Navigation</label></li>
    </div>`);
    $('body').append(`
        <div id="sc-mag-bar" class="unselectable">
            <li><button type="button" id="thingifier-magnifier-settings-button" title="Click to OPEN Magnifier Settings"><span class="sc-icon">&#9881;</span><span class="sc-label">Open Settings</span></button></li>
            <li><button type="button" id="thingifier-magnifier-control" title="Click or Press 'Z' To ENABLE Magnifier"><span class="sc-icon">&#9745;</span><span class="sc-label">Turn On</span></button></li>
            <b title="Script-chan Magnifier">&#128269;</b>
        </div>
        <div id="thingifier-magnifier-settings-menu">
            <h3>Magnifier Settings</h3>
            <li><label for="sizenum" title="Sets Typical Magnifier Size">Size</label><input type="number" max="750" min="5" id="sizenum"><select id="sizemeasure" name="sizemeasure" title="Select Size Measurement"><option value="vh">vh</option><option value="vw">vw</option><option value="vmin">vmin</option><option value="vmax">vmax</option><option value="%">%</option><option value="px">px</option></select></li>
            <li><label for="minsizenum" title="Sets Minimum Magnifier Size">Min. Size</label><input type="number" max="750" min="5" id="minsizenum"><select id="minsizemeasure" name="minsizemeasure" title="Select Size Measurement"><option value="vh">vh</option><option value="vw">vw</option><option value="vmin">vmin</option><option value="vmax">vmax</option><option value="%">%</option><option value="px">px</option></select>
            <li><label for="zoomfactor" title="Sets Magnifier Zoom Strength">Zoom Factor (%)</label><input type="number" id="zoomfactor" max="500" min="50" placeholder="Number As %"></li>
            <li><label for="magnifier-shape" title="Selects Shape Of Magnifier">Mag. Shape</label><select id="magnifier-shape" name="magnifier-shape"><option value="circle">Circle</option><option value="square">Square</option></select></li>
            <div id="magnifier-setting-buttons"><input type="button" id="magnifier-menu-default" value="Default"><input type="button" id="magnifier-menu-submit" value="Save"><input type="button" id="magnifier-menu-cancel" value="Cancel"></div>
        </div>
    `);
    settingsChecker('all', true);
}

function appendUIcss() {
    $('head').append('<link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"> ');
    $('head').append(`<style media="screen" type="text/css">
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
        display:none; /* hidden by default */
        right:20px;
        top:50px;
        z-index:2;
        background-color:rgba(0, 51, 102, 0.9);
        border:2px solid rgb(0,51,102);
        border-radius:5px;
        box-shadow: 1px 1px 8px rgb(0,51,102);
        color:white;
        font-variant:small-caps;
        font-size: 13px;
    }
    #sc-mag-bar {
        position: fixed;
        display: none; /* hidden by default */
        bottom: 0px;
        left: 0px;
        z-index: 3;
        padding: 5px 10px;
        background-color:rgba(0, 51, 102, 0.9);
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
        background-color:rgba(0, 51, 102, 0.9);
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
    #thingifier-magnifier-settings-menu #magnifier-shape {
        width: 80px;
    }
    #thingifier-magnifier-settings-menu #sizemeasure, #thingifier-magnifier-settings-menu #minsizemeasure {
        width: 70px;
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
    #scmenu h1, #scmenu h2, #scmenu h3, #scmenu h4, #scmenu h5, #sc-mag-bar h3, #thingifier-magnifier-settings-menu h3, #mangadex-tool h2 {
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
    #sc-mag-bar li {
        padding: 0px;
        margin-left: 5px;
    }
    #sc-mag-bar li .sc-icon, #thingifier-bbcode .sc-icon {
        margin-right: 3px;
    }
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
    #scmenu button, #sc-mag-bar button, #thingifier-bbcode a {
        border: none;
        background-color: white;
        border-radius: 7px;
        display: inline-block;
        font-variant: inherit;
    }
    #scmenu button:hover, #sc-mag-bar button:hover, #thingifier-bbcode a:hover {
        background-color: azure;
    }
    #scmenu button:disabled, #sc-mag-bar button:disabled, #thingifier-bbcode button:disabled {
        cursor:not-allowed;
        background-color:lightgrey;
    }
    #scmenu input[type=range] {
        max-width: 95px;
    }
    #main code a.tagified {
        text-decoration: none;
        color: #990000;
    }
    #main code a.tagified:hover {
        text-decoration: underline;
        color: #990000;
    }
    #tss-bar {
        text-align:center;
        font-size:0.75em;
        font-weight:normal;
    }
    #tss-bar input {
        margin: 10px 20px;
        display:inline-block;
    }
    #mangadex-tool {
        background-color:rgba(0, 51, 102, 0.9);
        border:2px solid rgb(0,51,102);
        color:white;
        display: inline-block;
        font-variant:small-caps;
        font-size: 12px;
        border-radius: 20px;
        margin: 10px;
        padding: 1px 4px;
    }
    #mangadex-tool h2 {
        display: inline-block;
        font-weight: normal;
        font-size: 16px;
        padding: 0px 8px;
        margin: 4px;
        border-radius: 10px;
    }
    #mangadex-tool a {
        color: black;
        text-decoration: none;
        padding: 0px 8px;
        border-radius: 10px;
        border: none;
        background-color: white;
        display: inline-block;
        font-variant: inherit;
        margin: 0px 4px;
    }
    #mangadex-tool a:hover {
        text-decoration: none;
        background-color: lightblue;
    }
    #mangadex-tool a small {
        text-transform: uppercase;
        display: inherit;
        font-size: 10px;
        color: grey;
        margin: 2px 0px 3px 4px
    }
    .navbar-fixed {
        position: fixed;
        z-index: 1000;
        width: 1210px;
    }
    .nav-padding {
        height: 60px;
        width: 1210px;
    }
    .spoilers-disabled {
    background: #666 none repeat scroll 0% 0%;
    color: #fff;
    }
    #thingifier-bbcode {
        margin: 6px;
        background-color:rgba(0, 51, 102, 0.8);
        padding: 6px;
        border-radius: 12px;
        border:2px solid rgb(0,51,102);
        min-width: 565px;
    }
    #thingifier-bbcode a {
        margin: 3px 1px;
        font-variant: small-caps;
        text-decoration: none;
        list-style-type: none;
        padding: 1px 6px;
        line-height: 20px;
        cursor: pointer;
    }
    #thingifier-bbcode-clear:hover {
        background-color:salmon !important;
        color:black !important;
    }
    #forum_post_message {
        min-width: 98%;
        max-width: 125%;
        min-height: 100px;
        max-height: 400px;
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

//Load Settings into UI
function settingsChecker(what, initial = false) {
    if (what === 'navbar' || what === 'all') {
        if (SC.navbar === false) {
            $('#thingifier-fixed-navbar').prop('checked', false);
            fixNavBar(false);
        } else if (SC.navbar === true) {
            $('#thingifier-fixed-navbar').prop('checked', true);
            fixNavBar(true);
        }
    }
    if (what === 'pagination' || what === 'all') {
        if (SC.pagination === false) {
            $('#thingifier-pagination').prop('checked', false);
            paginate(false);
        } else if (SC.pagination === true) {
            $('#thingifier-pagination').prop('checked', true);
            paginate(true);
        }
    }
    if (what === 'mark-read' || what === 'all') {
        if (SC.markread === false) {
            $('#cyricc-mark-read').prop('checked', false);
        } else if (SC.markread === true) {
            $('#cyricc-mark-read').prop('checked', true);
        }
    }
    if (what === 'tag-hider' || what === 'all') {
        if (SC.taghider === false) {
            $('#cyricc-tag-hider').prop('checked', false);
        } else if (SC.taghider === true) {
            $('#cyricc-tag-hider').prop('checked', true);
        }
    }
    if (what === 'fontsize' || what === 'all') {
        if (SC.fontsize === SCdefault.fontsize) {
            $('#thingifier-reset-font').prop('disabled', true).prop('title', 'Default Font Size - Reset Unnecessary');
        } else {
            $('#thingifier-reset-font').prop('disabled', false).prop('title', 'Click To Reset To Default Font Size');
        }
        $('#thingifier-font-size').prop('value', fontset(SC.fontsize, 'index'));
        $('#thingifier-font-size-value').html(`(${fontset(SC.fontsize, 'value')})`);
        $('.message *').css({ 'font-size': `${fontset(SC.fontsize, 'value')}`, 'line-height': `${fontset(SC.fontsize, 'line')}`});
    }
    if (what === 'spoilers' || what === 'all') {
        if (SC.spoilers === false) {
            $('#thingifier-unhide-spoilers').prop('checked', false);
            unhideSpoilers(false);
        } else if (SC.spoilers === true) {
            $('#thingifier-unhide-spoilers').prop('checked', true);
            unhideSpoilers(true);
        }
    }
    if (what === 'yourid' || what === 'all') {
        if (SC.yourid === false && cURL.match(/forum\/topics\/.*/)) {
            let tmpid = null;
            $('.forum_post').each(function () {
                let postUser = $(this).find('.user').text().trim();
                //console.log(username,postUser);
                if (postUser === username) {
                    //console.log("User ID Found On Page, Returning ID Value");
                    tmpid = parseInt($(this).find('.count a').attr('href').replace(/\D+/g, ''));
                }
            });
            //console.log(tmpid);
            if (typeof tmpid === 'number') {
                SC.yourid = tmpid;
                save();
                $('#thingifier-ownposts').prop('disabled', false);
                $('#thingifier-ownposts').prop('title', 'Click To See Your Forum Posts Page');
                $('#ownposts-link').attr('href', '//dynasty-scans.com/forum/posts?user_id=' + SC.yourid);
            } else {
                $('#thingifier-ownposts').prop('disabled', true);
                $('#thingifier-ownposts').prop('title', "Navigate While Logged In To A Forum Page You've Posted On To Automatically Set Your User ID");
            }
        } else if (SC.yourid === false && !cURL.match(/forum\/topics/)) {
            $('#thingifier-ownposts').prop('disabled', true);
            $('#thingifier-ownposts').prop('title', "Navigate While Logged In To A Forum Page You've Posted On To Automatically Set Your User ID");
        } else if (typeof SC.yourid === 'number') {
            $('#thingifier-ownposts').prop('disabled', false);
            $('#thingifier-ownposts').prop('title', 'Click To See Your Forum Posts Page');
            $('#ownposts-link').attr('href', '//dynasty-scans.com/forum/posts?user_id=' + SC.yourid);
        } else {
            console.log('Invalid ID Present');
        }
    }
    if (what === 'bbcode' || what === 'all') {
        if (SC.bbcode === false) {
            $('#thingifier-bbcode-buttons').prop('checked', false);
            injectBBeditor(false);
        } else if (SC.bbcode === true) {
            $('#thingifier-bbcode-buttons').prop('checked', true);
            injectBBeditor(true);
        }
    }
    if (what === 'quote2quickreply' || what === 'all') {
        if (SC.quote2quickreply === false) {
            $('#thingifier-quote-to-quickreply').prop('checked', false);
        } else if (SC.quote2quickreply === true) {
            $('#thingifier-quote-to-quickreply').prop('checked', true);
        }
    }
    if (what === 'movequickreply' || what === 'all') {
        if (SC.movequickreply === false) {
            $('#thingifier-quote-move-quickreply').prop('checked', false);
        } else if (SC.movequickreply === true) {
            $('#thingifier-quote-move-quickreply').prop('checked', true);
        }
    }
    if (what === 'forumtagger' || what === 'all') {
        if (SC.forumtagger === false) {
            $('#gc-forum-tagger').prop('checked', false);
            forumTagger(false);
        } else if (SC.forumtagger === true) {
            $('#gc-forum-tagger').prop('checked', true);
            forumTagger(true);
        }
    }
    if (what === 'statsshortener' || what === 'all') {
        if (SC.statsshortener === false) {
            $('#gc-stats-shortener').prop('checked', false);
            statsShortener(false);
        } else if (SC.statsshortener === true) {
            $('#gc-stats-shortener').prop('checked', true);
            statsShortener(true);
        }
    }
    if (what === 'galleryviewer' || what === 'all') {
        if (SC.galleryviewer === false) {
            $('#cyricc-gallery-viewer').prop('checked', false);
        } else if (SC.galleryviewer === true) {
            $('#cyricc-gallery-viewer').prop('checked', true);
        }
    }
    if (what === 'magnifier' || what === 'all') {
        if (SC.magnifier === false) {
            $('#thingifier-magnifier').prop('checked', false);
        } else if (SC.magnifier === true) {
            $('#thingifier-magnifier').prop('checked', true);
            $(document).bind('keydown','alt+z', magClick);
            $('#sc-mag-bar').show();
        }
        if (initial === true) {
            $('#sizenum').val(checkNull(SC.magsettings.sizeRes, SCdefault.magsettings.sizeRes));
            checkNull(SC.magsettings.sizeMeasure, SCdefault.magsettings.sizeMeasure);
            $('#sizemeasure option').prop('selected', false);
            if (SC.magsettings.sizeMeasure === 'vh') { $('#sizemeasure option[value="vh"]').prop('selected', true); } else if (SC.magsettings.sizeMeasure === 'vw') { $('#sizemeasure option[value="vw"]').prop('selected', true); } else if (SC.magsettings.sizeMeasure === 'vmin') { $('#sizemeasure option[value="vmin"]').prop('selected', true); } else if (SC.magsettings.sizeMeasure === 'vmax') { $('#sizemeasure option[value="vmax"]').prop('selected', true); } else if (SC.magsettings.sizeMeasure === '%') { $('#sizemeasure option[value="%"]').prop('selected', true); } else if (SC.magsettings.sizeMeasure === 'px') { $('#sizemeasure option[value="px"]').prop('selected', true); }
            $('#minsizenum').val(checkNull(SC.magsettings.minSizeRes, SCdefault.magsettings.minSizeRes));
            checkNull(SC.magsettings.minSizeMeasure, SCdefault.magsettings.minSizeMeasure);
            $('#minsizemeasure option').prop('selected', false);
            if (SC.magsettings.minSizeMeasure === 'vh') { $('#minsizemeasure option[value="vh"]').prop('selected', true); } else if (SC.magsettings.minSizeMeasure === 'vw') { $('#minsizemeasure option[value="vw"]').prop('selected', true); } else if (SC.magsettings.minSizeMeasure === 'vmin') { $('#minsizemeasure option[value="vmin"]').prop('selected', true); } else if (SC.magsettings.minSizeMeasure === 'vmax') { $('#minsizemeasure option[value="vmax"]').prop('selected', true); } else if (SC.magsettings.minSizeMeasure === '%') { $('#minsizemeasure option[value="%"]').prop('selected', true); } else if (SC.magsettings.minSizeMeasure === 'px') { $('#minsizemeasure option[value="px"]').prop('selected', true); }
            $('#zoomfactor').val(checkNull(SC.magsettings.zoomFactor, SCdefault.magsettings.zoomFactor));
            checkNull(SC.magsettings.shape, SCdefault.magsettings.shape);
            if (SC.magsettings.shape === 'circle') { $('#magnifier-shape option[value="circle"]').prop('selected', true); } else if (SC.magsettings.shape === 'square') { $('#magnifier-shape option[value="square"]').prop('selected', true); }
        }
        if (SC.magsettings.sizeMeasure == $('#sizemeasure option:selected').val() && SC.magsettings.minSizeMeasure == $('#minsizemeasure option:selected').val() && SC.magsettings.sizeRes == $('#sizenum').val() && SC.magsettings.minSizeRes == $('#minsizenum').val() && SC.magsettings.zoomFactor == $('#zoomfactor').val() && SC.magsettings.shape == $('#magnifier-shape option:selected').val()) {
            $('#magnifier-menu-submit').prop('disabled', true);
            $('#magnifier-menu-submit').prop('title', 'Disabled - Current Values Equal To Saved Valued');
            $('#magnifier-menu-cancel').prop('disabled', true);
            $('#magnifier-menu-cancel').prop('title', 'Disabled - Current Values Equal To Saved Valued');
        } else {
            $('#magnifier-menu-submit').prop('disabled', false);
            $('#magnifier-menu-submit').prop('title', 'Click To Save Current Values As Settings');
            $('#magnifier-menu-cancel').prop('disabled', false);
            $('#magnifier-menu-cancel').prop('title', 'Click To Revert Values To Current Saved Settings - Remember To Save!');
        }
        if (SCdefault.magsettings.sizeMeasure == $('#sizemeasure option:selected').val() && SCdefault.magsettings.minSizeMeasure == $('#minsizemeasure option:selected').val() && SCdefault.magsettings.sizeRes == $('#sizenum').val() && SCdefault.magsettings.minSizeRes == $('#minsizenum').val() && SCdefault.magsettings.zoomFactor == $('#zoomfactor').val() && SCdefault.magsettings.shape == $('#magnifier-shape option:selected').val()) {
            $('#magnifier-menu-default').prop('disabled', true);
            $('#magnifier-menu-default').prop('title', 'Disabled - Current Values Equal To Default Values');
        } else {
            $('#magnifier-menu-default').prop('disabled', false);
            $('#magnifier-menu-default').prop('title', 'Click To Set Values To Default - Remember To Save!');
        }
    }
    if (what === 'sspswitcher' || what === 'all') {
        if (SC.sspswitcher === false) {
            $('#gc-tss').prop('checked', false);
            tssUI(false);
        } else if (SC.sspswitcher === true) {
            $('#gc-tss').prop('checked', true);
            tssUI(true);
        }
    }
    if (what === 'mangadex' || what === 'all') {
        if (SC.mangadex === false) {
            $('#thingifier-mangadex').prop('checked', false);
            mangadex(false);
        } else if (SC.mangadex === true) {
            $('#thingifier-mangadex').prop('checked', true);
            mangadex(true);
        }
    }
    if (what === 'rethingify' || what === 'all') {
        if (SC.rethingify === false) {
            $('#thingifier-rething').prop('checked', false);
            rethingify(false);
        } else if (SC.rethingify === true) {
            $('#thingifier-rething').prop('checked', true);
            rethingify(true);
        }
    }
    if (what === 'mousewheel' || what === 'all') {
        if (SC.mousewheel === false) {
            $('#thingifier-mousewheel').prop('checked', false);
            mousewheel(false);
        } else if (SC.mousewheel === true) {
            $('#thingifier-mousewheel').prop('checked', true);
            mousewheel(true);
        }
    }
}

//UI Menu Handlers
$('#thingifier-fixed-navbar').click(function () {
    if ($(this).prop('checked') === false) {
        SC.navbar = false;
        save();
        fixNavBar(false);
    } else if ($(this).prop('checked') === true) {
        SC.navbar = true;
        save();
        fixNavBar(true);
    }
});
$('#thingifier-pagination').click(function () {
    if ($(this).prop('checked') === false) {
        SC.pagination = false;
        save();
        paginate(false);
    } else if ($(this).prop('checked') === true) {
        SC.pagination = true;
        save();
        paginate(true);
    }
});
$('#cyricc-mark-read').click(function () {
    if ($(this).prop('checked') === false) {
        SC.markread = false;
        save();
    } else if ($(this).prop('checked') === true) {
        SC.markread = true;
        save();
    }
});
$('#cyricc-tag-hider').click(function () {
    if ($(this).prop('checked') === false) {
        SC.taghider = false;
        save();
    } else if ($(this).prop('checked') === true) {
        SC.taghider = true;
        save();
    }
});
$('#thingifier-font-size').change(function () {
    SC.fontsize = fontset($(this).val(), 'name');
    //console.log(SC.fontsize + fontset($(this).val(), 'name'));
    save();
    settingsChecker('fontsize');
});
$('#thingifier-reset-font').click(function () {
    if ($(this).prop('disabled') === false) {
        SC.fontsize = SCdefault.fontsize;
        save();
        $('#thingifier-font-size').prop('value', '3');
        $('#thingifier-font-size-value').html(`(${fontset(SC.fontsize, 'value')}px)`);
        $(this).prop('disabled', true);
        settingsChecker('fontsize');
    }
});
$('#thingifier-unhide-spoilers').click(function () {
    if ($(this).prop('checked') === false) {
        SC.spoilers = false;
        save();
        unhideSpoilers(false);
    } else if ($(this).prop('checked') === true) {
        SC.spoilers = true;
        save();
        unhideSpoilers(true);
    }
});
$('#thingifier-bbcode-buttons').click(function () {
    if ($(this).prop('checked') === false) {
        SC.bbcode = false;
        save();
        injectBBeditor(false);
    } else if ($(this).prop('checked') === true) {
        SC.bbcode = true;
        save();
        injectBBeditor(true);
    }
});
$('#thingifier-quote-to-quickreply').click(function () {
    if ($(this).prop('checked') === false) {
        SC.quote2quickreply = false;
        save();
    } else if ($(this).prop('checked') === true) {
        SC.quote2quickreply = true;
        save();
    }
});
$('#thingifier-quote-move-quickreply').click(function () {
    if ($(this).prop('checked') === false) {
        SC.movequickreply = false;
        save();
    } else if ($(this).prop('checked') === true) {
        SC.movequickreply = true;
        save();
    }
});
$('#gc-forum-tagger').click(function () {
    if ($(this).prop('checked') === false) {
        SC.forumtagger = false;
        save();
        forumTagger(false);
    } else if ($(this).prop('checked') === true) {
        SC.forumtagger = true;
        save();
        forumTagger(true);
    }
});
$('#gc-stats-shortener').click(function () {
    if ($(this).prop('checked') === false) {
        SC.statsshortener = false;
        save();
        statsShortener(false);
    } else if ($(this).prop('checked') === true) {
        SC.statsshortener = true;
        save();
        statsShortener(true);
    }
});
$('#cyricc-gallery-viewer').click(function () {
    if ($(this).prop('checked') === false) {
        SC.galleryviewer = false;
        save();
    } else if ($(this).prop('checked') === true) {
        SC.galleryviewer = true;
        save();
    }
});
$('#thingifier-magnifier').click(function () {
    if ($(this).prop('checked') === false) {
        SC.magnifier = false;
        save();
        $('#sc-mag-bar').hide();
    } else if ($(this).prop('checked') === true) {
        SC.magnifier = true;
        save();
        $('#sc-mag-bar').show();
    }
});
$('#magnifier-menu-submit').click(() => {
    SC.magsettings.sizeRes = $('#sizenum').val();
    SC.magsettings.sizeMeasure = $('select[name="sizemeasure"]').val();
    SC.magsettings.minSizeRes = $('#minsizenum').val();
    SC.magsettings.minSizeMeasure = $('select[name="minsizemeasure"]').val();
    SC.magsettings.zoomFactor = $('#zoomfactor').val();
    SC.magsettings.shape = $('select[name="magnifier-shape"]').val();
    save();
    settingsChecker("magnifier");
});
$('#magnifier-menu-cancel').click(() => {
    $('#sizenum').val(SC.magsettings.sizeRes);
    $('select[name="sizemeasure"]').val(SC.magsettings.sizeMeasure);
    $('#minsizenum').val(SC.magsettings.minSizeRes);
    $('select[name="minsizemeasure"]').val(SC.magsettings.minSizeMeasure);
    $('#zoomfactor').val(SC.magsettings.zoomFactor);
    $('select[name="magnifier-shape"]').val(SC.magsettings.shape);
});
$('#magnifier-menu-default').click(() => {
    $('#sizenum').val(SCdefault.magsettings.sizeRes);
    $('select[name="sizemeasure"]').val(SCdefault.magsettings.sizeMeasure);
    $('#minsizenum').val(SCdefault.magsettings.minSizeRes);
    $('select[name="minsizemeasure"]').val(SCdefault.magsettings.minSizeMeasure);
    $('#zoomfactor').val(SCdefault.magsettings.zoomFactor);
    $('select[name="magnifier-shape"]').val(SCdefault.magsettings.shape);
});
$('#thingifier-magnifier-settings-menu input').change(() => {
    settingsChecker('magnifier');
});
$('#thingifier-magnifier-settings-menu button').change(() => {
    settingsChecker('magnifier');
});
$('#thingifier-magnifier-settings-menu select').change(() => {
    settingsChecker('magnifier');
});
$('#gc-tss').click(function () {
    if ($(this).prop('checked') === false) {
        SC.sspswitcher = false;
        save();
        tssUI(false);
    } else if ($(this).prop('checked') === true) {
        SC.sspswitcher = true;
        save();
        tssUI(true);
    }
});
$('#thingifier-mangadex').click(function () {
    if ($(this).prop('checked') === false) {
        SC.mangadex = false;
        save();
        mangadex(false);
    } else if ($(this).prop('checked') === true) {
        SC.mangadex = true;
        save();
        mangadex(true);
    }
});
$('#thingifier-rething').click(function () {
    if ($(this).prop('checked') === false) {
        SC.rethingify = false;
        save();
        rethingify(false);
    } else if ($(this).prop('checked') === true) {
        SC.rethingify = true;
        save();
        rethingify(true);
    }
});
$('#thingifier-mousewheel').click(function () {
    if ($(this).prop('checked') === false) {
        SC.mousewheel = false;
        save();
        mousewheel(false);
    } else if ($(this).prop('checked') === true) {
        SC.mousewheel = true;
        save();
        mousewheel(true);
    }
});


//Magnifier Bar Controller
$('#thingifier-magnifier-control').click(function () {
    if ($(this).data('clicked') == false || $(this).data('clicked') == null) {
        $(this).data('clicked', true);
        $('#thingifier-magnifier-control .sc-icon').html('&#9746;');
        $('#thingifier-magnifier-control .sc-label').html('Turn Off');
        $(this).prop('title', 'Click or Press ALT+\'Z\' To DISABLE Magnifier');
    } else if ($(this).data('clicked') == true) {
        $(this).data('clicked', false);
        $('#thingifier-magnifier-control .sc-icon').html('&#9745;');
        $('#thingifier-magnifier-control .sc-label').html('Turn On');
        $(this).prop('title', 'Click or Press ALT+\'Z\' To ENABLE Magnifier');
    }
});
$('#thingifier-magnifier-settings-button').click(function () {
    if ($(this).data('clicked') == false || $(this).data('clicked') == null) {
        $(this).data('clicked', true);
        $('#thingifier-magnifier-settings-button .sc-icon').html('&#8690;');
        $('#thingifier-magnifier-settings-button .sc-label').html('Close Settings');
        $(this).prop('title', 'Click to CLOSE Magnifier Settings');
        $('#thingifier-magnifier-settings-menu').slideDown();
    } else if ($(this).data('clicked') == true) {
        $(this).data('clicked', false);
        $('#thingifier-magnifier-settings-button .sc-icon').html('&#9881;');
        $('#thingifier-magnifier-settings-button .sc-label').html('Open Settings');
        $(this).prop('title', 'Click to OPEN Magnifier Settings');
        $('#thingifier-magnifier-settings-menu').slideUp();
    }
});
function magClick (){
    if (SC.magnifier === true) {
        //console.log("Mag Click!");
        $('#thingifier-magnifier-control').click();
    }
}

//TSS Bar Controller
$('#acceptedCont').click(function() {
    if ($(this).is(':checked')) {
        $('.suggestion-accepted').fadeIn();
    }
    else {
        $('.suggestion-accepted').fadeOut();
    }});
$('#pendingCont').click(function() {
    if ($(this).is(':checked')) {
        $('.suggestion-pending').fadeIn();
    }
    else {
        $('.suggestion-pending').fadeOut();
    }});
$('#rejectedCont').click(function() {
    if ($(this).is(':checked')) {
        $('.suggestion-rejected').fadeIn();
    }
    else {
        $('.suggestion-rejected').fadeOut();
    }});

//BBCode Editor Controllers


//UI Helper Functions
function fontset (set, type) {
    if(type === 'index') {
        set = String(set);
        if (set === 'smallest'){return 1;}
        if (set === 'smaller'){return 2;}
        if (set === 'normal'){return 3;}
        if (set === 'bigger'){return 4;}
        if (set === 'biggest'){return 5;}
    }
    if (type === 'value') {
        let set1 = String(set), set2 = parseInt(set);
        if(set1 === 'smallest' || set2 === 1){return SC.fontset.smallest.fs;}
        if (set1 === 'smaller' || set2 === 2){return SC.fontset.smaller.fs;}
        if (set1 === 'normal' || set2 === 3){return SC.fontset.normal.fs;}
        if (set1 === 'bigger' || set2 === 4){return SC.fontset.bigger.fs;}
        if (set1 === 'biggest' || set2 === 5){return SC.fontset.biggest.fs;}
    }
    if (type === 'line') {
        let set1 = String(set), set2 = parseInt(set);
        if (set1 === 'smallest' || set2 === 1){return SC.fontset.smallest.lh;}
        if (set1 === 'smaller' || set2 === 2){return SC.fontset.smaller.lh;}
        if (set1 === 'normal' || set2 === 3){return SC.fontset.normal.lh;}
        if (set1 === 'bigger' || set2 === 4){return SC.fontset.bigger.lh;}
        if (set1 === 'biggest' || set2 === 5){return SC.fontset.biggest.lh;}
    }
    if (type === 'name') {
        set = parseInt(set);
        if(set === 1){return 'smallest';}
        if (set === 2){return 'smaller';}
        if (set === 3){return 'normal';}
        else if (set === 4){return 'bigger';}
        else if (set === 5){return 'biggest';}
    }
}

//Alice Cheshire - Title Rethingifier
function rethingify(set) {
    if (set === true){
        document.title = rethingTitle;
    }
    else if (set === false) {
        document.title = originalTitle;
    }
}

//Alice Cheshire and gwennie-chan - MangaDex Searcher
function mangadex(set) {
    if (cURL.match(/(chapters\/)(?!added).*/) || cURL.match(/(series\/.*)/) || cURL.match(/(issues\/.*)/) || cURL.match(/(anthologies\/.*)/)) {
        if (set === true) {
            let title, authors, select;
            title = getWorkInfo("title");
            //console.log(title);
            authors = getWorkInfo("author");
            //console.log(authors);

            if(cURL.match(/(chapters\/)(?!added).*/)) {
                select = '#chapter-title';
            }
            else {
                select = '.tag-title';
            }

            $(`<div id="mangadex-tool" style="display: none"><h2>Mangadex Search Tool:</h2><a id="mangadex-title" target="_blank" href="https://mangadex.org/search?title=${title}">Title</a></div>`).appendTo(select);

            if(Array.isArray(authors)) {
                for (let i = 0; i < authors.length; i++) {
                    $(`<a class="md-author" target="_blank" href="https://mangadex.org/search?author=${authors[i]}">Author ${i+1}<small>(${authors[i]})</small></a>`).appendTo('#mangadex-tool');
                }
            }
            else if (typeof authors === "string") {
                $(`<a class="md-author" target="_blank" href="https://mangadex.org/search?author=${authors}">Author<small>(${authors})</small></a>`).appendTo('#mangadex-tool');
            }

            $('#mangadex-tool').slideDown('slow','linear');
        }
        else if (set === false) {
            $('#mangadex-tool').slideUp('slow','linear',function(){$(this).remove();});
        }
    }
}

function getWorkInfo(what) {
    function getAuthors(discrim = null) {
        let selector;
        let tempArray = [];
        if (discrim === 'chapters') {
            selector = $('#chapter-title > a');
        }
        else {
            selector = $('.tag-title > a');
        }
        if(selector.length === 1) {
            return selector.text();
        }
        else if (selector.length > 1) {
            selector.each(function(){
                tempArray.push($(this).text());
            });
            return tempArray;
        }
        else {
            return null;
        }
    }

    function getTitle(discrim = null) {
        if (discrim === 'chapters'){
            if(!document.querySelector('#chapter-title b a')) {
                return $('#chapter-title b').text();
            }
            else {
                return $('#chapter-title b a').text();
            }
        }
        else {
            if(!document.querySelector('.tag-title b a')) {
                return $('.tag-title b').text();
            }
            else {
                return $('.tag-title b a').text();
            }
        }
    }

    if (cURL.match(/chapters/)) {
        if(what === "title") {return getTitle('chapters');}
        if(what === "author") {return getAuthors('chapters');}
    }
    else if (cURL.match(/series/)) {
        if(what === "title") {return getTitle();}
        if(what === "author") {return getAuthors();}
    }
    else if (cURL.match(/issues/)) {
        if(what === "title") {return getTitle();}
        if(what === "author") {return getTItle();}
    }
    else if (cURL.match(/anthologies/)) {
        if(what === "title") {return getTitle();}
        if(what === "author") {return getAuthors();}
    }
}


//gwennie-chan and cyricc - Forum Tagifier
function createTagMap() {
    return $.getJSON(tagsJSON).then((data) => {
        const tagMap = {};
        Object.values(data).forEach((tagBin) => tagBin.forEach((nameLink) => tagMap[nameLink.name.toLowerCase()] = nameLink));
        return tagMap;
    });
}

function forumTagger(set) {
    if (cURL.match(/(forum\/topics\/|images\/).*/)) {
        if (set === true) {
            createTagMap().then((tagMap) => {
                $('code').each(function () {
                    // Lookup the tag table and linkify if key exists
                    origTags.push($(this).text());
                    let lowerHTML = this.innerHTML.toLowerCase();
                    if (tagMap.hasOwnProperty(lowerHTML)) {
                        let nameLink = tagMap[lowerHTML];
                        $(this).html(`<a href=${tagURLstub}${nameLink.permalink} target="_blank" class="tagified">${nameLink.name}</a>`);
                    }
                });
            });
            //console.log(origTags);
        }
        else if (set === false){
            $('code').each(function(i){
                $(this).html(origTags[i]);
            });
        }
    }
}

function tssUI(set) {
    if (cURL.match(/user\/suggestions/)) {
        if (set === true){
            $(`<div id="tss-bar">
                <input type="checkbox" id="acceptedCont" checked><span class="text-success">Accepted</span></input>
                <input type="checkbox" id="pendingCont" checked><span class="text-info">Pending</span></input>
                <input type="checkbox" id="rejectedCont" checked><span class="text-error">Rejected</span></input>
        </div>`).appendTo("#main h2");
        }
        else if (set === false) {
            $('#tss-bar').slideUp().remove();
        }
    }
}

function statsShortener(set) {
    if (cURL.match(/(forum)(?!\/topics).*/)) {
        if(set === true) {
            $('.views_count b').each(function () {
                let vCount = parseFloat(this.innerHTML.replace(/,/g, ''));
                //console.log("Converted View Count " + vCount);
                origStats[0].push(vCount);
                $(this).html(numShorten(vCount));
            });
            console.log(origStats[0]);
            $('.posts_count b').each(function () {
                let pCount = parseFloat(this.innerHTML.replace(/,/g, ''));
                //console.log("Converted View Count " + vCount);
                origStats[1].push(pCount);
                $(this).html(numShorten(pCount));
            });
            //console.log(origStats[1]);
        }
        else if (set === false) {
            if (origStats[0].length > 0 && origStats[1].length > 0) {
                $('.views_count b').each(function(i){
                    $(this).html(origStats[0][i].toLocaleString('bestfit',{maximumFractionDigits:0}));
                });
                $('.posts_count b').each(function(i){
                    $(this).html(origStats[1][i].toLocaleString('bestfit',{maximumFractionDigits:0}));
                });
            }
        }
    }
}

function numShorten(num) {
    if (num >= 1000000) { return parseFloat(num / 1000000).toFixed(1) + 'M'; }
    if (num >= 100000) { return Math.round(num / 1000) + 'K'; }
    if (num >= 10000) { return Math.round(num / 100) + 'K'; }
    if (num >= 1000) { return parseFloat(num / 1000).toFixed(2) + 'K'; }
    return num;
}

function mousewheel(set) {
    if (set === true) {
        document.body.addEventListener('wheel',setMouseEventListener);
    }
    else if (set === false) {
        document.body.removeEventListener('wheel',setMouseEventListener);
    }
}

function setMouseEventListener(event) {
    {
        if (event.target.id === 'image' || event.target.classList.contains('left') || event.target.classList.contains('right') || event.target.parentNode.id === 'image') {
            event.preventDefault();
            if (event.deltaY < 0) {
                $('.left').click();
            }
            else {
                $('.right').click();
            }
        }
    }
}

function fixNavBar(set) {
    if (set === true) {
        $('.navbar').addClass('navbar-fixed');
        $('div.forum_post').css('padding-top', 40);
        $(`<div class="nav-padding"</div>`).insertAfter('.navbar');
    }
    else if (set === false) {
        $('.navbar').removeClass('navbar-fixed');
        $('div.forum_post').css("padding-top", 0);
        $('div.nav-padding').remove();
    }
}

function paginate(set){
    if (set === true) {
        $('div.pagination').wrap(`<div class="tmp">`).parent().html();
        let tmp = $('div.tmp').html();
        $('div.pagination').unwrap();
        $('#main').prepend(tmp);
    }
    else if (set === false) {
        $('div.pagination:first').remove();
    }
}

function unhideSpoilers(set) {
    if (set === true) {
        $('.spoilers').addClass('spoilers-disabled');
    }
    else if (set === false) {
        $('.spoilers').removeClass('spoilers-disabled');
    }
}

function injectBBeditor (set) {
    if (cURL.match(/(forum\/(topics\/.+|posts))|(images\/\d+)/)) {
        if (set == true) {
            $(`<div id="thingifier-bbcode" style="display:none">
<a id="thingifier-bbcode-bold" style="font-weight:bold">Bold</a>
<a id="thingifier-bbcode-italics" style="font-style: italic">Italics</a>
<a id="thingifier-bbcode-spoiler" style="color:#FFF;background-color:#000;border:1px solid #FFF">Spoiler</a>
<a id="thingifier-bbcode-quote">Quote</a>
<a id="thingifier-bbcode-link">Link</a>
<a id="thingifier-bbcode-image">Image</a>
<a id="thingifier-bbcode-ul">Bullet List</a>
<a id="thingifier-bbcode-ol">Numbered List</a>
<a id="thingifier-bbcode-hr">Horizontal Line</a>
<a id="thingifier-bbcode-tag" style="font-family: monospace;color:#990000;font-weight:bold;text-transform:uppercase;position:relative;bottom:1px;">Tags</a>
<a id="thingifier-bbcode-codeblock" style="font-family: monospace; color:#555; font-weight:bold; font-size:15px; text-transform:uppercase; position:relative; bottom:1px;">Code Block</a>
<a id="thingifier-bbcode-h1" style="font-weight:bold">H1</a>
<a id="thingifier-bbcode-h2" style="font-weight:bold">H2</a>
<a id="thingifier-bbcode-h3" style="font-weight:bold">H3</a>
<a id="thingifier-bbcode-h4" style="font-weight:bold">H4</a>
<a id="thingifier-bbcode-h5" style="font-weight:bold">H5</a>
<a id="thingifier-bbcode-h6" style="font-weight:bold">H6</a>
<a id="thingifier-bbcode-clear" style="font-weight:bold;float:right;color:darkred;border:2px solid darkred;">CLEAR ALL FORMATTING</a>
</div>`).prependTo($('.forum_post_message .controls')).slideDown('slow','linear');
        }
        else if (set == false) {
            $('#thingifier-bbcode').slideUp('slow','linear').done(function(){$(this).remove();});
        }
    }
}

$('#forum_post_message').click(function(){
    if (typeof this.value === 'string' && this.value.length > 0) {
        ss = this.selectionStart;
        se = this.selectionEnd;
        sel = this.value.substring(ss,se);
        tb = this.value.substring(0, ss);
        te = this.value.substring(se);
        //console.log({tb, ss, sel, se, te});
    }
});

$('#forum_post_message').keyup(function(){
    if (typeof this.value === 'string' && this.value.length > 0) {
        ss = this.selectionStart;
        se = this.selectionEnd;
        sel = this.value.substring(ss,se);
        tb = this.value.substring(0, ss);
        te = this.value.substring(se);
        //console.log({tb, ss, sel, se, te});
    }
});

$('body').click(function(evt){
    if(evt.target.id === 'new_forum_post'){
        //console.log('Selection Preserved');
        return;
    }
    else if ($(evt.target).closest('#new_forum_post').length) {
        //console.log('Selection Preserved');
        return;
    }
    else {
        //console.log('Selection Wiped');
        ss = se = sel = tb = te = pt = null;
    }
});

$('#thingifier-bbcode a').click(function(){
    let type = this.id.substring(18);
    //console.log(type);
    //console.log({tb, ss, sel, se, te});
    if(typeof ss === 'number' && typeof se === 'number' && typeof sel === 'string' && typeof tb === 'string' && typeof te === 'string' && type !== 'clear') {
        formatSelection(type);
    }
    else if (type !== 'clear') {
        formatSelection(type,true);
    }
    else if (type === 'clear') {
        undoFormatting();
    }
});

function formatSelection(type,nosel = false){
    let fpmv = document.getElementById('forum_post_message').value;
    let fpm = $('#forum_post_message');
    if (ss === se && typeof ss === 'number' && typeof se === 'number') {
        sel = `<${type} text here>`;
    }
    if(nosel === true){
        ss = 0;
        se = fpmv.length;
        if(fpmv.length = 0){sel = '';}
        else {sel = fpmv;}
    }
    if(tb === null || tb === undefined){ tb = ''; }
    if(te === null || te === undefined){ te = ''; }
    if(nosel === false){fpm.val(tb + format(sel,type) + te);}
    else if (nosel === true){
        let nl;
        if(sel.length > 0){nl = `\n`;}
        else{nl = '';}
        fpm.val(`${sel}${nl}${format(`<${type} text here>`,type)}`);
    }
    ss = se = sel = tb = te = pt = null;
}

function checkForLines(v) {
    if(typeof v === 'string'){
        let tmp = v.split('\n');
        //console.log(tmp);
        if (tmp.length > 0){ sa = tmp;}
        else {return false;}
    }
}

function checkifURL(v,type = 'standard') {
    if(type === 'standard') {
        if(v.match(/((https?|ftps?):\/\/)?((.*\.)?.*\..*)/)) {return true;}
        else {return false;}
    }
    else if (type === 'embed') {
        if(v.match(/((https?|ftps?):\/\/)?((.*\.)?.*\..*)+(\.(png|jpg|jpeg|gif|bmp|tif|tiff))/)) {return true;}
        else {return false;}
    }
}

function formatType(v,type) {
    switch(type) {
        case 'bold':
            return `**${v}**`;
        case 'italics':
            return `_${v}_`;
        case 'spoiler':
            return `==${v}==`;
        case 'quote':
            return `> ${v}`;
        case 'link' :
            if(checkifURL(v)){
                return `[](${v})`;
            }
            else {
                return `[<linktext>](<linkurl>)`;
            }
        case 'image':
            if(checkifURL(v,'embed')) {
                return `![](${v})`;
            }
            else {
                return `![](<image embed url here>)`;
            }
        case 'ul':
            return `* ${v}`;
        case 'ol':
            return `. ${v}`;
        case 'hr':
            return `${v} \n***`;
        case 'tag':
            return `\`${v}\``;
        case 'codeblock':
            return `     ${v}`;
        case 'h1':
            return `# ${v}`;
        case 'h2':
            return `## ${v}`;
        case 'h3':
            return `### ${v}`;
        case 'h4':
            return `#### ${v}`;
        case 'h5':
            return `##### ${v}`;
        case 'h6':
            return `###### ${v}`;
    }
}

function format(v,type) {
    let va = null;
    checkForLines(v);
    //console.log(sa);
    if(sa.length > 1) {
        //console.log('Format Var = Array');
        for(let i = 0; i < sa.length; i++) {
            //console.log('Index %d is \"%s\"',i,sa[i]);
            if(i === 0) {
                va = `${formatType(sa[i],type)}\n`;
            }
            else {
                va += `${formatType(sa[i],type)}\n`;
            }

            console.log(`${type} formatting\n` + va);
        }
        return va;
    }
    else if(sa.length === 1) {
        //console.log('Format Var = String');
        //console.log({v,type,sa});
        return formatType(sa[0],type);
    }
    else {
        console.log('Format Var Undefined!!!!')
        alert ('Script-chan Error: Undefined Selection Variable');
        return v;
    }
}

function undoFormatting() {
    let pattern = /(\*{2,3}|\*{1} |_|`|={2}|> |!?\[|\]|(?<=\])\(|(?<=\(\b.*\b)\)|(?<=\n)\d\ | {4}|#{1,6})/g;
    //console.log('Purging Formatting');
    let pt = document.getElementById('forum_post_message').value;
    //console.log(pattern.test(pt));
    //console.log(pt);
    pt = pt.replace(pattern,'');
    //console.log(pt);
    $('#forum_post_message').val(pt);
    ss = se = sel = tb = te = pt = null;
}
