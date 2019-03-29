const path = require('path');
const metroBlacklist = require('metro-config/src/defaults/blacklist');

const blacklist = metroBlacklist([
  /node_modules\/react-native-google-safetynet\/tests\/.*/,
  /node_modules\/react-native-google-safetynet\/node_modules\/react-native\/.*/,
]);

module.exports = {
  resolver: {
    blacklistRE: blacklist,
    extraNodeModules: {
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
  },
};
