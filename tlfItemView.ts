/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

/* T. L. Ford */
/* https://www.Cattail.Nu */

import { App, Command, ItemView, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { VIEW_TYPE } from "./tlfConstants";

export class tlfItemView extends ItemView {

	strCreated = "";
	strCreatedFromNow = "";
	strModified = "";
	strModifiedFromNow = "";
	strFile = "";
	strFolder = "";
	strSize = "";
	strFullPath = "";
	plugin: tlfFileInfo;

	constructor(leaf: WorkspaceLeaf, app: App, plugin: tlfFileInfo) {
		super(leaf, app, plugin);
		this.plugin = plugin;
	}

	updateDisplay() {
		const container = this.containerEl.children[1];
		container.empty();

		if ( this.plugin.settings.showFile ) {
			const tlfTable2 = container.createEl("div", { cls: "tlfFileInfoTable" } );
			const row5 = tlfTable2.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell5 = row5.createEl("div","tlfFileInfoCell");
				const bFile = cell5.createEl("button", { text: this.strFile, cls: "tlfFileInfoButton" });
			var iv = this;
			bFile.addEventListener("click", async (e) => {
				app.openWithDefaultApp(iv.strFile);
			});
		}

		const tlfTable = container.createEl("div", { cls: "tlfFileInfoTable" });

		if ( this.plugin.settings.showModified ) {
			const row2 = tlfTable.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell3 = row2.createEl("div","tlfFileInfoCell");
				cell3.createEl("div", { text: "Modified On", cls: "tlfFileInfoLabel" });

				const cell4 = row2.createEl("div","tlfFileInfoCell");
				cell4.createEl("div", { text: this.strModified, cls: "tlfFileInfoValue" });
				cell4.createEl("div", { text: this.strModifiedFromNow, cls: "tlfFileInfoValue" });
		}

		if ( this.plugin.settings.showCreated ) {
			const row1 = tlfTable.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell1 = row1.createEl("div","tlfFileInfoCell");
				cell1.createEl("div", { text: "Created On", cls: "tlfFileInfoLabel" });

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
			const tlfTable3 = container.createEl("div", { cls: "tlfFileInfoTable" } );
			const row6 = tlfTable3.createEl("div", { cls: "tlfFileInfoRow" } );

				const cell6 = row6.createEl("div","tlfFileInfoCell");
				const bFolder = cell6.createEl("button", { text: this.strFolder, cls: "tlfFileInfoButton" });

			var iv = this;

			bFolder.addEventListener("click", async (e) => {
				app.showInFolder(iv.strFile);
			});
		}
	
	}

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
	// Nothing to clean up.
	}
}
