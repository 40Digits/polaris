'use strict';

const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const postcss = require('postcss');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const colors = require('colors');
const notifier = require('node-notifier');

const config = require('./_config.js');

colors.setTheme(config.colorTheme);

/**
 * Returns the resolved output file path for the compiled stylesheets
 * @return {String} The destination dir
 */
function getDestinationPath(file) {
  const flag = '--output_dir';
  const flagIndex = process.argv.indexOf(flag);
  const flagValue = process.argv[flagIndex + 1];
  const destinationDir = flagIndex !== -1 ? flagValue : process.cwd();
  const filename = path.parse(file).name;

  // Throw an error when the --output_dir flag is used but no path is given
  if (typeof destinationDir === 'undefined') {
    console.log(new Error(`Don\'t forget to declare a path with the --output_dir flag!
    Example: "node _build.js --output_dir path/to/output/dir/"`));
    return process.exit(1);
  }

  return path.resolve(destinationDir, `${filename}.css`);
}

/**
 * Get a prettified error message
 * @param  {[type]} error [description]
 * @return {[type]}       [description]
 */
function getError(error) {
  const errorObj = (typeof error === 'string') ? { message: error } : error;
  let renderedMessage = ' ERROR '.error.errorBg;

  renderedMessage += ` ${colors.errorMessage(errorObj.message)}\n`;

  if (errorObj.file) {
    renderedMessage += `  in ${colors.filename(errorObj.file)}`;
  }

  if (errorObj.line) {
    renderedMessage += `:${colors.filename(errorObj.line)}`;
  }

  if (errorObj.column) {
    renderedMessage += `:${colors.filename(errorObj.column)}`;
  }

  if (errorObj.srcFile) {
    renderedMessage += `\n  from ${colors.filename(errorObj.srcFile)}`;
  }

  renderedMessage += '\n';

  return renderedMessage;
}

// Looks for each SCSS or SASS file
glob(path.resolve(__dirname, '*.+(scss|sass)'), (err, files) => {
  if (err) {
    console.log(getError(err));
    return;
  }

  files.forEach(file => {
    sass.render(Object.assign({}, config.sass, { file }), (renderError, result) => {
      if (renderError) {
        const error = renderError;
        error.srcFile = file;
        console.log(getError(renderError));

        if (config.errorNotifications) {
          notifier.notify({
            title: 'Sass Compile Error',
            message: renderError.message,
          });
        }

        return;
      }

      postcss()
        .use(autoprefixer(config.autoprefixer))
        .process(result.css)
        .then(processedResult => {
          const destination = getDestinationPath(file);

          fs.writeFile(destination, processedResult.css, writeError => {
            if (writeError) {
              console.log(getError(writeError));
              return;
            }

            const srcRelative = path.relative(process.cwd(), file);
            const destRelative = path.relative(process.cwd(), destination);
            const successMessage = ' SUCCESS '.success.successBg;

            console.log(`${successMessage}`
              + ` Compiled ${colors.filename(srcRelative)} => ${colors.filename(destRelative)}`);
            return;
          });
        });

      return;
    });
  });

  return;
});
