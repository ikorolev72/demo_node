/**
 * capture.js
 *
 * @author Korolev Igor <igor.a.korolev@gmail.com>
 */

// Deps
const path = require('path');
const os = require('os');

const LOCAL_FONT_PATH = 'Arial.ttf'; //absolute path to font file
const LOG_LEVEL = 'info'; // possible values: quiet,panic,fatal,error,warning,info,verbose,debug,trace
const FONT_SIZE = 36;

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
    me.fadeDuration = options.fadeDuration || 1;
    me.thickness = options.thickness || 5;

    // predefined values
    me.logLevel = LOG_LEVEL; 
    me.fontFile = LOCAL_FONT_PATH; 
    me.fontSize = FONT_SIZE;

    // process this array
    me.arr = options.capture;

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

    var logLevel = me.logLevel;
    var fontFile = me.fontFile;
    var fontSize = me.fontSize;

    var currentCount = 1;
    var drawTextFilters = [];
    var overlayFilters = [];
    var splitStream = [];
    var splitStreamDrawBox = [];

    var cmd = ' -y -loglevel ' + logLevel + ' -i ' + me.videoIn + ' -filter_complex "';
    me.arr.forEach(function (item, i, arr) {
        var x = item.x;
        var y = item.y;
        var height = item.height;
        var width = item.width;
        var start = item.start;
        var stop = item.stop;
        var color = item.color;
        var fadeIn = item.fadeIn;
        var fadeOut = item.fadeOut;
        var text = item
            .text
            .replace('"', '\\\"');
        text = text.replace("'", '\\\"');

        splitStream.push('[v' + currentCount + ']');
        splitStreamDrawBox.push('[db' + currentCount + ']');
        var incFadeIn = ' null ';
        var incFadeOut = ' null ';
        if (fadeIn) {
            incFadeIn = 'fade=in:st=' + start + ':d=' + me.fadeDuration + ':alpha=1';
        }
        if (fadeOut) {
            incFadeOut = 'fade=out:st=' + (stop - me.fadeDuration) + ':d=' + me.fadeDuration + ':alpha=1 ';
        }

        drawTextFilters.push('[v' + currentCount + '] drawtext=fontfile=' + fontFile + ':fontsize=' + fontSize + ':fontcolor=white:x=(w-text_w)/2:y=((h/10-text_h)/2 + 17*H/20):text=\\\'' + text + '\\\':box=1: boxcolor=' + color + ': boxborderw=25 ,' + incFadeIn + ', ' + incFadeOut + ' [t' + currentCount + '];');
//        drawTextFilters.push('[v' + currentCount + '] drawtext=fontsize=' + fontSize + ':fontcolor=white:x=(w-text_w)/2:y=((h/10-text_h)/2 + 17*H/20):text=\\\'' + text + '\\\':box=1: boxcolor=' + color + ': boxborderw=25 ,' + incFadeIn + ', ' + incFadeOut + ' [t' + currentCount + '];');
        overlayFilters.push('[t' + currentCount + '] overlay=enable=between( t\\,' + start + '\\,' + stop + ')  [cv' + currentCount + ']; [cv' + currentCount + ']');
        currentCount++;

    });
    cmd += '[0:v] split=' + (splitStream.length + 1) + splitStream.join('') + '[v0]; ';

    cmd += drawTextFilters.join('');
    cmd += '[v0]' + overlayFilters.join(' ') + ' null [v] " ';

    cmd += ' -map "[v]" -crf 22 -c:v libx264  -c:a copy -f mp4 ' + me.videoOut;

    return cmd;
};