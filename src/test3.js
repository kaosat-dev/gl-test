var Geometry = require('gl-geometry')
var bunny    = require('bunny')
var createOrbitCamera = require("orbit-camera")



export function test3(gl, width, height){

  var camera = createOrbitCamera( [0, 10, 30] , [0, 0, 0] , [0, 1, 0])

  var projection = mat4.create()
  var model      = mat4.create()
  var view       = mat4.create()


  var geometry = Geometry(gl)

  geometry.attr('aPosition', bunny.positions)
  geometry.attr('aNormal', normals.vertexNormals(
      bunny.cells
    , bunny.positions
  ))
  geometry.faces(bunny.cells)
  console.log("geometry setup")



  function update(timeIdx) {
    //console.log("width",width,"height",height)
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

    camera.rotate([timeIdx,timeIdx],[timeIdx*20,timeIdx*20])
  }


  function render() {
    //update()
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
   /*gl.clearColor(0.0, 1.0, 1.0, 0.5)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.finish()*/


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

   

  }


}