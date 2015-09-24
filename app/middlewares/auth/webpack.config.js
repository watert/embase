var webpack = require('webpack')
module.exports = {
    // configuration
    context: __dirname + "/static/src",
    entry: "./entry",
    output: {
        path: __dirname + "/static/",
        filename: "bundle.js"
    },
    loaders:[
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel'
        }
    ],
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};
