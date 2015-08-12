export function makeMesaContext(width=128,height=128,bpp=32){
  let osmesa = require('osmesa-webgl')
  let context = osmesa.CreateContext()
  let gl = osmesa

  let buffer = new Uint8Array(width * height * bpp / 8) ///RGBA
  osmesa.MakeCurrent(context, buffer, width, height)

  return {buffer,context,gl}
}

export function makeDefaultContext(width=128,height=128,bpp=32){
  let getContext = require('get-canvas-context')
  let context = getContext('webgl', {width,height})

  return {context}
}