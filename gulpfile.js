var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('uglify', function ()
{
    return gulp.src(
        'src/angular-forage.js'
    ).pipe(
        uglify()
    ).pipe(
        rename('angular-forage.min.js')
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('dist', ['uglify']);