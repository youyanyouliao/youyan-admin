
// const PrerenderSPAPlugin = require('prerender-spa-plugin')

// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
// const path = require('path')

module.exports = {
    runtimeCompiler: true,
    productionSourceMap: true,
    devServer: {
        proxy: 'http://192.168.1.149:5000'
    }
}