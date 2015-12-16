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
```

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

# Thanks and love
- [Parhumm](https://github.com/parhumm) for fixing windows bug in import files
- [Mjezzi](https://github.com/mjezzi) for fixing single quotes bug
- [Daviestar](https://github.com/daviestar) for fixing re-including main file bug, recursion bug, sass-not-scss bug
