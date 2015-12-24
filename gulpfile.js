var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');

function handleErrors() {
  notify.onError({
    title : 'Compile Error',
    message : '<%= error.message %>'
  }).apply(this, arguments);

  this.emit('end'); //keeps gulp from hanging on this task
}

function build(options) { 
  var bundler = browserify({
    entries: ['src/main.jsx'],
    extensions: ['.jsx'],
    transform: [
      ['babelify', { presets: ['es2015', 'react'] }]
    ],
    debug: true,
  });
  if (options.ugly) {
    bundler.transform({ global: true }, 'uglifyify');
  }
  if (options.watch) {
    bundler = watchify(bundler);
  }
  function rebuild() {
    bundler
      .bundle()
      .on('error', handleErrors)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('client/build/'))
  }
  bundler.on('update', function() {
    var updateStart = Date.now();
    rebuild();
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  });
  rebuild();
}


gulp.task('build', function() {
  build({ ugly: true, watch: false });
});

gulp.task('build-dev', function() {
  build({ ugly: false, watch: true });
});

gulp.task('serve', function() {
  nodemon({
    script: 'server/server.js',
    ext: 'js',
    watch: 'server/'
  })
  .on('restart', function() {
    console.log('restarting server');
  });
});

gulp.task('default', ['build-dev', 'serve']);