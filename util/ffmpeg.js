/**
 * ffmpeg.js
 */

const os = require('os');
const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const cp = require('./child-process-promise');
const localPathFFMPEG = 'ffmpeg';


module.exports = function ffmpeg(givenArgs) {
  const args = typeof givenArgs === 'string'
    ? [givenArgs]
    : givenArgs;
    console.log('running locally ffmpeg');
    return cp.spawn(localPathFFMPEG, args);
};
