/* eslint no-var: 0 */
/* eslint prefer-arrow-callback: 0 */
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var deepAssign = require('deep-assign');

module.exports = function robotState(statePath) {
  if (!statePath) {
    throw new Error('You must specify path to store your state file');
  }

  var initialState;
  var paths = statePath.split('/');
  var filename = paths[paths.length - 1];
  var directory = statePath.replace(filename, '');
  var stateWriter = async.queue(writeStateToFile, 1);

  try {
    var stat = fs.statSync(statePath);
    if (stat.isDirectory()) {
      console.error('the path is directory, not a file');
      return function noop() {};
    }
    var stateFile = fs.readFileSync(statePath);
    initialState = JSON.parse(stateFile);
  } catch (e) {
    initialState = {};
    mkdirp.sync(directory);
  }

  function writeStateToFile(state, callback) {
    // write state to file asynchronously but in a queue
    fs.writeFile(statePath, JSON.stringify(state), callback);
  }

  return function plugin(robot) {
    robot.state = initialState;
    robot.setState = function (newState) {
      var nextState = deepAssign(robot.state, newState);
      stateWriter.push(nextState, function (err) {
        if (err) {
          console.error('Failed to save state to file', err);
        }
      });
    };
  };
};
