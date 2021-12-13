# obsidian-file-info-panel-plugin

This plugin for [Obsidian](https://obsidian.md/) creates a small File Info view that displays the active file's date created, date modified, file size, and links to open the file in its native application and to open the file's folder.

## Usage

After enabling the plugin in the settings menu, you should see the info button appear in the left navigation panel.  This will toggle the file info view.

The File Info settings allows you to set which file information is displayed.

## Features

- Click on the file name to open the file in its native app.
- Click on the folder name to open the file's location.
- Unobtrusive text matches your currently installed theme.
- File size is displayed in human-readable format (includes bytes, KB, MB, GB, etc.).
- Dates include human-readable "from now" text.  Example:

> Mon, Nov 22, 2021 7:59 PM
21 days ago

## Settings

-**Show Date Created**: Display the date and time the file was created.
-**Show Date Modified**: Display the date and time the file was last modified.
-**Show File Size**: Display the human readable file size.
-**Show File**: Display the file name as a link to open the file in its default application.
-**Show Folder**: Display the file's folder as a link to open that folder.

## Screenshots

<img src="https://github.com/CattailNu/obsidian-file-info-panel-plugin/images/panel_screenshot.png" alt="File Info Panel Info view" width="200">

<img src="https://github.com/CattailNu/obsidian-file-info-panel-plugin/images/sidebar_icon_screenshot.png" alt="File Info Panel Info button" width="200">

## Customization

The following CSS Variables can be overridden in your `obsidian.css` file.

```css
/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

.tlfFileInfoTable {
	display: table;
	border: none;
	margin:0em;
	padding:0em;
}

.tlfFileInfoRow {
	display: table-row;
	border: none;
	margin: 0em;
	padding:0em;
}

.tlfFileInfoCell {
	display: table-cell;
	border: none;
	margin: 0px;
	margin-left:0.5em;
	padding:0em;
	text-align: left;
	white-space: nowrap;
}

.tlfFileInfoLabel {
	border: none;
	margin: 0px;
	margin-right:0.2em;
	padding:0em;
	font-size: 0.7em;
	color: var(--text-muted);
}

.tlfFileInfoValue {
	border: none;
	margin: 0px;
	padding:0em;
	font-size: 0.7em;
}

.tlfFileInfoButton {
	border: 1px solid var(--background-modifier-border);
	color: var(--text-muted);
	border: none;
	margin: 0px;
	padding: 0px;
	font-size: 0.7em;
	height: 2em;
	text-align: left;
}
```

<img src="https://github.com/CattailNu/obsidian-file-info-panel-plugin/images/css_customization_variables.png" alt="File Info Panel CSS Customization Variables" width="200">

## Compatibility

`obsidian-file-info-panel-plugin` has been tested on Mac, Obsidian v0.12.19.

## Say Thanks 🙏

Consider reading and sharing one of my books (available through Amazon).  There are fantasy, science fiction, novelty art books, non-fiction, thriller, and even a biography.

[https://www.amazon.com/T.-L.-Ford/e/B0034Q6Q2S](https://www.amazon.com/T.-L.-Ford/e/B0034Q6Q2S)

You'll also find a bunch of free content and writing/art tools on my personal website.

[https://www.Cattail.Nu](https://www.Cattail.Nu)

Featured: Make your own dreamcatcher graphics:
[http://www.cattail.nu/journal_tools/page_dreamcatcher_art.html](http://www.cattail.nu/journal_tools/page_dreamcatcher_art.html)
