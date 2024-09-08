import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default [
	{
		files: ["src/**/*.{tsx,ts,mts,mjs,js,jsx}", "eslint.config.js"],
		plugins: {
			"simple-import-sort": simpleImportSort,
			"unused-imports": unusedImports,
		},
		languageOptions: {
			globals: globals.browser
		},
		rules: {

			"yoda": "error",
			"eqeqeq": ["error", "always", { "null": "ignore" }],
			"prefer-destructuring": ["error", {
				"VariableDeclarator": { "array": false, "object": true },
				"AssignmentExpression": { "array": false, "object": false }
			}],
			"operator-assignment": ["error", "always"],
			"no-useless-computed-key": "error",
			"no-unused-vars": "error",
			"no-unneeded-ternary": ["error", { "defaultAssignment": false }],
			"no-invalid-regexp": "error",
			"no-constant-condition": ["error", { "checkLoops": false }],
			"no-duplicate-imports": "error",
			"dot-notation": "error",
			"no-useless-escape": "error",
			"no-fallthrough": "error",
			"for-direction": "error",
			"no-async-promise-executor": "error",
			"no-cond-assign": "error",
			"no-dupe-else-if": "error",
			"no-duplicate-case": "error",
			"no-irregular-whitespace": "error",
			"no-loss-of-precision": "error",
			"no-misleading-character-class": "error",
			"no-prototype-builtins": "error",
			"no-regex-spaces": "error",
			"no-shadow-restricted-names": "error",
			"no-unexpected-multiline": "error",
			"no-unsafe-optional-chaining": "error",
			"no-useless-backreference": "error",
			"use-isnan": "error",
			"prefer-const": "error",
			"prefer-spread": "error",

			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"unused-imports/no-unused-imports": "error",
		}
	},
];
