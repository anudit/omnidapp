module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel', // Required for expo-router
      'react-native-reanimated/plugin' // Should be last in this array
    ],
  };
};
