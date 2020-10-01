## THIS USERSCRIPT IS IN EARLY ALPHA
## IT IS NOT RECOMMENDED TO BE USED AT THIS CURRENT TIME

# Dynasty-Scans Script-chan
Dynasty-Scans Script-chan is a [userscript](https://en.wikipedia.org/wiki/Userscript) for [Dynasty-Scans.com](https://dynasty-scans.com) as a master script, combining a sizeable handful of others brought to life on the Dynasty forums. The scripts enhance or add functionality to the website, providing better ease-of-use.

Original scripts created by [Alice Cheshire](https://github.com/Alice-Cheshire), [cyrric](https://github.com/luejerry), and [gwennie-chan](https://github.com/gwennie-chan).

## Development Checklist :soon:
- [x] Design UI
- [x] Implement Basic UI Functionality
- [x] Implement LocalStorage For Setting Storage
- [ ] Backend Coding
  - [x] Fixed Navbar
  - [x] Pagination
  - [ ] Mark Read
  - [ ] Tag Hider
  - [x] Unhide Spoilers
  - [x] Your Posts
  - [ ] Quick Reply Editor
  - [ ] Quote to Quick Reply
  - [ ] Move Quick Reply
  - [x] Forum Tagger
  - [x] Stats Shortener
  - [ ] Font Size
  - [ ] Gallery Viewer
  - [ ] Magnifier
  - [x] SSP - Tag Selection Switcher
  - [x] Mangadex Searcher (Completely Rewritten)
  - [x] Browser Title Rethingifier
  - [x] Mousewheel Clicker
- [ ] Debugging, Cross-Browser and Beta Testing
- [ ] Release First Stable Version

## Changelog :new:

(We'll Need This Eventually)

## Features :toolbox:
Script-chan implements and bundles together features associated with minor scripts. These features are grouped into four major types of tweaks: Browsing, Forum, Gallery, and Miscelleanous. (Tweaks are also grouped as such on the script UI.)

### Browsing Tweaks :bookmark_tabs:
These tweaks alter basic site directory and page navigation

#### Fixed Navbar _(Alice)_
> Changes the site navbar to be fixed at the top of the window instead of static at top of the page.
#### Add Top Pagination _(Alice)_
> Adds another page selector (on the bottom of the page by default) to the top of the page for easier movement between pages.
#### Mark Read _(cyrric)_
> Marks titles in accordance with user lists. Read titles/chapters are greyed out, subscribed titles are red.
#### Tag Hider _(cyrric)_
> Allows user to select metadata tags which are automatically hidden from view on uploaded works. (Does **NOT** blacklist titles based on tag.)

### Forum Tweaks :speech_balloon:
These tweaks improve usage of posting, replying, and reading the forums.

#### Unhide Spoilers _(Alice)_
> Reveals forum text inside spoiler posts automatically.
#### Your Posts Button _(Alice and gwennie)_
> Creates button link to the forum posts page associated with your user account.
#### Quick Reply Text Editor _(Alice)_
> Adds [bbcode markup](https://en.wikipedia.org/wiki/BBCode) buttons to forum post/quote post sections for fast, easy text formatting.
##### Replace Quote With Quick Reply
> Changes forum quotes with Quick Reply, allowing for faster, better quoting of other posts.
##### Move Quick Reply Under Quoted Post
> Moves Quick Reply from bottom of the page to right under the post being quoted.
#### Forum Tagger _(gwennie)_
> Searches forum posts and image comments for valid tag blocks and turns them into valid links to the directory page for that tag.
#### Stats Shortener _(gwennie)_
> Shortens and abbreviates post count and view count stats on the top-level forum overview pages.
#### Font Size _(Alice)_
> Allows for five font-size selections to improve readability of forum posts and image comments.

### Gallery Tweaks :framed_picture:
These tweaks improve or ease viewing of graphic-heavy parts of the site.

#### Gallery Viewer _(cyricc)_
> Allows browsing high-resolution images from the top-level Images section page. Metadata included.
#### Magnifier _(Alice)_ (UI rewritten for Script-chan)
> Creates a software-based, customizable magnifying lens on the site, allowing for easier viewing of small text, low-resolution images, and graphics.

### Miscellaneous Tweaks :symbols:
These tweaks provide minor cosmetic changes or obscure enhancements.

#### Suggestions Status Page - Tag Selection Switcher _(gwennie)_
> Allows for quick and easy filtering of your suggested tag changes on the Suggestions Status page by accepted, rejected, and/or pending suggestions.
#### MangaDex Searcher _(Alice and gwennie)_ (UI and backend rewritten for Script-chan)
> Adds tool near work titles to search for work title or work author on [MangaDex](https://mangadex.org/).
#### Browser Title Rethingifier _(Alice)_
> Reverses browser title format to list what work/page is being viewed first, instead of the website name.
#### Mousewheel Click Support _(Alice)_
> Adds ability to automatically click left or right through manga pages based on mousewheel scroll direction. (Up = Left, Down = Right)
  
## Installation :inbox_tray:
Script-chan was built to run on [Tampermonkey](https://www.tampermonkey.net/), available as an extension to most major browsers including Chrome, Firefox, Safari, Opera Next, and Microsoft Edge.

### Installation Steps

1. Install/Already Have [Tampermonkey](https://www.tampermonkey.net/)
1. Once installed, [CLICK HERE](https://github.com/gwennie-chan/Dynasty-Scans-Script-chan/raw/master/Dynasty-Scans%20Script-chan.user.js) to access the raw script from the repo
1. Click "Install" on the Tampermonkey dialog
1. Go To Dynasty-Scans And Check For Successful Install and Operation

### Updating Script

Tampermonkey will **automatically update** this userscript from this repository when a new commit with an incremented version value is made to the master script.

To manually update, repeat install procedure above.
