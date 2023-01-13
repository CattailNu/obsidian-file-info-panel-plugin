/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

/* Notes for dev
https://github.com/TfTHacker/obsidian42-brat/blob/main/help/developers.md
Versioning: https://semver.org


20230112 updated to show image width/height
20230112 updated to add hide and show panel commands


*/

/* T. L. Ford */
/* https://www.Cattail.Nu */

import {
	App,
	arrayBufferToBase64,
	FileSystemAdapter,
	ItemView,
	MarkdownView,
	MetadataCache,
	moment,
	normalizePath,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	WorkspaceLeaf
} from 'obsidian';
import { VIEW_TYPE } from "./tlfConstants";
import { getCharacterCount, getSentenceCount, getWordCount, getParagraphCount, getWordFrequencyArray, getURLFrequencyArray, cleanComments } from "./stats";
//import type CodeMirror from "codemirror";
//import { EditorView, ViewUpdate } from '@codemirror/view';
//import { EditorState, Text } from '@codemirror/state';
import * as CodeMirror from 'codemirror';

import {
	tlfPluginSettingTab,
	tlfDefaultSettings
} from "./tlfPluginSettingTab";

import { tlfItemView } from "./tlfItemView";

import { formatBytes } from "./tlfUtilities";

// npm run dev

export default class tlfFileInfo extends Plugin {
	settings: tlfPluginSettingTab;

	// intervalTimer = null;


	async onload() {
		await this.loadSettings();
//		console.clear();

		var a = this.app;
		var p = this;

		this.registerView(
			VIEW_TYPE,
			(leaf) => new tlfItemView(leaf, a, p)
		);

		const ribbonIcon = this.addRibbonIcon('info', 'File Info Panel', (evt: MouseEvent) => {
			// open or close the file info window
			this.toggleView();
		});

		this.addCommand({
			id: 'form-info-toggle-window',
			name: 'Toggle File Info Panel',
			callback: () => {
				// open or close the file info window
				this.toggleView();
			}
		});

		this.addCommand({
			id: 'form-info-show-window',
			name: 'Show File Info Panel',
			callback: () => {
				// open the file info window
				this.activateView();
			}
		});

		this.addCommand({
			id: 'form-info-hide-window',
			name: 'Hide File Info Panel',
			callback: () => {
				// close the file info window
				this.deactivateView();
			}
		});


		this.addSettingTab(new tlfPluginSettingTab(this.app, this));


		const debounce = (n: number, fn: (...params: any[]) => any, immed: boolean = false) => {
			let timer: number | undefined = undefined;
			return function (this: any, ...args: any[]) {
				if (timer === undefined && immed) {
					fn.apply(this, args);
				}
				clearTimeout(timer);
				timer = setTimeout(() => fn.apply(this, args), n);
				return timer;
			}
		};
		
		const requeryStats = debounce(1000, async () => {
			var file = this.app.workspace.getActiveFile();
			var data = "";
			var isText = 0;
			var isImage = 0;
			var imageWidth = 0;
			var imageHeight = 0;
			var img;
	
			if ( file && file.extension && (String(file.extension).toLowerCase() === "md" || String(file.extension).toLowerCase() === "txt") ) {
				isText = 1;
				data = await this.app.vault.cachedRead(file);
			}

			// image file data syntax based on:
			// https://github.com/mvdkwast/obsidian-copy-as-html/blob/master/main.ts

			// not supporting svg image width/height
			var imageExtensions = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'png', 'webp', 'tiff'];
			if (file && file.extension && imageExtensions.includes(String(file.extension).toLowerCase())) {
				isImage = 1;
				//data = await this.app.vault.cachedRead(file);
			}
	
			this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach(async (leaf) => {
				if (leaf.view instanceof tlfItemView) {
	
					if (! file ) {
	/*
	// Not the correct thing to do (comment out the defaults), but should keep the
	// mobile apps from ditching the stats because the current "view" isn't a file, but a plugin panel
						leaf.view.strCreated = "";
						leaf.view.strModified = "";
	//					leaf.view.strFile = "";
	//					leaf.view.strFolder = "";
						leaf.view.strSize = "";
						leaf.view.numWords = 0;
						leaf.view.numCharacters = 0;
						leaf.view.numSentences = 0;
						leaf.view.numParagraphs = 0;
						leaf.view.numSelectedWords = 0;
						leaf.view.numSelectedParagraphs = 0;
						leaf.view.numSelectedCharacters = 0;
						leaf.view.numSelectedSentences = 0;
						leaf.view.arrCurrentWordFrequency = [];
						leaf.view.isText = 0;
						leaf.view.isImage = 0;
	*/
					} else {
	
						var currentWords = 0;
						var currentCharacters = 0;
						var currentSentences = 0;
						var currentParagraphs = 0;
						var selectedWords = 0;
						var selectedCharacters = 0;
						var selectedSentences = 0;
						var selectedParagraphs = 0;
						var currentWordFrequency = [];
						var currentURLFrequency = [];
	
						if (String(file.extension).toLowerCase() === "md" || String(file.extension).toLowerCase() === "txt") {
	
							if ( data ) {
								if ( this.settings.showCurrentWords ) { currentWords = getWordCount(data, this.settings.excludeURLFromWordCounts); }
								if ( this.settings.showCurrentCharacters ) { currentCharacters = getCharacterCount(data); }
								if ( this.settings.showCurrentSentences ) { currentSentences = getSentenceCount(data); }
								if ( this.settings.showCurrentParagraphs ) { currentParagraphs = getParagraphCount(data); }
								if ( this.settings.showWordFrequency ) { currentWordFrequency = getWordFrequencyArray(data, this.settings.excludeURLFromWordCounts); }
								if ( this.settings.showURLFrequency ) { currentURLFrequency = getURLFrequencyArray(data); }
	
							}
	
							if ( this.settings.showSelectedWords ||
								this.settings.showSelectedCharacters ||
								this.settings.showSelectedSentences ||
								this.settings.showSelectedParagraphs
							) {
	/*
								if ( ! this.intervalTimer ) {
									this.intervalTimer = window.setInterval(() => {
										this.requeryStats();
										}
									, INTERVAL_MINUTES * 60 * 1000);
									this.registerInterval(this.interval);
								}
	*/
								var selectedData = "";
	
								const v = this.app.workspace.getActiveViewOfType(MarkdownView);
								if ( v ) {
								if ( v.file ) {
								if ( v.file == file ) {
									if ("editor" in v) {
										if ( v.getMode() === "source" ) {
											if ( v.editor.somethingSelected() ) {
												selectedData = v.editor.getSelection();
												if ( this.settings.showSelectedWords ) { selectedWords = getWordCount(selectedData, this.settings.excludeURLFromWordCounts); }
												if ( this.settings.showSelectedCharacters ) { selectedCharacters = getCharacterCount(selectedData); }
												if ( this.settings.showSelectedSentences ) { selectedSentences = getSentenceCount(selectedData); }
												if ( this.settings.showSelectedParagraphs ) { selectedParagraphs = getParagraphCount(selectedData); }
											}
										}
									}
								} } }
							} /* else {
								// they have changed settings to turn these off
								// so kill it.
								if ( this.intervalTimer ) {
									window.clearInterval(this.intervalTimer);
									this.intervalTimer = null;
								}					
							} */
							
	
						} // if md or txt
	
						var cDate = moment.unix(file.stat.ctime/1000);
						var cString = cDate.format(this.settings.momentDateFormat);
						
	
						var mDate = moment.unix(file.stat.mtime/1000);
						var mString = mDate.format(this.settings.momentDateFormat);
	
						leaf.view.isText = isText;
						leaf.view.strCreated = cString;
						leaf.view.strCreatedFromNow = cDate.fromNow();
	
						leaf.view.strModified = mString;
						leaf.view.strModifiedFromNow = mDate.fromNow();
	
	
						leaf.view.strDisplayFile = file.name;
	
						if ( file.parent ) {
							leaf.view.strRelativePath = file.parent.path;
						} else {
							leaf.view.strRelativePath = file.path;
						}
	
						// app.openWithDefaultApp(iv.strFileOpen);
						// app.showInFolder(iv.strFileOpen);
						leaf.view.strFileOpen = normalizePath(leaf.view.strRelativePath + "/" + file.name);
	
						leaf.view.strDisplayFolder = normalizePath(this.app.vault.adapter.basePath + "/" + leaf.view.strRelativePath);
	
						leaf.view.strSize = formatBytes(file.stat.size,1);

						leaf.view.isImage = isImage;

						if ( isImage ) {

							let urlPath = file.path;
							urlPath = encodeURIComponent(urlPath);
							urlPath = "app://local/" + this.app.vault.adapter.basePath.replace(/\\/g, '/') + leaf.view.strRelativePath.replace(/\\/g, '/') + urlPath;

							img = new Image();
							img.setAttribute('crossOrigin', 'anonymous');
							img.onload = function(){
								imageWidth = img.naturalWidth;
								imageHeight = img.naturalHeight;

								leaf.view.updateImageData(imageWidth, imageHeight);

							}
							img.onerror = (err) => {
								console.log(err);
							}
							img.src = urlPath;

						}
	
						leaf.view.numWords = currentWords;
						leaf.view.numCharacters = currentCharacters;
						leaf.view.numSentences = currentSentences;
						leaf.view.numParagraphs = currentParagraphs;
	
						leaf.view.numSelectedWords = selectedWords;
						leaf.view.numSelectedCharacters = selectedCharacters;
						leaf.view.numSelectedSentences = selectedSentences;
						leaf.view.numSelectedParagraphs = selectedParagraphs;
	
						leaf.view.arrCurrentWordFrequency = currentWordFrequency;
						leaf.view.arrCurrentURLFrequency = currentURLFrequency;

						leaf.view.numImageWidth = imageWidth;
						leaf.view.numImageHeight = imageHeight;

	
					} // if file
					leaf.view.updateDisplay();
				}
			});
		});

		// needed for when a new file is created with a keystroke and is renamed
		// otherwise, the info panel can't find the file correctly.
		this.registerEvent(this.app.vault.on('rename', (abstractFile, oldFilePath) => {
			if ( ! this.app.workspace.getActiveFile() ) return;
			if( this.app.workspace.getActiveFile().path === abstractFile.path ) {
				requeryStats();
			}
		}));

		// needed for when a new file is created with a keystroke and is not renamed
		this.registerEvent(this.app.vault.on('create', (abstractFile) => {
			if ( ! this.app.workspace.getActiveFile() ) return;
			if( this.app.workspace.getActiveFile().path === abstractFile.path ) {
				requeryStats();
			}
		}));

		this.registerEvent(this.app.workspace.on('file-open', ( aFile? ) => {
			requeryStats();
		}));

		// needed if user selects the 3-dot menu and deletes
		this.registerEvent(this.app.vault.on('delete', (abstractFile) => {
			if ( ! this.app.workspace.getActiveFile() ) return;
			if( this.app.workspace.getActiveFile().path === abstractFile.path ) {
				requeryStats();
			}
		}));

		// needed for multi-pane support when users change between them
		this.registerEvent(this.app.workspace.on('active-leaf-change', ( aLeaf? ) => {
			if ( ! this.app.workspace.getActiveFile() ) return;
			requeryStats();
		}));


		// fires on auto-save
		this.registerEvent(this.app.vault.on('modify', (abstractFile) => {
			if ( ! this.app.workspace.getActiveFile() ) return;
			if( this.app.workspace.getActiveFile().path === abstractFile.path ) {
				requeryStats();
			}
		}));

		// fires every keystroke, but is behind a letter
		this.registerEvent(this.app.workspace.on('editor-change', (editor, markdownView) => {
			requeryStats();
		}));

		// to grab selection counts, not functioning
		let callback = (evt: Event) => {
			requeryStats();
		};
		window.addEventListener('selectionchange', callback, true);
		this.register(() => window.removeEventListener('selectionchange', callback, true));


	} // END async onload() {



	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
		this.app.workspace.iterateCodeMirrors(cm => {
		  cm.off('change', this.onChange);
		});
    }

	async loadSettings() {
		this.settings = Object.assign({}, tlfDefaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async deactivateView() {
/*
		if ( this.intervalTimer ) {
			window.clearInterval(this.intervalTimer);
			this.intervalTimer = null;
		}
*/
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
	}

	async toggleView() {
		var found = false;
		this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => {
			if (leaf.view instanceof tlfItemView) {
				this.deactivateView();
				found = true;
			}
		});
		if ( ! found ) {
			this.activateView();
		}		
	}


	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE,
			active: true,
		});

		this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]);
	}

}

