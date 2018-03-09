/**
 * box.js
 *
 * @author Korolev Igor <igor.a.korolev@gmail.com>
 */

// Deps
const path = require('path');
const os = require('os');

/**
 * Constructor
 *
 * @access public
 * @param {object} options
 * @returns {void}
 */
const ex = module.exports = function (options) {
    const me = this;

//    me.videoIn = path.join(os.tmpdir(), options.videoIn);
//    me.videoOut = path.join(os.tmpdir(), options.videoOut);
    me.videoIn = path.join('..', 'test', options.videoIn);
    me.videoOut = path.join('..', 'test',  options.videoOut);
    me.fadeDark = options.fadeDark || -3;
    me.fadeDuration = options.fadeDuration || 1;
    me.thickness = options.thickness || 5;

    // process this array
    me.arr = options.box;

};

const cl = ex.prototype;


/**
 * Return full command
 *
 * @access public
 * @returns {String}
 */
cl.GET_FULL_COMMAND = function () {
    const me = this;

    var currentCount = 1;
    var colorFilters = [];
    var overlayFilters = [];

    var cmd = ' -y -i ' + me.videoIn + ' -filter_complex "';
    me.arr.forEach(function (item, i, arr) {
        var x = item.x;
        var y = item.y;
        var height = item.height;
        var width = item.width;
        var start = item.start;
        var stop = item.stop;
        var color = item.color;

        colorFilters.push('color=c=red@0:s=' + width + 'x' + height + ', drawbox=x=0:y=0:w=' + width + ':h=' + height + ':t=' + me.thickness + ':color=' + color + ', fade=in:st=' + start + ':d=' + me.fadeDuration + ':alpha=1, fade=out:st=' + (stop - me.fadeDuration) + ':d=' + me.fadeDuration + ':alpha=1 [c' + currentCount + '];');
        overlayFilters.push('[c' + currentCount + '] overlay=x=' + x + ':y=' + y + ':shortest=1:eof_action=pass  [cv' + currentCount + ']; [cv' + currentCount + ']');
        currentCount++;

    });

    cmd += colorFilters.join(' ');
    cmd += '[0:v]' + overlayFilters.join(' ') + ' null [v] " ';
    cmd += ' -map "[v]" -c:a copy -c:v libx264  ' + me.videoOut;

    return cmd;
};