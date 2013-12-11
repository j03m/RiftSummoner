var hotrConfig = {};

hotrConfig.browserDev = true;
hotrConfig.prod = false;

if (typeof module !== 'undefined' && module.exports) {
    exports.hotrConfig = hotrConfig;
}
