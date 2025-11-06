
const { getDefaultConfig } = require('expo/metro-config');


const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('js', 'jsx', 'json', 'ts', 'tsx', 'cjs');




config.resolver.extraNodeModules = {
 
  'expo-sqlite': `${__dirname}/node_modules/expo-sqlite`,
};


module.exports = config;