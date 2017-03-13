# Polaris

A Sass starter kit.

## Setup

1. Clone this repo or download the zip into your project.
2. Run `npm install`
3. Run `npm run build` to compile

## Build

```bash
npm run build [--output_dir <path>]
```

This task will compile a new `.css` file for each `.scss` in the root of this directory. Out of the box, `print.css` and `style.css` will be created.

The `build` task accepts one argument, `--output_dir [path]`. If not specified all compiled stylesheets will be created in the current working directory. This allows a parent app to run this directory's `build` script and pass in the desired output path.

Check out `_build.js` to see what it happening under the hood.

### Configuration

Configuration for Sass#render and autoprefixer can be updated in `_config.js`.

### Example

If the sass starter was copied to `~/projects/my-project/_src/sass/`, then a very basic `package.json` for `my-project` with scripts to compile sass might look like this.

**~/projects/my-project/package.json**

```json
{
  "name": "my-project",
  "scripts": {
    "build:sass": "cd _src/sass && npm run build -- --output_dir assets/css/",
    "watch:sass": "chokidar \"_src/sass/**/*.+(scss|sass)\" -c \"npm run build:sass\""
  },
  "devDependencies": {
    "chokidar-cli": "latest"
  }
}
```