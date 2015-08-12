var fs    = require('fs')
var Geometry = require('gl-geometry')
//var makeShader = require('gl-shader')
var mat4     = require('gl-mat4')
var normals  = require('normals')
var glslify  = require('glslify')
var bunny    = require('bunny')
var createOrbitCamera = require("orbit-camera")

import {makeMesaContext} from './makeContext'
import {makeShader} from './shaderUtils'

var height = 480
var width = 640 
let {buffer, context, gl} = makeMesaContext(width,height)

/*var geometry = Geometry(gl)

geometry.attr('aPosition', bunny.positions)
geometry.attr('aNormal', normals.vertexNormals(
    bunny.cells
  , bunny.positions
))
geometry.faces(bunny.cells)
console.log("geometry setup")*/

var camera = createOrbitCamera( [0, 10, 30] , [0, 0, 0] , [0, 1, 0])

var projection = mat4.create()
var model      = mat4.create()
var view       = mat4.create()

var modelView       = mat4.create()


console.log("matrices setup")

let bunnyVert = fs.readFileSync('./shaders/bunny.vert', 'utf8')
let bunnyFrag = fs.readFileSync('./shaders/bunny.frag', 'utf8')
let basicVert = fs.readFileSync('./shaders/basic.vert', 'utf8')
let basicFrag = fs.readFileSync('./shaders/basic.frag', 'utf8') 
let basicVert2 = fs.readFileSync('./shaders/basic2.vert', 'utf8')


var triangleVertexPositionBuffer
var program = makeShader(gl, basicVert2, basicFrag)
gl.useProgram(program)
program.vertexPositionAttribute = gl.getAttribLocation(program, "aPosition")
gl.enableVertexAttribArray(program.vertexPositionAttribute)

program.uProjection = gl.getUniformLocation(program, "uProjection")
//program.uModel = gl.getUniformLocation(program, "uModel")
//program.uView = gl.getUniformLocation(program, "uView")
program.uModelView = gl.getUniformLocation(program, "uModelView")


function setMatrixUniforms() {
  gl.uniformMatrix4fv(program.uProjection, false, projection)
  //gl.uniformMatrix4fv(program.uModel, false, model)
  gl.uniformMatrix4fv(program.modelView, false, modelView)
}

function initBuffers() {
  triangleVertexPositionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer)
  var vertices = [
       0.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  triangleVertexPositionBuffer.itemSize = 3;
  triangleVertexPositionBuffer.numItems = 3;

  /*squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer)
  vertices = [
       1.0,  1.0,  0.0,
      -1.0,  1.0,  0.0,
       1.0, -1.0,  0.0,
      -1.0, -1.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  squareVertexPositionBuffer.itemSize = 3;
  squareVertexPositionBuffer.numItems = 4;*/
}

initBuffers()

console.log("shaders setup")


function update() {
  //width  = gl.drawingBufferWidth
  //height = gl.drawingBufferHeight

  console.log("width",width,"height",height)
  // Updates the width/height we use to render the
  // final image.
  // Updates our camera view matrix.
  camera.view(view)

  // Optionally, flush the state of the camera. Required
  // for user input to work correctly.
  //camera.tick()

  // Update our projection matrix. This is the bit that's
  // responsible for taking 3D coordinates and projecting
  // them into 2D screen space.
  var aspectRatio = width / height
  var fieldOfView = Math.PI / 4
  var near = 0.01
  var far  = 100

  mat4.perspective(projection
    , fieldOfView
    , aspectRatio
    , near
    , far
  )

  console.log("update done")
}

function render() {
  //update()
  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Sets the viewport, i.e. tells WebGL to draw the
  // scene across the full canvas.
  gl.viewport(0, 0, width, height)
  console.log("viewport done")

  // Enables depth testing, which prevents triangles
  // from overlapping.
  gl.enable(gl.DEPTH_TEST)
  console.log("DEPTH_TEST done")

  // Enables face culling, which prevents triangles
  // being visible from behind.
  gl.enable(gl.CULL_FACE)
  console.log("CULL_FACE done")

  // Binds the geometry and sets up the shader's attribute
  // locations accordingly.
  //geometry.bind(shader)
  console.log("bind shader done")

  // Updates our model/view/projection matrices, sending them
  // to the GPU as uniform variables that we can use in
  // `shaders/bunny.vert` and `shaders/bunny.frag`.
  
  //shader.uniforms.uProjection = projection
  //shader.uniforms.uView = view
  //shader.uniforms.uModel = model
  setMatrixUniforms()
  console.log("shader uniforms  done")

  // draw
  //gl.drawArrays(gl.TRIANGLES, 0, 6)

  // Finally: draws the bunny to the screen! The rest is
  // handled in our shaders.
  //geometry.draw(gl.TRIANGLES)

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
  mat4.identity(view);
        mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

}

function output(buffer, fileName){

  function genOutput(inBuf, width, height){
    var channels = inBuf.length / 4
    var channelSize = width * height
    var size = channelSize * 4
    var buffer = new Buffer(size)

    var redChannelEnd = channelSize * 1
    var greenChannelEnd = channelSize * 2
    var blueChannelEnd = channelSize * 3
    var alphaChannelEnd = channelSize * 4

    //
    console.log("inBuf channels",channels)

    //var y = 0
    for (var i = 0; i < channels; ++i) {
      var r = inBuf[i*4]
      var g = inBuf[i*4+1]
      var b = inBuf[i*4+2]
      var a = inBuf[i*4+3]

      var y = Math.floor(i/height)
      var x = i%width
      var u = y * width + x;

      //console.log([r,g,b])
      //console.log("//")
      buffer[u] = r
      buffer[u + redChannelEnd] = g
      buffer[u + greenChannelEnd] = b
      buffer[u + blueChannelEnd] = a
    }

    return buffer
  }


  

  function genOutput2(inBuf, width, height){
    var PNG = require('pngjs2').PNG

    var png = new PNG( {
        width: width,
        height: height
      } )


    //buffer.copy( png.data, 0, 0, buffer.length )
    //var channels = inBuf.length / 4
    for (var i = 0; i < inBuf.length; ++i) {
      png.data[i] = inBuf[i]
    }


    png.pack().pipe(fs.createWriteStream(fileName))
  }

  genOutput2(buffer, width, height)
}

function cleanup(context){
  //cleanup, output
  //gl.DestroyContext(context)
}

function sequenceShots(iterations=1)
{
  var fileName = 'output'

  for(var i=0;i<iterations;i++){
    render()

    /*gl.clearColor(0.0, 1.0, 1.0, 0.5)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.finish()*/

    output(buffer,fileName+i+".png")
    camera.rotate([i,i],[i*20,i*20])
    
  }
}

sequenceShots()