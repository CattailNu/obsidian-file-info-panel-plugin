/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

/* Notes:
Selected text counts are not working.
Event structure is not right and needs debouncing

/* Notes for dev
https://github.com/TfTHacker/obsidian42-brat/blob/main/help/developers.md
Versioning: https://semver.org
*/

/* T. L. Ford */
/* https://www.Cattail.Nu */

import { App, ItemView, WorkspaceLeaf, MetadataCache, Plugin, MarkdownView, PluginSettingTab, Setting, moment, normalizePath } from 'obsidian';
import { VIEW_TYPE } from "./tlfConstants";
import { getCharacterCount, getSentenceCount, getWordCount, getParagraphCount, getWordFrequencyArray, cleanComments } from "./stats";
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
			id: 'form-info-show-window',
			name: 'Show/Hide File Info Panel',
			callback: () => {
				// open or close the file info window
				this.toggleView();
			}
		});

		this.addSettingTab(new tlfPluginSettingTab(this.app, this));
/*
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			this.requeryStats();
			console.log('click', evt);
		});
*/		
		// needed for when a new file is created with a keystroke and is renamed
		// otherwise, the info panel can't find the file correctly.
		this.registerEvent(this.app.vault.on('rename', () => {
			this.requeryStats();
		}));

		// needed for when a new file is created with a keystroke and is not renamed
		this.registerEvent(this.app.vault.on('create', () => {
			this.requeryStats();
		}));

		
		this.registerEvent(this.app.workspace.on('file-open', () => {
			this.requeryStats();
		}));

		// needed if user selects the 3-dot menu and deletes
		this.registerEvent(this.app.vault.on('delete', () => {
			this.requeryStats();
		}));

		// needed for multi-pane support when users change between them
		this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
			this.requeryStats();
		}));

		// fires on auto-save
		this.registerEvent(this.app.vault.on('modify', () => {
			this.requeryStats();
		}));

		// fires every keystroke, but is behind a letter
		this.registerEvent(this.app.workspace.on('editor-change', () => {
			console.log("editor-change");
			this.requeryStats();
		}));

		// to grab selection counts, not functioning
		this.registerDomEvent(window, 'selectionchange', (event) => {
			console.log("selectionchange");
			this.requeryStats();
		});


	} // END async onload() {


	async requeryStats() {

		var file = this.app.workspace.getActiveFile();
		var data = "";
		var isText = 0;

		if ( file && (file.extension === "md" || file.extension === "txt") ) {
			isText = 1;
			//data = await file.vault.cachedRead(file);
			data = await this.app.vault.cachedRead(file);
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

					if (file.extension === "md" || file.extension === "txt") {

						if ( data ) {
							if ( this.settings.showCurrentWords ) { currentWords = getWordCount(data); }
							if ( this.settings.showCurrentCharacters ) { currentCharacters = getCharacterCount(data); }
							if ( this.settings.showCurrentSentences ) { currentSentences = getSentenceCount(data); }
							if ( this.settings.showCurrentParagraphs ) { currentParagraphs = getParagraphCount(data); }
							if ( this.settings.showWordFrequency ) { currentWordFrequency = getWordFrequencyArray(data); }

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
							if ( v.file == file ) {
								if ("editor" in v) {
									if ( v.getMode() === "source" ) {
										if ( v.editor.somethingSelected() ) {
											selectedData = v.editor.getSelection();
											if ( this.settings.showSelectedWords ) { selectedWords = getWordCount(selectedData); }
											if ( this.settings.showSelectedCharacters ) { selectedCharacters = getCharacterCount(selectedData); }
											if ( this.settings.showSelectedSentences ) { selectedSentences = getSentenceCount(selectedData); }
											if ( this.settings.showSelectedParagraphs ) { selectedParagraphs = getParagraphCount(selectedData); }
										}
									}
								}
							}
						} /* else {
							// they have changed settings to turn these off
							// so kill it.
							if ( this.intervalTimer ) {
								window.clearInterval(this.intervalTimer);
								this.intervalTimer = null;
							}					
						} */
						

					}

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

					leaf.view.numWords = currentWords;
					leaf.view.numCharacters = currentCharacters;
					leaf.view.numSentences = currentSentences;
					leaf.view.numParagraphs = currentParagraphs;

					leaf.view.numSelectedWords = selectedWords;
					leaf.view.numSelectedCharacters = selectedCharacters;
					leaf.view.numSelectedSentences = selectedSentences;
					leaf.view.numSelectedParagraphs = selectedParagraphs;

					leaf.view.arrCurrentWordFrequency = currentWordFrequency;

				}
				leaf.view.updateDisplay();
			}
		});
	}


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
		this.requeryStats();
	}

}
