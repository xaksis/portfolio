//var bourbon = require('node-bourbon');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*', 'del']
});

var paths = {
	src: {
		base: 'src/',
		images: 'src/images/**/*',
		sass: 'sass/base.scss',
		js:   'js/**/*.js',
		projects: 'markup/projects/**/*.html',
		blog: 'markup/blog/**/*.md'
	},
	target: {
		base: 'dist/',
		css: 'css/',
		js: 'js/',
		images: 'images/'
	}
};

//style
gulp.task('style', function () {
  return gulp.src(paths.src.base+paths.src.sass)
    .pipe(plugins.sass({
      includePaths: require('node-bourbon').includePaths
    }))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest(paths.target.base+paths.target.css));
});

//script
gulp.task('script', function(){
	return gulp.src(paths.src.base+paths.src.js)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('main.js'))
			.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(paths.target.base+paths.target.js));
});

//markup this is possibly 
//the most complicated bit
gulp.task('markup:base', function(){
	return gulp.src([paths.src.base+'*.html'])
		.pipe(gulp.dest(paths.target.base));
});

//Images
gulp.task('images', function() {
  return gulp.src(paths.src.base+paths.src.images)
    .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(paths.target.base+paths.target.images));
});

// Clean
gulp.task('clean', function(cb) {
    return plugins.del([paths.target.base], cb);
});

gulp.task('default',['clean'], function(){
	gulp.start('style', 'script', 'markup', 'images', 'watch');
});

gulp.task('watch', function(){
	gulp.watch(paths.src.base+paths.src.sass, ['sass']);
	gulp.watch(paths.src.base+paths.src.js, ['script']);
	gulp.watch(paths.src.base+'*.html', ['markup']);
	gulp.watch(paths.src.base+paths.src.images, ['images']);
});
