
module.exports = {
    plugins: {
        autoprefixer: {
            overrideBrowserslist: [
                "Android 4.1",
                "IOS 7.1",
                "FF > 31",
                "ie >= 8",
                "last 10 versions"
            ],
            grid: true
        },
        'postcss-px-to-viewport-8-plugin': {
            viewportWidth: 375,
        },
    }
}