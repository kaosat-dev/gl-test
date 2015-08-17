'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _makeContext = require('./makeContext');

var _checkExtensions = require('./checkExtensions');

var _outputToFile = require('./outputToFile');

//checkExtensions(gl)

var _test1 = require('./test1');

var _test12 = _interopRequireDefault(_test1);

var fs = require('fs');
//var makeShader = require('gl-shader')
var mat4 = require('gl-mat4');
var glslify = require('glslify');

var height = 8; //480
var width = 8; //640

var _makeMesaContext = (0, _makeContext.makeMesaContext)(width, height);

var buffer = _makeMesaContext.buffer;
var context = _makeMesaContext.context;
var gl = _makeMesaContext.gl;

function cleanup(context) {
  //cleanup, output
  gl.DestroyContext(context);
}
var _test = (0, _test12['default'])(gl, width, height);

var render = _test.render;
var update = _test.update;

function sequenceShots() {
  var iterations = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

  var fileName = 'output';

  for (var i = 0; i < iterations; i++) {
    update(i);
    render();
    (0, _outputToFile.outputToFile)(buffer, width, height, fileName + i + ".png");
  }
}

sequenceShots(3);