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
	MarkdownView,
	moment,
	normalizePath,
	Plugin
} from 'obsidian';
import { VIEW_TYPE } from "./tlfConstants";
import { getCharacterCount, getSentenceCount, getWordCount, getParagraphCount, getLineCount, getFrontMatterText, stripFrontMatter, getWordFrequencyArray, getURLFrequencyArray } from "./stats";

import {
	tlfPluginSettingTab,
	tlfDefaultSettings
} from "./tlfPluginSettingTab";

import { tlfItemView } from "./tlfItemView";

import { formatBytes } from "./tlfUtilities";

// npm run dev

export default class tlfFileInfo extends Plugin {
	settings: tlfPluginSettingTab;
	statusBarItem: HTMLElement;
	statusBarPopup: HTMLElement | null = null;
	currentFileInfo: any = {};

	// intervalTimer = null;


	async onload() {
		await this.loadSettings();
//		console.clear();

		this.registerView(
			VIEW_TYPE,
			(leaf) => new tlfItemView(leaf, this.app, this)
		);

		const ribbonIcon = this.addRibbonIcon('info', 'File info panel', (evt: MouseEvent) => {
			// open or close the file info window
			this.toggleView();
		});

		this.addCommand({
			id: 'form-info-toggle-window',
			name: 'Toggle panel',
			callback: () => {
				// open or close the file info window
				this.toggleView();
			}
		});

		this.addCommand({
			id: 'form-info-show-window',
			name: 'Show panel',
			callback: () => {
				// open the file info window
				this.activateView();
			}
		});

		this.addCommand({
			id: 'form-info-hide-window',
			name: 'Hide panel',
			callback: () => {
				// close the file info window
				this.deactivateView();
			}
		});


		this.addSettingTab(new tlfPluginSettingTab(this.app, this));

		this.currentFileInfo = this.createFileInfoData();
		this.statusBarItem = this.addStatusBarItem();
		this.statusBarItem.addClass("tlfFileInfoStatusBar");
		this.registerDomEvent(this.statusBarItem, "click", (evt: MouseEvent) => {
			evt.preventDefault();
			evt.stopPropagation();
			this.toggleStatusBarPopup();
		});
		this.registerDomEvent(document, "mousedown", (evt: MouseEvent) => {
			if ( this.statusBarPopup &&
				! this.statusBarPopup.contains(evt.target as Node) &&
				! this.statusBarItem.contains(evt.target as Node) ) {
				this.closeStatusBarPopup();
			}
		});
		this.registerDomEvent(document, "keydown", (evt: KeyboardEvent) => {
			if ( evt.key == "Escape" ) {
				this.closeStatusBarPopup();
			}
		});
		this.updateImplementationSettings();

		const debounce = (n: number, fn: (...params: any[]) => any, immed: boolean = false) => {
			let timer: number | undefined = undefined;
			return function (this: any, ...args: any[]) {
				if (timer === undefined && immed) {
					fn.apply(this, args);
				}
				window.clearTimeout(timer);
				timer = window.setTimeout(() => fn.apply(this, args), n);
				return timer;
			}
		};
		
		const requeryStats = debounce(1000, async () => {
			const file = this.app.workspace.getActiveFile();
			let data = "";
			let isText = 0;
			let isImage = 0;
			const imageWidth = 0;
			const imageHeight = 0;
	
			if ( file && file.extension && (String(file.extension).toLowerCase() === "md" || String(file.extension).toLowerCase() === "txt") ) {
				isText = 1;
				data = await this.app.vault.cachedRead(file);
			}

			// image file data syntax based on:
			// https://github.com/mvdkwast/obsidian-copy-as-html/blob/master/main.ts

			// not supporting svg image width/height
			const imageExtensions = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'png', 'webp', 'tiff'];
			if (file && file.extension && imageExtensions.includes(String(file.extension).toLowerCase())) {
				isImage = 1;
				//data = await this.app.vault.cachedRead(file);
			}
	
			this.currentFileInfo = this.createFileInfoData();

			if ( file ) {
				let currentWords = 0;
				let currentCharacters = 0;
				let currentSentences = 0;
				let currentParagraphs = 0;
				let currentLines = 0;
				let selectedWords = 0;
				let selectedCharacters = 0;
				let selectedSentences = 0;
				let selectedParagraphs = 0;
				let selectedLines = 0;
				let currentFrontMatter: string | null = null;
				let currentWordFrequency = [];
				let currentURLFrequency = [];

				if (String(file.extension).toLowerCase() === "md" || String(file.extension).toLowerCase() === "txt") {
					if ( data ) {
						const statData = this.settings.includeFrontMatterAsText ? data : stripFrontMatter(data);
						if ( this.settings.showCurrentWords ) { currentWords = getWordCount(statData, this.settings.excludeURLFromWordCounts); }
						if ( this.settings.showCurrentCharacters ) { currentCharacters = getCharacterCount(statData); }
						if ( this.settings.showCurrentSentences ) { currentSentences = getSentenceCount(statData); }
						if ( this.settings.showCurrentParagraphs ) { currentParagraphs = getParagraphCount(statData); }
						if ( this.settings.showCurrentLines ) { currentLines = getLineCount(statData); }
						if ( this.settings.showFrontMatterInPanel ) { currentFrontMatter = getFrontMatterText(data); }
						if ( this.settings.showWordFrequency ) { currentWordFrequency = getWordFrequencyArray(statData, this.settings.excludeURLFromWordCounts); }
						if ( this.settings.showURLFrequency ) { currentURLFrequency = getURLFrequencyArray(statData); }
					}

					if ( this.settings.showSelectedWords ||
						this.settings.showSelectedCharacters ||
						this.settings.showSelectedSentences ||
						this.settings.showSelectedParagraphs ||
						this.settings.showSelectedLines
					) {
						let selectedData = "";

						const v = this.app.workspace.getActiveViewOfType(MarkdownView);
						if ( v ) {
						if ( v.file ) {
						if ( v.file == file ) {
							if ("editor" in v) {
								if ( v.getMode() === "source" ) {
									if ( v.editor.somethingSelected() ) {
										selectedData = v.editor.getSelection();
										const selectedStatData = this.settings.includeFrontMatterAsText ? selectedData : stripFrontMatter(selectedData);
										if ( this.settings.showSelectedWords ) { selectedWords = getWordCount(selectedStatData, this.settings.excludeURLFromWordCounts); }
										if ( this.settings.showSelectedCharacters ) { selectedCharacters = getCharacterCount(selectedStatData); }
										if ( this.settings.showSelectedSentences ) { selectedSentences = getSentenceCount(selectedStatData); }
										if ( this.settings.showSelectedParagraphs ) { selectedParagraphs = getParagraphCount(selectedStatData); }
										if ( this.settings.showSelectedLines ) { selectedLines = getLineCount(selectedStatData); }
									}
								}
							}
						} } }
					}
				}

				const cDate = moment.unix(file.stat.ctime/1000);
				const cString = cDate.format(this.settings.momentDateFormat);
				
				const mDate = moment.unix(file.stat.mtime/1000);
				const mString = mDate.format(this.settings.momentDateFormat);

				this.currentFileInfo.isText = isText;
				this.currentFileInfo.strCreated = cString;
				this.currentFileInfo.strCreatedFromNow = cDate.fromNow();
				this.currentFileInfo.strModified = mString;
				this.currentFileInfo.strModifiedFromNow = mDate.fromNow();
				this.currentFileInfo.strDisplayFile = file.name;

				if ( file.parent ) {
					this.currentFileInfo.strRelativePath = file.parent.path;
				} else {
					this.currentFileInfo.strRelativePath = file.path;
				}

				this.currentFileInfo.strFileOpen = normalizePath(this.currentFileInfo.strRelativePath + "/" + file.name);
				this.currentFileInfo.strDisplayFolder = normalizePath(this.app.vault.adapter.basePath + "/" + this.currentFileInfo.strRelativePath);
				this.currentFileInfo.strSize = formatBytes(file.stat.size,1);
				this.currentFileInfo.strFrontMatter = currentFrontMatter;
				this.currentFileInfo.isImage = isImage;
				this.currentFileInfo.numWords = currentWords;
				this.currentFileInfo.numCharacters = currentCharacters;
				this.currentFileInfo.numSentences = currentSentences;
				this.currentFileInfo.numParagraphs = currentParagraphs;
				this.currentFileInfo.numLines = currentLines;
				this.currentFileInfo.numSelectedWords = selectedWords;
				this.currentFileInfo.numSelectedCharacters = selectedCharacters;
				this.currentFileInfo.numSelectedSentences = selectedSentences;
				this.currentFileInfo.numSelectedParagraphs = selectedParagraphs;
				this.currentFileInfo.numSelectedLines = selectedLines;
				this.currentFileInfo.arrCurrentWordFrequency = currentWordFrequency;
				this.currentFileInfo.arrCurrentURLFrequency = currentURLFrequency;
				this.currentFileInfo.numImageWidth = imageWidth;
				this.currentFileInfo.numImageHeight = imageHeight;

				if ( isImage ) {
					let urlPath = file.path;
					urlPath = encodeURIComponent(urlPath);
					urlPath = "app://local/" + this.app.vault.adapter.basePath.replace(/\\/g, '/') + this.currentFileInfo.strRelativePath.replace(/\\/g, '/') + urlPath;

					const img = new Image();
					img.setAttribute('crossOrigin', 'anonymous');
					img.onload = () => {
						this.currentFileInfo.numImageWidth = img.naturalWidth;
						this.currentFileInfo.numImageHeight = img.naturalHeight;
						this.updateFileInfoDisplays();
					}
					img.onerror = (err) => {
						console.log(err);
					}
					img.src = urlPath;
				}
			}

			this.updateStatusBarItem();
			this.updateFileInfoDisplays();
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
		this.closeStatusBarPopup();
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

	createFileInfoData(): any {
		return {
			app: this.app,
			plugin: this,
			isText: 0,
			isImage: 0,
			strCreated: "",
			strCreatedFromNow: "",
			strModified: "",
			strModifiedFromNow: "",
			strDisplayFile: "",
			strDisplayFolder: "",
			strFileOpen: "",
			strSize: "",
			strRelativePath: "",
			strFrontMatter: null,
			numWords: 0,
			numCharacters: 0,
			numSentences: 0,
			numParagraphs: 0,
			numLines: 0,
			numImageWidth: 0,
			numImageHeight: 0,
			arrCurrentWordFrequency: [],
			arrCurrentURLFrequency: [],
			numSelectedWords: 0,
			numSelectedCharacters: 0,
			numSelectedSentences: 0,
			numSelectedParagraphs: 0,
			numSelectedLines: 0,
		};
	}

	updateImplementationSettings() {
		if ( ! this.settings.showPanel && ! this.settings.showStatusBarPopup ) {
			this.settings.showPanel = true;
		}

		if ( ! this.settings.showPanel ) {
			this.deactivateView();
		}

		if ( this.statusBarItem ) {
			this.statusBarItem.toggleClass("tlfFileInfoStatusBarHidden", ! this.settings.showStatusBarPopup);
		}

		if ( ! this.settings.showStatusBarPopup ) {
			this.closeStatusBarPopup();
		}
		this.updateStatusBarItem();
	}

	updateStatusBarItem() {
		if ( ! this.statusBarItem ) { return; }
		if ( this.currentFileInfo.strDisplayFile == "" ) {
			this.statusBarItem.setText("No current file");
		} else {
			this.statusBarItem.setText(this.currentFileInfo.strDisplayFile);
		}
	}

	updateFileInfoDisplays() {
		this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => {
			if (leaf.view instanceof tlfItemView) {
				Object.assign(leaf.view, this.currentFileInfo);
				leaf.view.app = this.app;
				leaf.view.plugin = this;
				leaf.view.updateDisplay();
			}
		});
		this.updateStatusBarItem();
		this.updateStatusBarPopup();
	}

	toggleStatusBarPopup() {
		if ( ! this.settings.showStatusBarPopup ) { return; }
		if ( this.statusBarPopup ) {
			this.closeStatusBarPopup();
		} else {
			this.openStatusBarPopup();
		}
	}

	openStatusBarPopup() {
		if ( ! this.statusBarItem ) { return; }
		this.closeStatusBarPopup();

		const statusBarRect = this.statusBarItem.getBoundingClientRect();
		const popup = document.body.createEl("div", { cls: "tlfFileInfoStatusPopup" });
		popup.style.right = (window.innerWidth - statusBarRect.right) + "px";
		popup.style.bottom = (window.innerHeight - statusBarRect.top + 4) + "px";

		this.statusBarPopup = popup;
		this.updateStatusBarPopup();
	}

	updateStatusBarPopup() {
		if ( ! this.statusBarPopup ) { return; }
		this.statusBarPopup.empty();
		tlfItemView.prototype.renderDisplay.call(this.currentFileInfo, this.statusBarPopup);
	}

	closeStatusBarPopup() {
		if ( this.statusBarPopup ) {
			this.statusBarPopup.remove();
			this.statusBarPopup = null;
		}
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
		if ( ! this.settings.showPanel ) {
			if ( this.settings.showStatusBarPopup ) {
				this.toggleStatusBarPopup();
			}
			return;
		}
		let found = false;
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
		if ( ! this.settings.showPanel ) { return; }
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE,
			active: true,
		});

		this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(VIEW_TYPE)[0]);
		this.updateFileInfoDisplays();
	}

}
