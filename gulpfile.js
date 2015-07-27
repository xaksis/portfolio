//var bourbon = require('node-bourbon');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*', 'del', 'streamqueue']
});

var paths = {
	src: {
		base: 'src/',
		allMd: 'markup/**/*.md',
		templates: 'markup/templates/**/*.hbs',
		img: 'images/**/*',
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
	icon: 'src/vendor/icons/**/*',
	target: {
		base: 'dist/',
		css: 'css/',
		js: 'js/',
		img: 'images/',
		blog: 'content/blog/',
		projects: 'content/projects/',
		deisgn: 'content/design/'
	}
};

gulp.task('icons', function(){
	return gulp.src([paths.icon])
		.pipe(gulp.dest(paths.target.base+paths.target.css));
});

//style
gulp.task('style', function () {
	return plugins.streamqueue({objectMode: true},
			gulp.src([paths.vendor.css, '!'+paths.icon]),
			gulp.src(paths.src.base+paths.src.sass)
		    .pipe(plugins.sass({
		      includePaths: require('node-bourbon').includePaths
		    })))
		.pipe(plugins.concat('main.css'))
    	.pipe(plugins.minifyCss())
    	.pipe(gulp.dest(paths.target.base+paths.target.css))
    	.pipe(plugins.connect.reload());
});

//script
gulp.task('script', function(){
	return plugins.streamqueue({objectMode: true},
			//vendor files first
			gulp.src(paths.vendor.js),
			//project specific js files
			gulp.src([paths.src.base+paths.src.js])
			.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter('default')),
			//templates
			gulp.src([paths.src.base+paths.src.templates])
			    .pipe(plugins.handlebars())
			    .pipe(plugins.wrap('Handlebars.template(<%= contents %>)'))
			    .pipe(plugins.declare({
			      namespace: 'pApp.templates',
			      noRedeclare: true, // Avoid duplicate declarations 
			    }))
			    .pipe(plugins.concat('templates.js'))
		)
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.concat('main.js'))
			.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(paths.target.base+paths.target.js))
    	.pipe(plugins.connect.reload());
});

//markup this is possibly 
gulp.task('markup:base', function(){
	return gulp.src([paths.src.base+'*.html'])
		.pipe(gulp.dest(paths.target.base))
    	.pipe(plugins.connect.reload());
});

/*
* function to generate json
***********************************/
function dumpJson(directory){
	return gulp.src(paths.src.base+paths.src[directory], {base: paths.src.base + 'markup'})
		.pipe(plugins.frontMatter({property: 'meta'}))
		.pipe(plugins.data(function(file){
			file.meta.path = file.relative;
			if(!file.meta.createDate)
				file.meta.createDate = file.stat.birthtime;
		}))
		.pipe(plugins.pluck('meta', directory+'.json'))
		.pipe(plugins.data(function(file){
			file.contents = new Buffer(JSON.stringify(file.meta))
		}))
		//.pipe(gulp.dest(paths.target.base+paths.target[directory]));
		.pipe(gulp.dest(paths.target.base+'content/'));
}

gulp.task('contentJson', function(){
	return dumpJson('allMd')
    	.pipe(plugins.connect.reload());
});

/**********************************************/

gulp.task('markup:blog', function(){
	return gulp.src([paths.src.base+paths.src.blog])
		.pipe(plugins.frontMatter())
		.pipe(plugins.markdown())
		.pipe(plugins.layout(function(file){
			return file.frontMatter;
		}))
		.pipe(gulp.dest(paths.target.base+paths.target.blog))
    	.pipe(plugins.connect.reload());
});

gulp.task('markup:projects', function(){
	return gulp.src([paths.src.base+paths.src.projects])
		.pipe(plugins.frontMatter())
		.pipe(plugins.markdown())
		.pipe(plugins.layout(function(file){
			return file.frontMatter;
		}))
		.pipe(gulp.dest(paths.target.base+paths.target.projects))
    	.pipe(plugins.connect.reload());
});


//Images
gulp.task('images', function() {
	//plugins.cache.clearAll();
  return gulp.src(paths.src.base+paths.src.img)
    .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(paths.target.base+paths.target.img))
    	.pipe(plugins.connect.reload());
});

// Clean
gulp.task('clean', function(cb) {
    return plugins.del([paths.target.base], cb);
});

gulp.task('connect', function(){
	plugins.connect.server({
		root: [paths.target.base],
		livereload: true
	});
});

gulp.task('default',['clean'], function(){
	gulp.start('style', 'script', 'icons', 'contentJson', 
		'markup:base', 'markup:blog', 'markup:projects', 
		'images', 'connect', 'watch');
});

gulp.task('watch', function(){
	gulp.watch(paths.src.base+'sass/**/*.scss', ['style']);
	gulp.watch([paths.src.base+paths.src.js, paths.src.base+paths.src.templates], ['script']);
	gulp.watch(paths.src.base+'*.html', ['markup:base']);
	gulp.watch(paths.src.base+paths.src.blog, ['markup:blog']);
	gulp.watch(paths.src.base+paths.src.projects, ['markup:projects', 'contentJson']);
	gulp.watch(paths.src.base+paths.src.layout, ['markup:blog','markup:projects']);
	gulp.watch(paths.src.base+paths.src.img, ['images']);
});
