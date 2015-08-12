var fs    = require('fs')
//var makeShader = require('gl-shader')
var mat4     = require('gl-mat4')
var normals  = require('normals')
var glslify  = require('glslify')

import {makeMesaContext} from './makeContext'
import {outputToFile} from './outputToFile'

var height = 480
var width = 640 
let {buffer, context, gl} = makeMesaContext(width,height)

function cleanup(context){
  //cleanup, output
  gl.DestroyContext(context)
}


import test from './test2.5'

let {render,update} = test(gl, width, height)

function sequenceShots(iterations=1)
{
  var fileName = 'output'

  for(var i=0;i<iterations;i++){
    update(i)
    render()
    outputToFile(buffer, width, height, fileName+i+".png")
    
  }
}

sequenceShots(5)