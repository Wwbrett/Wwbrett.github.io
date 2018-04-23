// --------------------------------------------
// Dependencies
// --------------------------------------------
var concat = require('gulp-concat'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    images = require('gulp-imagemin'),
		swPrecache = require('sw-precache'),
		path = require('path'),
    browserSync = require('browser-sync').create();

var dest = './source';

// paths
var styleSrc = 'source/sass/**/*.scss',
    styleDest = 'build/assets/css/',
    htmlSrc = 'source/',
    htmlDest = 'build/',
    vendorSrc = 'source/js/vendors/',
    vendorDest = 'build/assets/js/',
		organiseSrc = 'source/json/*.json',
		organiseDest = 'build/assets/json',
    scriptSrc = 'source/js/*.js/',
    scriptDest = 'build/assets/js/';



// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------

gulp.task('generate-service-worker', function(callback) {
	swPrecache.write(path.join(dest, 'servie-worker.js'), {
		staticFileGlobs: [ dest + '/**/*.{js,html,json,css}'], stripPrefix: dest
	}, callback);
});

// Compiles all SASS files
gulp.task('process_sass', function() {
    gulp.src('source/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass({
            style: 'compressed'
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
          }))

        .pipe(gulp.dest('build/assets/css'));
});

gulp.task('images', function() {
    gulp.src('source/img/*')
        .pipe(images())
        .pipe(gulp.dest('build/assets/img'));
});

// Uglify js files
gulp.task('scripts', function() {
    gulp.src('source/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'));
});

gulp.task('organise', function() {
		gulp.src('source/json/*.json')
				.pipe(plumber())
				.pipe(gulp.dest('build/assets/json'));
});

//Concat and Compress Vendor .js files
gulp.task('vendors', function() {
    gulp.src(
            [
                'source/js/vendors/jquery.min.js',
                'source/js/vendors/*.js'
            ])
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'));
});



// Watch for changes
gulp.task('watch', function(){

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });

    gulp.watch(styleSrc,['process_sass']);
    gulp.watch(scriptSrc,['scripts']);
    gulp.watch(vendorSrc,['vendors']);
		gulp.watch(organiseSrc,['organise']);
    gulp.watch(['build/*.html', 'build/assets/css/*.css', 'build/assets/js/*.js', 'build/assets/json/*.json', 'build/assets/js/vendors/*.js']).on('change', browserSync.reload);

});


// use default task to launch Browsersync and watch JS files
gulp.task('default', [ 'process_sass', 'scripts', 'organise', 'vendors', 'watch'], function () {});
