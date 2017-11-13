
module.exports = {

  // This is the entry point or start of our react applicaton
  entry: "./src/index.js",

  // The plain compiled Javascript will be output into this file
  output: {
    filename: "public/bundle.js",
    publicPath: ASSET_PATH
  },

  // This section desribes the transformations we will perform
  module: {
    loaders: [
      {
        // Only working with files that in in a .js or .jsx extension
        test: /\.jsx?$/,
        // Webpack will only process files in our app folder. This avoids processing
        // node modules and server files unnecessarily
        include: /src/,
        loader: "babel-loader",
        query: {
          // These are the specific transformations we'll be using.
          presets: ["react", "es2015", "stage-2"]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(gif|png|jpe?g|svg|webp)$/i,
        loaders: [
          'file-loader?name=images/[name].[ext]',
        ],
      },
      {
                test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  // This lets us debug our react code in chrome dev tools. Errors will have lines and file names
  // Without this the console says all errors are coming from just coming from bundle.js
  devtool: "eval-source-map"
};
