var bourbon = require('node-bourbon');
var sass = require('gulp-sass');
var layout = require('gulp-layout');

gulp.task('sass', function () {
  gulp.src('src/sass/base.scss')
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths
    }))
    .pipe(gulp.dest('dist/css/main.css'));
});