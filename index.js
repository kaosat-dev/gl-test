var fs    = require('fs')
var Geometry = require('gl-geometry')
var makeShader = require('gl-shader')
var mat4     = require('gl-mat4')
var normals  = require('normals')
var glslify  = require('glslify')
var bunny    = require('bunny')
var createOrbitCamera = require("orbit-camera")

var height = 640
var width = 480
var camera = createOrbitCamera([0, 10, 20],
                               [0, 3, 0],
                               [0, 1, 0])


function makeMesaContext(width=128,height=128,bpp=32){
  let osmesa = require('osmesa-webgl')
  let context = osmesa.CreateContext()
  let gl = osmesa

  let buffer = new Uint8Array(width * height * bpp / 8) ///RGBA
  osmesa.MakeCurrent(context, buffer, width, height)

  return {buffer,context,gl}
}

function makeDefaultContext(width=128,height=128,bpp=32){
  let getContext = require('get-canvas-context')
  let context = getContext('webgl', {width,height})

  return {context}
}

let {buffer, context, gl} = makeMesaContext(width,height)


console.log("context setup",gl)
var geometry = Geometry(gl)

geometry.attr('aPosition', bunny.positions)
geometry.attr('aNormal', normals.vertexNormals(
    bunny.cells
  , bunny.positions
))

geometry.faces(bunny.cells)

console.log("geometry setup")

var projection = mat4.create()
var model      = mat4.create()
var view       = mat4.create()

console.log("matrices setup")


let bunnyVert = fs.readFileSync('./shaders/bunny.vert', 'utf8')
let bunnyFrag = fs.readFileSync('./shaders/bunny.frag', 'utf8')

/*let bunnyVert = glslify('./shaders/bunny.vert')
let bunnyFrag = glslify('./shaders/bunny.frag')*/

/*var src = glslify(`
  precision mediump float;
 
  void main() {
    gl_FragColor = vec4(1.0);
  }
`, { inline: true })*/

/*var shader = makeShader(gl,
    "precision mediump float;\
     attribute vec3 aPosition;\
     attribute vec3 aNormal;\
     varying vec3 vNormal;\
     uniform mat4 uProjection;\
     uniform mat4 uModel;\
     uniform mat4 uView;\
     void main() {\
      vNormal = aNormal;\
      gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);\
    }",
    "precision mediump float;\
    varying vec3 vNormal;\
    void main() {\
      gl_FragColor = vec4(abs(vNormal), 1.0);\
    }")*/

var shader = makeShader(gl,
  bunnyVert,
  bunnyFrag
  )

console.log("shaders setup")


function update() {
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
  update()

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
  geometry.bind(shader)
  console.log("bind shader done")

  // Updates our model/view/projection matrices, sending them
  // to the GPU as uniform variables that we can use in
  // `shaders/bunny.vert` and `shaders/bunny.frag`.
  shader.uniforms.uProjection = projection
    console.log("shader uniforms  done")

  shader.uniforms.uView = view
  shader.uniforms.uModel = model


  // Finally: draws the bunny to the screen! The rest is
  // handled in our shaders.
  geometry.draw(gl.TRIANGLES)

}

function output(buffer){

  //var lwip = require('lwip');


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


  var fileName = 'output.png'

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
 

  //var oBuf = genOutput(buffer, width, height)

  /*lwip.open(oBuf, { width:width, height: height }, function(err, image) {
    console.log("HEEERE")
      if (err) return console.log("err open", err)
      image
        .batch()
        //.blur(9)
        .writeFile('output.png', function(err){
          if (err) return console.log("err write", err)
          console.log('done')
        })
  })*/

  buffer

  //cleanup, output
  gl.DestroyContext(context)
}

render()
output(buffer)



