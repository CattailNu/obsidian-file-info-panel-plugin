/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

/* T. L. Ford */
/* https://www.Cattail.Nu

20230112 updated to include url frequency
 */

import { App, PluginSettingTab, Setting } from "obsidian";

import tlfFileInfo from "./main";


import { COMMON_ENGLISH_WORDS } from "./tlfConstants";

//import { INTERVAL_MINUTES } from "./tlfConstants";


export interface tlfInterfaceSettings {
	showPanel: boolean;
	showStatusBarPopup: boolean;

	showCreated: boolean;
	showModified: boolean;
	momentDateFormat: string;
	showFile: boolean;
	showFolder: boolean;
	showRelativeFolder: boolean;
	showSize: boolean;

	showCurrentWords: boolean;
	showCurrentCharacters: boolean;
	showCurrentSentences: boolean;
	showCurrentParagraphs: boolean;
	showCurrentLines: boolean;

	showCurrentPages: boolean;
	wordsPerPage: number;

	showSelectedWords: boolean;
	showSelectedCharacters: boolean;
	showSelectedSentences: boolean;
	showSelectedParagraphs: boolean;
	showSelectedLines: boolean;

	includeFrontMatterAsText: boolean;
	showFrontMatterInPanel: boolean;
	
	showWordFrequency: boolean;
	showURLFrequency: boolean;
	excludeURLFromWordCounts: boolean;

	filterFrequency: boolean;
	filterRegex: string;
	showFilteredWords: boolean;

}

export const tlfDefaultSettings = Object.freeze({
	showPanel: true,
	showStatusBarPopup: false,

	showCreated: true,
	showModified: true,
	momentDateFormat: "llll",
	showFile: true,
	showFolder: true,
	showRelativeFolder: false,
	showSize: true,

	showCurrentWords: true,
	showCurrentCharacters: true,
	showCurrentSentences: true,
	showCurrentParagraphs: true,
	showCurrentLines: true,

	showCurrentPages: true,
	wordsPerPage: 300,

	showSelectedWords: true,
	showSelectedCharacters: true,
	showSelectedSentences: true,
	showSelectedParagraphs: true,
	showSelectedLines: true,

	includeFrontMatterAsText: true,
	showFrontMatterInPanel: false,
	
	showWordFrequency: true,
	showURLFrequency: true,
	excludeURLFromWordCounts: true,

	filterFrequency: true,
	filterRegex: COMMON_ENGLISH_WORDS,
	showFilteredWords: true,

});

export class tlfPluginSettingTab extends PluginSettingTab {
	plugin: tlfFileInfo;

	constructor(app: App, plugin: tlfFileInfo) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("File info panel settings")
			.setHeading();
	//	containerEl.createEl('p', {text: 'Reload required for changes to take effect.'});

		new Setting(containerEl)
			.setName("Implementation")
			.setHeading();

		new Setting(containerEl)
			.setName("Show panel")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showPanel);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showPanel = value;
					if ( ! this.plugin.settings.showPanel && ! this.plugin.settings.showStatusBarPopup ) {
						this.plugin.settings.showStatusBarPopup = true;
					}
					await this.plugin.saveSettings();
					this.plugin.updateImplementationSettings();
					this.display();
				});
		});

		new Setting(containerEl)
			.setName("Show status bar popup")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showStatusBarPopup);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showStatusBarPopup = value;
					if ( ! this.plugin.settings.showPanel && ! this.plugin.settings.showStatusBarPopup ) {
						this.plugin.settings.showPanel = true;
					}
					await this.plugin.saveSettings();
					this.plugin.updateImplementationSettings();
					this.display();
				});
		});

		new Setting(containerEl)
			.setName("File information")
			.setHeading();

		new Setting(containerEl)
			.setName("Show date created")
			.setDesc("Show the date created for the active document.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCreated);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCreated = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show date modified")
			.setDesc("Show the date modified for the active document.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showModified);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showModified = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Date format")
			.setDesc(
				createFragment((frag) => {
					frag.appendText("Date format using moment.js token syntax. ");
					frag.appendText("The human readable text will always be added. ");
					frag.appendText("Use a single space to skip the first line formatted date and only see the human readable line.");
					frag.createEl('br');
					frag.createEl('a', {text: "https://momentjs.com/docs/#/displaying/", href: "https://momentjs.com/docs/#/displaying/"});
				})
			)
			.addText((cb: TextAreaComponent) => {
				cb.setPlaceholder("llll");
				cb.setValue(this.plugin.settings.momentDateFormat);
				cb.onChange((value: string) => {
					this.plugin.settings.momentDateFormat = value;
					this.plugin.saveSettings();
				});
		});



		new Setting(containerEl)
			.setName("Show file size")
			.setDesc("Show the file size for the active document.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSize);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSize = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show file")
			.setDesc("Show a link to open the active document in its default application.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showFile);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showFile = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show folder")
			.setDesc("Show a link to open the folder that contains the active document.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showFolder);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showFolder = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show folder as relative path")
			.setDesc("Show the folder as relative to the vault rather than the file system. Clicking will still open to the file system.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showRelativeFolder);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showRelativeFolder = value;
					await this.plugin.saveSettings();
				});
		});


		new Setting(containerEl)
			.setName("Document statistics")
			.setHeading();

		containerEl.createEl('p', {text: 'The following settings only work for the currently open document and only for md and txt files. Toggle the visibility if you change these settings.'});

		new Setting(containerEl)
			.setName("Show character count")
			.setDesc("Show the document's character count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentCharacters);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentCharacters = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show word count")
			.setDesc("Show the document's word count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentWords);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentWords = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show sentence count")
			.setDesc("Show the document's sentence count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentSentences);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentSentences = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show paragraph count")
			.setDesc("Show the document's paragraph count. This does not count empty lines.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentParagraphs);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentParagraphs = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show line count")
			.setDesc("Show the document's line count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentLines);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentLines = value;
					await this.plugin.saveSettings();
				});
		});


		new Setting(containerEl)
			.setName("Show page count estimate")
			.setDesc("Show the document's page count, based on the words per page setting.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentPages);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentPages = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Words per page")
			.setDesc("Enter a number. How many words do you average per page?")
			.addText((cb: TextAreaComponent) => {
				cb.inputEl.setAttribute("type", "number");
				cb.setPlaceholder("300");
				cb.setValue(this.plugin.settings.wordsPerPage);
				cb.onChange((value: number) => {
					this.plugin.settings.wordsPerPage = value;
					this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Document word frequency")
			.setHeading();

		containerEl.createEl('p', {text: "The following settings only work for the currently open document and only for md and txt files. The extra calculations may affect obsidian's performance, depending on the size of your documents and your system. Toggle the visibility if you change these settings."});

		new Setting(containerEl)
			.setName("Show a word frequency report")
			.setDesc("Show a grid of words you use by frequency.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showWordFrequency);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showWordFrequency = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Filter word frequency report")
			.setDesc("Filter (separate) the word frequency report using the following regex.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.filterFrequency);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.filterFrequency = value;
					await this.plugin.saveSettings();
				});
		});


		new Setting(containerEl)
			.setName("Filter regex")
			.setDesc(
				createFragment((frag) => {
					frag.appendText(
						"Regex. Do not include the outside /'s."
					);
					frag.createEl('br');
					frag.appendText(
						"For filter regex help and examples, see: "
					);
					frag.createEl('br');
					frag.createEl('a', {text: "https://cattail.nu/obsidian/filePluginRegexHelper.html", href: "https://cattail.nu/obsidian/filePluginRegexHelper.html"});
				})
			)
			.addText((cb: TextAreaComponent) => {
				cb.setPlaceholder(COMMON_ENGLISH_WORDS);
				cb.setValue(this.plugin.settings.filterRegex);
				cb.onChange((value: string) => {
					this.plugin.settings.filterRegex = value;
					this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show filtered words")
			.setDesc("Show the words filtered by the above regex.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showFilteredWords);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showFilteredWords = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show a url and file frequency report")
			.setDesc("Show a grid of urls and files you mention by frequency.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showURLFrequency);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showURLFrequency = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Exclude urls and files from word frequency report and word counts")
			.setDesc("Exclude urls and files from the word-count parsers. Does not apply to characters, sentences, paragraphs, lines, or pages.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.excludeURLFromWordCounts);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.excludeURLFromWordCounts = value;
					await this.plugin.saveSettings();
				});
		});


		new Setting(containerEl)
			.setName("Document selected text statistics")
			.setHeading();

		containerEl.createEl('p', {text: "The following settings only work for the currently open document and only for md and txt files. The extra calculations may affect obsidian's performance, depending on the size of your documents and your system. Toggle the visibility if you change these settings."});

		new Setting(containerEl)
			.setName("Show selected character count")
			.setDesc("Show the document's selected text's character count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedCharacters);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedCharacters = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show selected word count")
			.setDesc("Show the document's selected text's word count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedWords);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedWords = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show selected sentence count")
			.setDesc("Show the document's selected text's sentence count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedSentences);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedSentences = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show selected paragraph count")
			.setDesc("Show the document's selected text's paragraph count. This does not count empty lines.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedParagraphs);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedParagraphs = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show selected line count")
			.setDesc("Show the document's selected text's line count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedLines);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedLines = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Front matter")
			.setHeading();

		containerEl.createEl('p', {text: 'Front matter is defined by --- at the top of the file, followed by the properties, and ending with ---.'});

		new Setting(containerEl)
			.setName("Include front matter as text")
			.setDesc("Includes front matter in all operations (counts, filters, etc.).")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.includeFrontMatterAsText);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.includeFrontMatterAsText = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show front matter in panel")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showFrontMatterInPanel);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showFrontMatterInPanel = value;
					await this.plugin.saveSettings();
				});
		});



	} // display():
} // tlfPluginSettingTab
