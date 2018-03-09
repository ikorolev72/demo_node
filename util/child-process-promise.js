/**
 * child-process-promise.js
 *
 */

const Promise = require('bluebird');
let childProcess = require('child_process');

// https://www.hacksparrow.com/difference-between-spawn-and-exec-of-node-js-child_process.html


/**
 * returns the whole buffer output from the child process
 *
 * @access public
 * @param {string} command
 * @returns {void}
 */

module.exports.exec = function (command) {
  console.log(command);
  return new Promise(((resolve, reject) => {
    childProcess.exec(command, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  }));
};


/**
 * returns an object with stdout and stderr streams
 *
 * @access public
 * @param {string} command
 * @param {array} options
 * @returns {void}
 */

module.exports.spawn = function (command, options) {
  console.log(command + options);
  return new Promise(((resolve, reject) => {
    const process = childProcess.spawn(command + options, {shell: true});
    process
      .stdout
      .on('data', (buffer) => {
        console.log(buffer.toString());
      });
    process
      .stderr
      .on('data', (buffer) => {
        console.error(buffer.toString());
      });
    process.on('close', (code) => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve();
      }
    });
  }));
}
