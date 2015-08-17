
export function checkExtensions(gl){
  /*var exts = gl.getSupportedExtensions();
  for(var i = 0; i < exts.length; i++) {
    console.log("extName",exts[i]);
    console.log("ext",gl.getExtension(exts[i]));
  }  */
  let ext = gl.getExtension("ARB_vertex_array_object")
  console.log("ext",ext)

}
