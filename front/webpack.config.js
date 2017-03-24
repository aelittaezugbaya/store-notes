/*eslint-disable no-var*/
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var plugins = [
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'SWTOOL_VERSION': JSON.stringify(process.env.SWTOOL_VERSION || 'DEV')
    }
  })
]

if ((process.env.NODE_ENV || 'development') === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle: {
      expect: ['exports', 'require']
    }
  }))
}

module.exports = {
  node: { fs: 'empty' },
  entry: {
    main: ['./src/index']
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'js/bundle.[hash].js'
  },
  worker: {
    output: {
      path: path.join(__dirname, '/build'),
      filename: 'js/worker.[hash].js',
      publicPath: path.join(__dirname, '/build'),
      chunkFilename: 'js/[name].worker.[chunkhash].js'
    }
  },
  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            'transform-flow-strip-types',
            'transform-class-properties',
            'transform-object-rest-spread'
          ]
        }
      },
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, loader: 'url-loader?limit=10000&mimetype=text/css&name=css/[name].[ext]' },
      { test: /\.woff$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]' },
      { test: /\.woff2$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff2&name=fonts/[name].[ext]' },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader?name=/public/img/[name].[ext]' },
      { test: /\.(eot|ttf|svg|gif)$/, loader: 'file-loader?name=fonts/[name].[ext]' }
    ]
  },
  plugins: plugins,
  resolve: {
    alias: {
      // Force all modules to use the same jquery version.
      'jquery': path.join(__dirname, 'node_modules/jquery/src/jquery')
    }
  }
}
