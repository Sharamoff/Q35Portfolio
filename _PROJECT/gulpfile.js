'use strict';

const
	gulp = require('gulp'),
	sass = require('gulp-sass')(require('sass')),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	rigger = require('gulp-rigger'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-clean-css'),
	rimraf = require('rimraf'),
	browserSync = require('browser-sync').create();

const path = {
	build: {
		html:       'BUILD/',
		js:         'BUILD/js/',
		css:        'BUILD/css/',
		img:        'BUILD/img/',
		animation:  'BUILD/animation/',
	},
	src: {
		html:       'SRC/*.html',
		js:         'SRC/js/*.js',
		style:      'SRC/style/*.*css',
		img:        'SRC/img/**/*.*',
		animation:  'SRC/animation/**/*.*',
	},
	watch: {
		html:       'SRC/**/*.html',
		js:         'SRC/js/**/*.js',
		style:      'SRC/style/**/*.*css',
		img:        'SRC/img/**/*.*',
		animation:  'SRC/animation/**/*.*',
	},
	clean: './BUILD'
};

const config = {
	server: {
		baseDir: "./BUILD"
	},
	tunnel: false,
	host: 'localhost',
	port: 3001,
	logPrefix: "Sharamoff"
};

gulp.task('html:build', () => {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.stream())
});

gulp.task('js:build', () => {
	return gulp.src(path.src.js)
		.pipe(rigger())
		//.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.stream())
});

gulp.task('style:build', () => {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sass({
			sourceMap: false,
			errLogToConsole: true
		}))
		.pipe(autoprefixer())
		.pipe(cssmin())
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.stream())
});

gulp.task('image:build', () => {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.stream())
});

gulp.task('animation:build', () => {
	return gulp.src(path.src.animation)
		.pipe(gulp.dest(path.build.animation))
		.pipe(browserSync.stream())
});

gulp.task('build', gulp.parallel(
		'html:build',
		'js:build',
		'style:build',
		'image:build',
		'animation:build'
	)
);


gulp.task('watch', () => {
	gulp.watch(path.watch.html,       gulp.series('html:build'));
	gulp.watch(path.watch.js,         gulp.series('js:build'));
	gulp.watch(path.watch.style,      gulp.series('style:build'));
	gulp.watch(path.watch.img, 	      gulp.series('image:build'));
	gulp.watch(path.watch.animation,  gulp.series('animation:build'));
});


gulp.task('webserver', () => {
	browserSync.init(config);
});


gulp.task('clean', (cb) => {
	rimraf(path.clean, cb);
});


gulp.task('default', gulp.series('build', gulp.parallel('webserver', 'watch')));