//var bourbon = require('node-bourbon');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*', 'del', 'streamqueue']
});

var paths = {
	src: {
		base: 'src/',
		images: 'src/images/**/*',
		sass: 'sass/base.scss',
		js:   'js/**/*.js',
		projects: 'markup/projects/**/*.md',
		blog: 'markup/blog/**/*.md',
		design: 'markup/design/**/*.md',
		layout: 'markup/layout/**/*'
	},
	vendor: {
		css: 'src/vendor/**/*.css',
		js: 'src/vendor/**/*.js'
	},
	target: {
		base: 'dist/',
		css: 'css/',
		js: 'js/',
		images: 'images/',
		blog: 'content/blog/',
		projects: 'content/projects/',
		deisgn: 'content/design/'
	}
};

//style
gulp.task('style', function () {
	return plugins.streamqueue({objectMode: true},
			gulp.src(paths.vendor.css),
			gulp.src(paths.src.base+paths.src.sass)
		    .pipe(plugins.sass({
		      includePaths: require('node-bourbon').includePaths
		    })))
		.pipe(plugins.concat('main.css'))
    	.pipe(plugins.minifyCss())
    	.pipe(gulp.dest(paths.target.base+paths.target.css));
});

//script
gulp.task('script', function(){
	return plugins.streamqueue({objectMode: true},
			gulp.src([paths.src.base+paths.src.js])
			.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter('default')),
			gulp.src(paths.vendor.js)
		)
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

/*
* function to generate json
***********************************/
function dumpJson(directory){
	return gulp.src([paths.src.base+paths.src[directory]])
		.pipe(plugins.frontMatter({property: 'meta'}))
		.pipe(plugins.data(function(file){
			file.meta.path = file.path
		}))
		.pipe(plugins.pluck('meta', directory+'.json'))
		.pipe(plugins.data(function(file){
			file.contents = new Buffer(JSON.stringify(file.meta))
		}))
		.pipe(gulp.dest(paths.target.base+paths.target[directory]));
}

gulp.task('blog:json', function(){
	return dumpJson('blog');
});

gulp.task('projects:json', function(){
	return dumpJson('projects');
});

/**********************************************/

gulp.task('markup:blog',['blog:json'], function(){
	return gulp.src([paths.src.base+paths.src.blog])
		.pipe(plugins.frontMatter())
		.pipe(plugins.markdown())
		.pipe(plugins.layout(function(file){
			return file.frontMatter;
		}))
		.pipe(gulp.dest(paths.target.base+paths.target.blog));
});

gulp.task('markup:projects',['projects:json'], function(){
	return gulp.src([paths.src.base+paths.src.projects])
		.pipe(plugins.frontMatter())
		.pipe(plugins.markdown())
		.pipe(plugins.layout(function(file){
			return file.frontMatter;
		}))
		.pipe(gulp.dest(paths.target.base+paths.target.projects));
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
	gulp.start('style', 'script', 'markup:base', 'markup:blog', 
		'markup:projects', 'images', 'watch');
});

gulp.task('watch', function(){
	gulp.watch(paths.src.base+paths.src.sass, ['style']);
	gulp.watch(paths.src.base+paths.src.js, ['script']);
	gulp.watch(paths.src.base+'*.html', ['markup:base']);
	gulp.watch(paths.src.base+paths.src.blog, ['markup:blog']);
	gulp.watch(paths.src.base+paths.src.projects, ['markup:projects']);
	gulp.watch(paths.src.base+paths.src.layout, ['makrup:blog','markup:projects']);
	gulp.watch(paths.src.base+paths.src.images, ['images']);
});
