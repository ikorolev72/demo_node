/**
 * capture_test.js
 *
 */

const path = require('path');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('../util/ffmpeg');

const Capture = require('../effects/capture');

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
data.effects.videoOut='out_capture.mp4';

const capture = new Capture(data.effects);
let cmd=capture.GET_FULL_COMMAND();
ffmpeg( cmd ) 
	.then( function( )  {
		//remove temporary file 
		console.log('Result file: ' + data.effects.videoOut );
		}
	);


