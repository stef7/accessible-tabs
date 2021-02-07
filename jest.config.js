module.exports = {
	roots: ["<rootDir>"],
	moduleFileExtensions: ["ts", "tsx", "js", "json", "jsx"],
	testPathIgnorePatterns: ["<rootDir>[/\\\\](node_modules|.next|cypress|scripts)[/\\\\]"],
	transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$"],
	transform: {
		"^.+\\.(ts|tsx|js)$": "babel-jest",
	},
	watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
	moduleNameMapper: {
		"\\.(css|less|sass|scss)$": "identity-obj-proxy",
		"\\.(gif|ttf|eot|svg|png|jpg)$": "<rootDir>/test/__mocks__/fileMock.js",
	},
	setupFilesAfterEnv: [
		// "<rootDir>/test/setup-files/configureEnzyme.ts",
		// "<rootDir>/test/setup-files/setupReactTestLibrary.ts",
	],
};
