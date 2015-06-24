---
title: Blog 2
layout: ./src/markup/layout/blog.handlebars
---

# This is my header 
## This is my second header
### This is my third header

```javascript
gulp.task('blog:json', function(){
  return gulp.src([paths.src.base+paths.src.blog])
  .pipe(plugins.frontMatter({property: 'meta'}))
  .pipe(plugins.data(function(file){
    file.meta.path = file.path
  }))
  .pipe(plugins.pluck('meta', 'blogs.json'))
  .pipe(plugins.data(function(file){
    file.contents = new Buffer(JSON.stringify(file.meta))
  }))
  .pipe(gulp.dest(paths.target.base+paths.target.blog));
});
```

