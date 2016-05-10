'use strict';

const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const postcss = require('postcss');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const config = require('./_config.js');
const clc = require('cli-color');

/**
 * Returns the resolved output file path for the compiled stylesheets
 * @return {String} The destination dir
 */
function getDestPath(file) {
  const flag = '--output_dir';
  const optionIndex = process.argv.indexOf(flag);
  const destDir = optionIndex !== -1 ? process.argv[optionIndex + 1] : process.cwd();
  const filename = path.parse(file).name;

  // Throw an error when the --output_dir flag is used but no path is given
  if (typeof destDir === 'undefined') {
    console.log(new Error(`Don\'t forget to declare a path with the --output_dir flag!
    Example: "node _build.js --output_dir path/to/output/dir/"`));
    return process.exit(1);
  }

  return path.resolve(destDir, `${filename}.css`);
}

/**
 * Get a prettified error message
 * @param  {[type]} error [description]
 * @return {[type]}       [description]
 */
function getError(error) {
  const _error = (typeof error === 'string') ? { message: error } : error;

  const errorMsg = clc.white.bgRedBright;
  const cyan = clc.cyanBright;
  const red = clc.red;
  let renderedMessage = ` ${errorMsg(' ERROR ')}`;

  renderedMessage += ` ${red(_error.message)}\n`;

  if (_error.file) {
    renderedMessage += `  in ${cyan(_error.file)}`;
  }

  if (_error.line) {
    renderedMessage += `:${cyan(_error.line)}`;
  }

  if (_error.column) {
    renderedMessage += `:${cyan(_error.column)}`;
  }

  if (_error.srcFile) {
    renderedMessage += `\n  from ${cyan(_error.srcFile)}`;
  }

  renderedMessage += '\n';

  return renderedMessage;
}

// Looks for each SCSS or Sass file
glob(path.resolve(__dirname, '*.+(scss|sass)'), (err, files) => {
  if (err) {
    console.log(getError(err));
    return;
  }

  files.forEach(file => {
    sass.render(Object.assign({}, config.sass, { file }), (renderErr, result) => {
      if (renderErr) {
        const error = renderErr;
        error.srcFile = file;
        console.log(getError(renderErr));
        return;
      }

      postcss()
        .use(autoprefixer(config.autoprefixer))
        .process(result.css)
        .then(processedResult => {
          const dest = getDestPath(file);

          fs.writeFile(dest, processedResult.css, writeErr => {
            if (writeErr) {
              console.log(getError(writeErr));
              return;
            }

            const srcRelative = path.relative(process.cwd(), file);
            const destRelative = path.relative(process.cwd(), dest);
            const success = clc.white.bgGreenBright;
            const cyan = clc.cyanBright;

            console.log(` ${success(' SUCCESS ')} Compiled ${cyan(srcRelative)} => ${cyan(destRelative)}`);
            return;
          });
        });

      return;
    });
  });

  return;
});
