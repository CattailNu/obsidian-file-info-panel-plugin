import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globalIgnores } from "eslint/config";

const sourceFiles = ["src/**/*.ts"];
const sourceCodeFiles = ["src/**/*.ts", "src/**/*.js", "src/**/*.jsx"];
const sourceLanguageOptions = {
	globals: {
		...globals.browser,
	},
	parserOptions: {
		project: "./tsconfig.json",
		tsconfigRootDir: import.meta.dirname,
	},
};

const moduleInspectionRules = {
	"@typescript-eslint/no-deprecated": "off",
	"import/no-extraneous-dependencies": "off",
	"import/no-nodejs-modules": "off",
	"depend/ban-dependencies": "off",
};

const withSourceLanguageOptions = (config) => ({
	...config,
	languageOptions: {
		...config.languageOptions,
		globals: {
			...sourceLanguageOptions.globals,
			...config.languageOptions?.globals,
		},
		parserOptions: {
			...config.languageOptions?.parserOptions,
			...sourceLanguageOptions.parserOptions,
		},
	},
});

const sourceRecommended = [...obsidianmd.configs.recommended].flatMap((config) => {
	if (config.files?.some((file) => file === "**/*.ts" || file === "**/*.tsx")) {
		return [withSourceLanguageOptions({
			...config,
			files: sourceFiles,
			extends: [tseslint.configs.recommended],
			rules: {
				...config.rules,
				...moduleInspectionRules,
			},
		})];
	}

	if (config.files?.some((file) => file === "**/*.js" || file === "**/*.jsx")) {
		return [{
			...config,
			files: ["src/**/*.js", "src/**/*.jsx"],
			rules: {
				...config.rules,
				...moduleInspectionRules,
			},
		}];
	}

	if (!config.files) {
		return [{
			...config,
			files: sourceCodeFiles,
		}];
	}

	return [];
});

export default tseslint.config(
	globalIgnores([
		"/*",
		"!/src",
		"!/src/**/*",
	]),
	...sourceRecommended,
	{
		files: sourceFiles,
		languageOptions: sourceLanguageOptions,
		// You can add your own configuration to override or add rules
		rules: {
			// example: turn off a rule from the recommended set
			"obsidianmd/sample-names": "error",
			// example: add a rule not in the recommended set and set its severity
			"obsidianmd/prefer-file-manager-trash-file": "error",
			...moduleInspectionRules,
		},
	},
);
