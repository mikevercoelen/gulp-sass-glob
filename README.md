[![Package Quality](http://npm.packagequality.com/badge/gulp-sass-glob.png)](http://packagequality.com/#?package=gulp-sass-glob)

[![Package Quality](http://npm.packagequality.com/shield/gulp-sass-glob.svg)](http://packagequality.com/#?package=gulp-sass-glob)  [![Build Status](https://travis-ci.org/Apkawa/gulp-sass-glob.svg?branch=master)](https://travis-ci.org/Apkawa/gulp-sass-glob)

# gulp-sass-glob

[Gulp](http://gulpjs.com/) plugin for [gulp-sass](https://github.com/dlmanning/gulp-sass) to use glob imports.

# Install

```
npm install gulp-sass-glob --save-dev
```

# Basic Usage

main.scss

```scss
@import "vars/**/*.scss";
@import "mixins/**/*.scss";
@import "generic/**/*.scss";
@import "../components/**/*.scss";
@import "../views/**/*.scss";
@import "../views/**/*something.scss";
@import "../views/**/all.scss";
```

*NOTE*: Also support using `'` (single quotes) for example: `@import 'vars/**/*.scss';`

gulpfile.js

```javascript
var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');

gulp.task('styles', function () {
    return gulp
        .src('src/styles/main.scss')
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(gulp.dest('dist/styles'));
});
```

# Ignoring files and directories by pattern

You can optionally provide an array of paths to be ignored. Any files and directories that match any of these glob patterns are skipped.

```
gulp.task('styles', function () {
    return gulp
        .src('src/styles/main.scss')
          .pipe(sassGlob({
              ignorePaths: [
                  '**/_f1.scss',
                  'recursive/*.scss',
                  'import/**'
              ]
          }))
        .pipe(sass())
        .pipe(gulp.dest('dist/styles'));
});
```

# Troubleshooting

## Nested glob imports

`gulp-sass-glob` currently does NOT support nested glob imports i.e.

main.scss
```scss
@import 'blocks/**/*.scss';
```

blocks/index.scss
```scss
@import 'other/blocks/**/*.scss';
```

This will throw an error, because `gulp-sass-glob` does NOT read nested import structures.

### Solving nested glob imports

You have to think diffrent about your `sass` folder structure, what I suggest to do is:

* Point your gulp styles task ONLY to `main.scss`
* In `main.scss` -> ONLY in this file I use glob imports

Problem solved.

# Thanks and love
- [ViliamKopecky](https://github.com/ViliamKopecky) for fixing base path
- [gulp-sass-glob-import](https://github.com/bleuarg/gulp-sass-glob-import) for inspiration for unit tests etc.
- [Parhumm](https://github.com/parhumm) for fixing windows bug in import files
- [Mjezzi](https://github.com/mjezzi) for fixing single quotes bug
- [Daviestar](https://github.com/daviestar) for fixing re-including main file bug, recursion bug, sass-not-scss bug
- [Nirazul](https://github.com/Nirazul) for reporting the comment glob bug
- [CREEATION](https://github.com/CREEATION) for submitting a regex for comment globs


# Contribute

## Run tests
```
npm test
```
## Build dist
```
npm run compile
```

