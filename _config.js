// Sass render options
// https://github.com/sass/node-sass#options
exports.sass = {
  includePath: __dirname,
  outputStyle: 'compressed',
  sourceMap: true,
  sourceMapEmbed: true,
};

// Autoprefixer options
// https://github.com/postcss/autoprefixer#options
exports.autoprefixer = {
  browsers: '> 5%',
};
