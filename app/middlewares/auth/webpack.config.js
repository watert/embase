var webpack = require('webpack')
module.exports = {
    // configuration
    context: __dirname + "/public/src",
    entry: "./entry",
    output: {
        path: __dirname + "/public/",
        filename: "bundle.js"
    },
    module:{
        loaders:[
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel'
            }
        ]},
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
