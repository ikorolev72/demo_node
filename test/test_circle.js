/**
 * circle_test.js
 *
 */

const path = require('path');
const os = require('os');
const fs = require('fs');
const ffmpeg = require('../util/ffmpeg');

const Circle = require('../effects/circle');

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
data.effects.videoOut='out_circle.mp4';

const circle = new Circle(data.effects);
let cmd=circle.GET_FULL_COMMAND();
ffmpeg( cmd ) 
	.then( function( )  {
		//remove temporary file 
		console.log('Files will be removed: ' + circle.GET_TEMPOPARY_FILES() );
		fs.unlinkSync( circle.GET_TEMPOPARY_FILES().join(' ') );
		}
	);


