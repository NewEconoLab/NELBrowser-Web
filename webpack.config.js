module.exports = {
    entry: "./src/app.ts",
    output: {
        filename: "app.js",
        path: __dirname + "/dist"
    },
    devtool: "source-map",

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                use: "source-map-loader"
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            },
        ]
    },
    externals: {},
}