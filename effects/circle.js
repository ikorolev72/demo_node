/**
 * circle.js
 *
 * @author Korolev Igor <igor.a.korolev@gmail.com>
 */

// Deps
const path = require('path');
const os = require('os');
const fs = require('fs');

const temp = require('temp');
const gm = require('gm');
const DrawOval = require('./draw_oval');


const LOG_LEVEL = 'info'; // possible values: quiet,panic,fatal,error,warning,info,verbose,debug,trace
const VIDEO_QUALITY = ' -crf 22 '; // 0..51, 0- best, 51 - worst, 23 - default


/**
 * Constructor
 *
 * @access public
 * @param {object} options
 * @param {string} videoIn
 * @returns {void}
 */
const ex = module.exports = function ( options ) {
    const me = this;

//    me.videoIn = path.join(os.tmpdir(), options.videoIn);
//    me.videoOut = path.join(os.tmpdir(), options.videoOut);
    me.videoIn = path.join('..', 'test', options.videoIn);
    me.videoOut = path.join('..', 'test',  options.videoOut);
    me.fadeDuration = options.fadeDuration || 1;
    me.arr = options.circle;    
    me.thickness = options.thickness || 5;

    // predefined values
    me.logLevel = LOG_LEVEL; 
    me.videoQuality = VIDEO_QUALITY;
    me.circleCenterCoordinate = false; // coordinates in keyMappingFile  related to for center. false mean upper left corner
    me.temporaryFiles = [];

};


const cl = ex.prototype;


/**
 * Return name of temporary file ( need be remove )
 *
 * @access public
 * @returns {[]}
 */
cl.GET_TEMPOPARY_FILES = function () {
  const me = this;  
  return( me.temporaryFiles );
}

/**
 * Return full command
 *
 * @access public
 * @returns {String}
 */
cl.GET_FULL_COMMAND = function () {
  const me = this;

  // processing only first element of array
  let item = me.arr[0];  
  circleImage = temp.path({suffix: '.png'});
  me.temporaryFiles.push( circleImage) ;


  let oval = new DrawOval( circleImage, item.width, item.height, ( item.width-6 )/2, ( item.height-6 )/2 , 'red', 6 );

  try{
    oval.drawOval();
  } catch(e) {
    console.log( 'Cannot write image ' + me.circleImage + ':' + e );
    return( null );
  }  
  
  let fadeIn = item.fadeIn,
      fadeOut = item.fadeOut,
      incFadeIn = ' null ',
      incFadeOut = ' null ',
      start = item.start,
      stop = item.stop
      x=item.x,
      y=item.y;



  if (fadeIn) incFadeIn = 'fade=in:st=' + start + ':d=' + me.fadeDuration + ':alpha=1';
  if (fadeOut) incFadeOut = 'fade=out:st=' + (stop - me.fadeDuration) + ':d=' + me.fadeDuration + ':alpha=1 ';

  let cmd = ' -y -loglevel ' + me.logLevel + ' -loop 1 -i ' + circleImage + ' -i ' + me.videoIn + ' -filter_complex "' +
      'nullsrc=s=' + item.width + 'x' + item.height + '[n0]; '+
      '[n0][0:v] overlay, ' + incFadeIn + ', '+ incFadeOut + ' [circle]; ' +  
      '[1:v] null [video_in]; ' +
      '[video_in][circle] overlay=enable=between( t\\,' + start + '\\,' + stop + '):x='+ x +':y='+ y +':eof_action=pass [v]"' +
      ' -map "[v]"  '+ me.videoQuality +'  -c:v libx264  -an -f mp4 ' + me.videoOut;

  return cmd;
};

