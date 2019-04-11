const metroBlacklist = require('metro-config/src/defaults/blacklist');

const blacklist = metroBlacklist([
  /node_modules\/.*\/node_modules\/react-native\/.*/,
]);

module.exports = {
  resolver: {
    blacklistRE: blacklist,
  },
};
