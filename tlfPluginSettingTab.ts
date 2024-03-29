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

	showCurrentPages: boolean;
	wordsPerPage: number;

	showSelectedWords: boolean;
	showSelectedCharacters: boolean;
	showSelectedSentences: boolean;
	showSelectedParagraphs: boolean;
	
	showWordFrequency: boolean;
	showURLFrequency: boolean;
	excludeURLFromWordCounts: boolean;

	filterFrequency: boolean;
	filterRegex: string;
	showFilteredWords: boolean;

}

export const tlfDefaultSettings = Object.freeze({
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

	showCurrentPages: true,
	wordsPerPage: 300,

	showSelectedWords: true,
	showSelectedCharacters: true,
	showSelectedSentences: true,
	showSelectedParagraphs: true,
	
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

		containerEl.createEl('h2', {text: 'File Info Panel Settings'});
	//	containerEl.createEl('p', {text: 'Reload required for changes to take effect.'});

		containerEl.createEl('h4', {text: 'File Information'});

		new Setting(containerEl)
			.setName("Show Date Created")
			.setDesc("Show the date created for the active document.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCreated);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCreated = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Date Modified")
			.setDesc("Show the date modified for the active document.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showModified);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showModified = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Date Format")
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
			.setName("Show File Size")
			.setDesc("Show the file size for the active document.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSize);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSize = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show File")
			.setDesc("Show a link to open the active document in its default application.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showFile);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showFile = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Folder")
			.setDesc("Show a link to open the folder that contains the active document.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showFolder);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showFolder = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Folder as Relative Path")
			.setDesc("Show the folder as relative to the vault rather than the file system. Clicking will still open to the file system.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showRelativeFolder);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showRelativeFolder = value;
					await this.plugin.saveSettings();
				});
		});


		containerEl.createEl('h4', {text: 'Document Statistics'});

		containerEl.createEl('p', {text: 'The following settings only work for the currently open document and only for md and txt files. Toggle the File Info Panel visibility if you change these settings.'});

		new Setting(containerEl)
			.setName("Show Character Count")
			.setDesc("Show the document's character count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentCharacters);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentCharacters = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Word Count")
			.setDesc("Show the document's word count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentWords);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentWords = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Sentence Count")
			.setDesc("Show the document's sentence count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentSentences);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentSentences = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Paragraph Count")
			.setDesc("Show the document's paragraph count. This does not count empty lines.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentParagraphs);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentParagraphs = value;
					await this.plugin.saveSettings();
				});
		});


		new Setting(containerEl)
			.setName("Show Page Count Estimate")
			.setDesc("Show the document's page count, based on the words per page setting.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showCurrentPages);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showCurrentPages = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Words Per Page")
			.setDesc("Enter a Number. How many words do you average per page?")
			.addText((cb: TextAreaComponent) => {
				cb.inputEl.setAttribute("type", "number");
				cb.setPlaceholder("300");
				cb.setValue(this.plugin.settings.wordsPerPage);
				cb.onChange((value: number) => {
					this.plugin.settings.wordsPerPage = value;
					this.plugin.saveSettings();
				});
		});

		containerEl.createEl('h4', {text: 'Document Word Frequency'});

		containerEl.createEl('p', {text: "The following settings only work for the currently open document and only for md and txt files. The extra calculations may affect Obsidian's performance, depending on the size of your documents and your system. Toggle the File Info Panel visibility if you change these settings."});

		new Setting(containerEl)
			.setName("Show a Word Frequency Report")
			.setDesc("Show a grid of words you use by frequency.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showWordFrequency);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showWordFrequency = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Filter Word Frequency Report")
			.setDesc("Filter (separate) the word frequency report using the following Regex.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.filterFrequency);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.filterFrequency = value;
					await this.plugin.saveSettings();
				});
		});


		new Setting(containerEl)
			.setName("Filter Regex")
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
			.setName("Show Filtered Words")
			.setDesc("Show the words filtered by the above regex.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showFilteredWords);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showFilteredWords = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show a URL and File Frequency Report")
			.setDesc("Show a grid of URLs and Files you mention by frequency.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showURLFrequency);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showURLFrequency = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Exclude URLs and Files From Word Frequency Report and Word Counts")
			.setDesc("Exclude URLs and Files from the word-count parsers. Does not apply to characters, sentences, paragraphs, or pages.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.excludeURLFromWordCounts);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.excludeURLFromWordCounts = value;
					await this.plugin.saveSettings();
				});
		});


		containerEl.createEl('h4', {text: 'Document Selected Text Statistics'});

		containerEl.createEl('p', {text: "The following settings only work for the currently open document and only for md and txt files. The extra calculations may affect Obsidian's performance, depending on the size of your documents and your system. Toggle the File Info Panel visibility if you change these settings."});

		new Setting(containerEl)
			.setName("Show Selected Character Count")
			.setDesc("Show the document's selected text's character count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedCharacters);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedCharacters = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Selected Word Count")
			.setDesc("Show the document's selected text's word count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedWords);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedWords = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Selected Sentence Count")
			.setDesc("Show the document's selected text's sentence count.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedSentences);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedSentences = value;
					await this.plugin.saveSettings();
				});
		});

		new Setting(containerEl)
			.setName("Show Selected Paragraph Count")
			.setDesc("Show the document's selected text's paragraph count. This does not count empty lines.")
			.addToggle((cb: ToggleComponent) => {
				cb.setValue(this.plugin.settings.showSelectedParagraphs);
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.showSelectedParagraphs = value;
					await this.plugin.saveSettings();
				});
		});



	} // display():
} // tlfPluginSettingTab
