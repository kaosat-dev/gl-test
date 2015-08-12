'use strict';

var _makeContext = require('./makeContext');

var _outputToFile = require('./outputToFile');

var _test22 = require('./test2');

var fs = require('fs');
//var makeShader = require('gl-shader')
var mat4 = require('gl-mat4');
var normals = require('normals');
var glslify = require('glslify');

var height = 480;
var width = 640;

var _makeMesaContext = (0, _makeContext.makeMesaContext)(width, height);

var buffer = _makeMesaContext.buffer;
var context = _makeMesaContext.context;
var gl = _makeMesaContext.gl;

function cleanup(context) {
  //cleanup, output
  gl.DestroyContext(context);
}

var _test2 = (0, _test22.test2)(gl, width, height);

var render = _test2.render;
var update = _test2.update;

function sequenceShots() {
  var iterations = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

  var fileName = 'output';

  for (var i = 0; i < iterations; i++) {
    render();
    (0, _outputToFile.outputToFile)(buffer, width, height, fileName + i + ".png");
    update(i);
  }
}

sequenceShots(5);