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
  browsers: '> 5%, last 2 version, IE 10',
};

// Color options
exports.colorTheme = {
  error: 'white',
  errorBg: 'bgRed',
  success: 'white',
  successBg: 'bgGreen',
  filename: 'cyan',
  errorMessage: 'red',
};

// Receive Sass render errors in Notification Center
exports.errorNotifications = true;
