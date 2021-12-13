/* obsidian-file-info-panel-plugin */
/* https://github.com/CattailNu/obsidian-file-info-panel-plugin */

/* T. L. Ford */
/* https://www.Cattail.Nu */

import { App, PluginSettingTab, Setting } from "obsidian";

export interface tlfInterfaceSettings {
	showCreated: boolean;
	showModified: boolean;
	showFile: boolean;
	showFolder: boolean;
	showSize: boolean;
}

export const tlfDefaultSettings = Object.freeze({
	showCreated: true,
	showModified: true,
	showFile: true,
	showFolder: true,
	showSize: true,
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

		containerEl.createEl('h2', {text: 'File Info Settings'});
	//	containerEl.createEl('p', {text: 'Reload required for changes to take effect.'});

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
	}
}
