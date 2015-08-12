export function compileShader(gl, type,str){
  //console.log("raw shader data",str)
  var shader
    if (type == "fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("ERROR in compile",gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
}

export function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram();
 
  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
 
  // link the program.
  gl.linkProgram(program);
 
  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }
 
  return program;
}

export function makeShader(gl, vertexShader,fragmentShader){
  let vert = compileShader(gl, "vertex",vertexShader)
  let frag = compileShader(gl, "fragment",fragmentShader)

  return createProgram(gl,vert,frag)
}