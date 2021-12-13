/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

/* T. L. Ford */
/* https://www.Cattail.Nu */

import { App, ItemView, WorkspaceLeaf, Plugin, tlfPluginSettingTab, Setting, moment } from 'obsidian';

import { VIEW_TYPE } from "./tlfConstants";

import {
	tlfPluginSettingTab,
	tlfInterfaceSettings,
	tlfDefaultSettings
} from "./tlfPluginSettingTab";

import { tlfItemView } from "./tlfItemView";

import { formatBytes } from "./tlfUtilities";

// npm run dev

export default class tlfFileInfo extends Plugin {
	settings: tlfPluginSettingTab;

	async onload() {
		await this.loadSettings();
//		console.clear();

		var a = this.app;
		var p = this;

		this.registerView(
			VIEW_TYPE,
			(leaf) => new tlfItemView(leaf, a, p)
		);

		const ribbonIcon = this.addRibbonIcon('info', 'Cattail.Nu File Info', (evt: MouseEvent) => {
			// open or close the file info window
			this.toggleView();
		});

		this.addCommand({
			id: 'form-info-show-window',
			name: 'Show/Hide Cattail.Nu Form Info',
			callback: () => {
				// open or close the file info window
				this.toggleView();
			}
		});

		this.addSettingTab(new tlfPluginSettingTab(this.app, this));

		this.registerEvent(this.app.vault.on('create', () => {
			this.requeryStats();
		}));
		this.registerEvent(this.app.vault.on('rename', () => {
			this.requeryStats();
		}));
		this.registerEvent(this.app.vault.on('modify', () => {
			this.requeryStats();
		}));
		this.registerEvent(this.app.vault.on('delete', () => {
			this.requeryStats();
		}));
		this.registerEvent(this.app.vault.on('file-open', () => {
			this.requeryStats();
		}));
		this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
			this.requeryStats();
		}));

	} // END async onload() {


	async requeryStats() {
		var file = this.app.workspace.getActiveFile();

		this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => {
			if (leaf.view instanceof tlfItemView) {
				if (! file ) {
					leaf.view.strCreated = "";
					leaf.view.strModified = "";
					leaf.view.strFile = "";
					leaf.view.strFolder = "";
					leaf.view.strSize = "";
				} else {
					var cDate = moment.unix(file.stat.ctime/1000);
					var cString = cDate.format('llll');

					var mDate = moment.unix(file.stat.mtime/1000);
					var mString = mDate.format('llll');

					leaf.view.strCreated = cString;
					leaf.view.strCreatedFromNow = cDate.fromNow();

					leaf.view.strModified = mString;
					leaf.view.strModifiedFromNow = mDate.fromNow();

					leaf.view.strFile = file.name;
					leaf.view.strFolder = file.vault.adapter.basePath;
					leaf.view.strFullPath = file.vault.adapter.basePath + file.vault.adapter.path.sep + file.name;
					leaf.view.strSize = formatBytes(file.stat.size,1);

					leaf.view.updateDisplay();
				}
			}
		});
	}


	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign({}, tlfDefaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async deactivateView() {
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
