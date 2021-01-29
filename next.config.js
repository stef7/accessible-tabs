const path = require("path");

module.exports = {
	sassOptions: {
		includePaths: [
			path.join(__dirname, "styles"),
			path.join(__dirname, "components"),
			path.join(__dirname, "components", "**"),
		],
	},
	webpack: (config, { isServer }) => {
		// Fixes npm packages that depend on `fs` module
		if (!isServer) {
			config.node = {
				fs: "empty",
			};
		}

		return config;
	},
};
