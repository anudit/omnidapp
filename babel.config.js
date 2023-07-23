module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      '@babel/plugin-transform-flow-strip-types', //keep before plugin-transform-private-methods
      ["@babel/plugin-transform-private-methods", { "loose": true }],
      require.resolve("expo-router/babel"),
      [
        'module-resolver',
        {
          alias: {
            'fs': 'react-native-fs',
          },
        },
      ],
    ],
  };
};
