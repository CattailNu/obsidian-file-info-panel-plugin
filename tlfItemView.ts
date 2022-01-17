/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

/* T. L. Ford */
/* https://www.Cattail.Nu */

import { App, Command, ItemView, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

import { VIEW_TYPE } from "./tlfConstants";

export class tlfItemView extends ItemView {

	isText = 0;

	strCreated = "";
	strCreatedFromNow = "";
	strModified = "";
	strModifiedFromNow = "";
	strDisplayFile = "";
	strDisplayFolder = "";
	strFileOpen = "";

	strSize = "";
	strRelativePath = "";

	numWords = 0;
	numCharacters = 0;
	numSentences = 0;
	numParagraphs = 0;

	// numPages calculated on setting.

	arrCurrentWordFrequency = [];

	numSelectedWords = 0;
	numSelectedCharacters = 0;
	numSelectedSentences = 0;
	numSelectedParagraphs = 0;
	
	plugin: tlfFileInfo;

	constructor(leaf: WorkspaceLeaf, app: App, plugin: tlfFileInfo) {
		super(leaf, app, plugin);
		this.plugin = plugin;
	}

	updateDisplay() {
		const container = this.containerEl.children[1];
		container.empty();

		if ( this.strDisplayFile == "" ) {
			container.createEl("p", { text: "No current file.", cls: "tlfFileInfoLabel" });
			return;
		}

		if ( this.plugin.settings.showFile ) {
			const tlfTable2 = container.createEl("div", { cls: "tlfFileInfoTable100" } );
			const row5 = tlfTable2.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell5 = row5.createEl("div","tlfFileInfoCellButton");
				const bFile = cell5.createEl("button", { text: this.strDisplayFile, cls: "tlfFileInfoButton" });
			var iv = this;


			bFile.addEventListener("click", async (e) => {
				app.openWithDefaultApp(iv.strFileOpen);
			});
		}

		const tlfTable = container.createEl("div", { cls: "tlfFileInfoTable" });

		if ( this.plugin.settings.showModified ) {
			const row2 = tlfTable.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell3 = row2.createEl("div","tlfFileInfoCell");
				cell3.createEl("div", { text: "Modified", cls: "tlfFileInfoLabel" });

				const cell4 = row2.createEl("div","tlfFileInfoCell");
				cell4.createEl("div", { text: this.strModified, cls: "tlfFileInfoValue" });
				cell4.createEl("div", { text: this.strModifiedFromNow, cls: "tlfFileInfoValue" });
		}

		if ( this.plugin.settings.showCreated ) {
			const row1 = tlfTable.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell1 = row1.createEl("div","tlfFileInfoCell");
				cell1.createEl("div", { text: "Created", cls: "tlfFileInfoLabel" });

				const cell2 = row1.createEl("div","tlfFileInfoCell");
				cell2.createEl("div", { text: this.strCreated, cls: "tlfFileInfoValue" });

				cell2.createEl("div", { text: this.strCreatedFromNow, cls: "tlfFileInfoValue"
			});
		}


		if ( this.plugin.settings.showSize ) {
			const row4 = tlfTable.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell7 = row4.createEl("div","tlfFileInfoCell");
				cell7.createEl("div", { text: "Size", cls: "tlfFileInfoLabel" });

				const cell8 = row4.createEl("div","tlfFileInfoCell");
				cell8.createEl("div", { text: this.strSize, cls: "tlfFileInfoValue" });
		}

		if ( this.plugin.settings.showFolder ) {
			const tlfTable3 = container.createEl("div", { cls: "tlfFileInfoTable100" } );
			const row6 = tlfTable3.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell6 = row6.createEl("div","tlfFileInfoCellButton");
				var bFolder;
				if ( this.plugin.settings.showRelativeFolder ) {
					var rPath = this.strRelativePath;
					if ( rPath.slice(-1) != '/' ) { rPath += '/'; }
					bFolder = cell6.createEl("button", { text: rPath, cls: "tlfFileInfoButton" });
				} else {
					bFolder = cell6.createEl("button", { text: this.strDisplayFolder, cls: "tlfFileInfoButton" });
				}
			var iv = this;
			bFolder.addEventListener("click", async (e) => {
				app.showInFolder(iv.strFileOpen);
			});
		}

		if ( ! this.isText ) { return; }

		if ( this.plugin.settings.showCurrentWords ||
			this.plugin.settings.showCurrentCharacters ||
			this.plugin.settings.showCurrentSentences ||
			this.plugin.settings.showCurrentPages ||
			this.plugin.settings.showCurrentParagraphs ) {

			const tlfTable4 = container.createEl("div", { cls: "tlfFileInfoTable" });

			if ( this.plugin.settings.showCurrentCharacters ) {

				const row7 = tlfTable4.createEl("div", { cls: "tlfFileInfoRow" } );
			
					const cell11 = row7.createEl("div","tlfFileInfoCell");
					cell11.createEl("div", { text: "Characters", cls: "tlfFileInfoLabel" });

					const cell12 = row7.createEl("div","tlfFileInfoCell");
					cell12.createEl("div", { text: "" + this.numCharacters + "", cls: "tlfFileInfoValueNumber" });
			}

			if ( this.plugin.settings.showCurrentWords ) {

				const row6 = tlfTable4.createEl("div", { cls: "tlfFileInfoRow" } );

					const cell9 = row6.createEl("div","tlfFileInfoCell");
					cell9.createEl("div", { text: "Words", cls: "tlfFileInfoLabel" });

					const cell10 = row6.createEl("div","tlfFileInfoCell");
					cell10.createEl("div", { text: "" + this.numWords + "", cls: "tlfFileInfoValueNumber" });
			}

			if ( this.plugin.settings.showCurrentSentences ) {

				const row8 = tlfTable4.createEl("div", { cls: "tlfFileInfoRow" } );
			
					const cell13 = row8.createEl("div","tlfFileInfoCell");
					cell13.createEl("div", { text: "Sentences", cls: "tlfFileInfoLabel" });

					const cell14 = row8.createEl("div","tlfFileInfoCell");
					cell14.createEl("div", { text: "" + this.numSentences + "", cls: "tlfFileInfoValueNumber" });
			}

			if ( this.plugin.settings.showCurrentParagraphs ) {

				const row16 = tlfTable4.createEl("div", { cls: "tlfFileInfoRow" } );
			
					const cell26 = row16.createEl("div","tlfFileInfoCell");
					cell26.createEl("div", { text: "Paragraphs", cls: "tlfFileInfoLabel" });

					const cell27 = row16.createEl("div","tlfFileInfoCell");
					cell27.createEl("div", { text: "" + this.numParagraphs + "", cls: "tlfFileInfoValueNumber" });
			}

			if ( this.plugin.settings.showCurrentPages ) {

				const row12 = tlfTable4.createEl("div", { cls: "tlfFileInfoRow" } );
		
					const cell21 = row12.createEl("div","tlfFileInfoCell");
					cell21.createEl("div", { text: "Est. Pages", cls: "tlfFileInfoLabel" });

					var wordsPerPage = Number(this.plugin.settings.wordsPerPage);
					var currentWords = this.numWords;

					var estPages = "";
					if ( (typeof wordsPerPage !== "number" || isNaN(wordsPerPage)) ||
						(typeof currentWords !== "number" || isNaN(currentWords)) ) {
						estPages = "Words Per Page Setting Is Not Valid";
					} else {
						if ( wordsPerPage < 1 ) { wordsPerPage = 1 };
						let eP = Number(this.numWords) / wordsPerPage;
						eP = Number(eP.toFixed(2));
						estPages = ""+eP+"";
					}

					const cell22 = row12.createEl("div","tlfFileInfoCell");
					cell22.createEl("div", { text: "" + estPages + "", cls: "tlfFileInfoValueNumber" });
			}

		}

		if ( this.plugin.settings.showWordFrequency ) {

			var report = "";
			var reportRegex = "";
			if (this.arrCurrentWordFrequency.length > 0) {

				if ( this.plugin.settings.filterFrequency && (this.plugin.settings.filterRegex.length > 0) ) {

					// the settings plugin auto-escapes the \'s.
//					const regex = "(\\ba\\b)|(\\bthe(.)*\\b)|((.)*st\\b)";
					const regex = this.plugin.settings.filterRegex;

					const pattern = new RegExp(regex);

					for (let i in this.arrCurrentWordFrequency) {
						var word = String(this.arrCurrentWordFrequency[i][0]);
						var find = word.match(pattern);

						if ( find ) {
							reportRegex += this.arrCurrentWordFrequency[i][1] + ", " + this.arrCurrentWordFrequency[i][0] + "\n";
						} else {
							report += this.arrCurrentWordFrequency[i][1] + ", " + this.arrCurrentWordFrequency[i][0] + "\n";
						}
					}
				} else {
					for (let i in this.arrCurrentWordFrequency) {
							report += this.arrCurrentWordFrequency[i][1] + ", " + this.arrCurrentWordFrequency[i][0] + "\n";
					}

				}
			}

			const tlfTable6 = container.createEl("div", { cls: "tlfFileInfoTable100" });
				const row13 = tlfTable6.createEl("div", { cls: "tlfFileInfoRow" } );
					const cell23 = row13.createEl("div","tlfFileInfoCell");
					cell23.createEl("div", { text: "Word Frequency", cls: "tlfFileInfoLabel" });

				const row14 = tlfTable6.createEl("div", { cls: "tlfFileInfoRow" } );
					const cell24 = row14.createEl("div","tlfFileInfoCell");
					cell24.createEl("textarea", { text: report, cls: "tlfFileInfoTextArea" });

				if ( this.plugin.settings.filterFrequency && (this.plugin.settings.filterRegex.length > 0) && this.plugin.settings.showFilteredWords ) {

					const row15 = tlfTable6.createEl("div", { cls: "tlfFileInfoRow" } );
						const cell25 = row15.createEl("div","tlfFileInfoCell");
						cell25.createEl("div", { text: "Filtered by Setting:", cls: "tlfFileInfoLabel" });
						cell25.createEl("textarea", { text: reportRegex, cls: "tlfFileInfoTextArea" });
				}		
		}


		if ( this.plugin.settings.showSelectedWords ||
			this.plugin.settings.showSelectedCharacters ||
			this.plugin.settings.showSelectedSentences ||
			this.plugin.settings.showSelectedParagraphs ) {

			const tlfTable5 = container.createEl("div", { cls: "tlfFileInfoTable" });

			if ( this.plugin.settings.showSelectedCharacters ) {

				const row9 = tlfTable5.createEl("div", { cls: "tlfFileInfoRow" } );
			
					const cell15 = row9.createEl("div","tlfFileInfoCell");
					cell15.createEl("div", { text: "Selected Characters", cls: "tlfFileInfoLabel" });

					const cell16 = row9.createEl("div","tlfFileInfoCell");
					cell16.createEl("div", { text: "" + this.numSelectedCharacters + "", cls: "tlfFileInfoValueNumber" });
			}

			if ( this.plugin.settings.showSelectedWords ) {

				const row10 = tlfTable5.createEl("div", { cls: "tlfFileInfoRow" } );

					const cell17 = row10.createEl("div","tlfFileInfoCell");
					cell17.createEl("div", { text: "Selected Words", cls: "tlfFileInfoLabel" });

					const cell18 = row10.createEl("div","tlfFileInfoCell");
					cell18.createEl("div", { text: "" + this.numSelectedWords + "", cls: "tlfFileInfoValueNumber" });
			}

			if ( this.plugin.settings.showSelectedSentences ) {

				const row11 = tlfTable5.createEl("div", { cls: "tlfFileInfoRow" } );
			
					const cell19 = row11.createEl("div","tlfFileInfoCell");
					cell19.createEl("div", { text: "Selected Sentences", cls: "tlfFileInfoLabel" });

					const cell20 = row11.createEl("div","tlfFileInfoCell");
					cell20.createEl("div", { text: "" + this.numSelectedSentences + "", cls: "tlfFileInfoValueNumber" });
			}

			if ( this.plugin.settings.showSelectedParagraphs ) {

				const row17 = tlfTable5.createEl("div", { cls: "tlfFileInfoRow" } );
			
					const cell28 = row17.createEl("div","tlfFileInfoCell");
					cell28.createEl("div", { text: "Selected Paragraphs", cls: "tlfFileInfoLabel" });

					const cell29 = row17.createEl("div","tlfFileInfoCell");
					cell29.createEl("div", { text: "" + this.numSelectedParagraphs + "", cls: "tlfFileInfoValueNumber" });
			}


		}

	} // end updateDisplay()

	getViewType() {
		return VIEW_TYPE;
	}

	getDisplayText() {
		return "File Info View";
	}

	async onOpen() {

		this.updateDisplay();
	}

	async onClose() {
	}
}
