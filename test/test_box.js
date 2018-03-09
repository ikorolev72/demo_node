/**
 * box_test.js
 *
 */

const path = require('path');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('../util/ffmpeg');

const Box = require('../effects/box');

const videoFileModel = './video-model.json';

let data;
try {
	data = JSON.parse(require('fs').readFileSync(videoFileModel, 'utf8'));
	//    data = JSON.parse(event.body);
} catch (e) {
	console.log('Cannot read and parse json file ' + videoFileModel);
	process.exit(1);
}

// set the output filename
data.effects.videoOut='out_box.mp4';

const box = new Box(data.effects);
let cmd=box.GET_FULL_COMMAND();
//console.log( cmd) ;

ffmpeg( cmd ) ;


