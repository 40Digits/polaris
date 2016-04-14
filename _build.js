'use strict';

const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const postcss = require('postcss');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const config = require('./_config.js');

glob(path.resolve(__dirname, '*.+(scss|sass)'), (err, files) => {
  if (err) {
    return console.log(err);
  }

  files.forEach(file => {
    sass.render(Object.assign({}, config.sass, { file }), (err, result) => {
      if (err) {
        return console.log(err);
      }

      postcss()
        .use(autoprefixer(config.autoprefixer))
        .process(result.css)
        .then(result => {
          const dest = getDestPath(file);

          fs.writeFile(dest, result.css, err => {
            if (err) {
              return console.log(err);
            }

            const srcRelative = path.relative(process.cwd(), file);
            const destRelative = path.relative(process.cwd(), dest);

            console.log(`Sass compiled! ${srcRelative} => ${destRelative}`);
          })
        });
    });
  });
});

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
