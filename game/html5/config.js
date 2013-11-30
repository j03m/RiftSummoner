var hotrConfig = {};

hotrConfig.browserDev = true;
hotrConfig.prod = true;

if (typeof module !== 'undefined' && module.exports) {
    exports.hotrConfig = hotrConfig;
}
