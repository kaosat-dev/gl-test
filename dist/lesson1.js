'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = test;

var _shaderUtils = require('./shaderUtils');

var mat4 = require('gl-mat4');
var fs = require('fs');
var createOrbitCamera = require("orbit-camera");
var glBuffer = require('gl-buffer');
var glShader = require('gl-shader');

function test(gl, width, height) {

  var projection = mat4.create();
  var model = mat4.create();
  var view = mat4.create();

  var camera = createOrbitCamera([0, 0, 1], [0, 0, 0], [0, 1, 0]);
  //this combo works [0, 0, 1] , [0, 0, 0] , [0, 1, 0]

  var triangleVertexPositionBuffer;

  var triangle = glBuffer(gl, new Float32Array([+0.0, +1.0, +0.0, -1.0, -1.0, +0.0, +1.0, -1.0, +0.0]));
  triangle.length = 3;

  function setMatrixUniforms(program, projection, model, view) {
    //console.log("setMatrixUniforms",program.uProjection,projection)
    //gl.uniformMatrix4fv(program.uProjection, false, projection)
    //gl.uniformMatrix4fv(program.uModel, false, model)
    //gl.uniformMatrix4fv(program.uView, false, view)

    shader.bind();
    shader.uniforms.uProjection = projection;
    shader.uniforms.uView = view;
  }

  //program = makeProgram()
  var shader = glShader(gl, fs.readFileSync('./shaders/test2.5.vert', 'utf8'), fs.readFileSync('./shaders/basic.frag', 'utf8'));

  function update(timeIdx) {
    camera.view(view);

    camera.rotate([(timeIdx - 1) * 10, (timeIdx - 1) * 10], [timeIdx * 100, timeIdx * 100]); //[timeIdx*0.01,timeIdx*0.01])
    camera.pan([timeIdx * 0.1, 0, 0]);

    // Calculate projection matrix
    mat4.perspective(projection, Math.PI / 4, width / height, 0.1, 100);

    // Calculate triangle's modelView matrix
    mat4.identity(model, model);
    mat4.translate(model, model, [-1.5, 0, -7]);
  }

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Sets the viewport, i.e. tells WebGL to draw the
    // scene across the full canvas.
    gl.viewport(0, 0, width, height);

    // Enables depth testing, which prevents triangles
    // from overlapping.
    //gl.enable(gl.DEPTH_TEST)

    // Enables face culling, which prevents triangles
    // being visible from behind.
    //gl.enable(gl.CULL_FACE)

    // Updates our model/view/projection matrices, sending them
    // to the GPU as uniform variables that we can use in
    // `shaders/bunny.vert` and `shaders/bunny.frag`.
    setMatrixUniforms(shader, projection, model, view);

    console.log("shader uniforms  done");

    // draw
    //gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer)
    //gl.vertexAttribPointer(shader.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
    //gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems)

    // Enable attribute pointer
    shader.attributes.aPosition.pointer();

    // Draw the triangle
    triangle.bind();
    shader.uniforms.uModel = model;
    gl.drawArrays(gl.TRIANGLES, 0, triangle.length);
  }

  return { render: render, update: update };
}

module.exports = exports['default'];