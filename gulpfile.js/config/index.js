var config = {};

config.publicDirectory = "./lib";
config.sourceDirectory = "./src";
config.publicAssets    = config.publicDirectory + "/";
config.sourceAssets    = config.sourceDirectory + "/";
config.publicTemp    = config.publicDirectory + "/.temp";

module.exports = config;
