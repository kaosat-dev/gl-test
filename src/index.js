var fs    = require('fs')
//var makeShader = require('gl-shader')
var mat4     = require('gl-mat4')
var glslify  = require('glslify')

import {makeMesaContext} from './common/makeContext'
import {checkExtensions} from './checkExtensions'
import {outputToFile} from './outputToFile'

var height = 8//480
var width = 8//640 
let {buffer, context, gl} = makeMesaContext(width,height)

function cleanup(context){
  //cleanup, output
  gl.DestroyContext(context)
}

//checkExtensions(gl)

import test from './test1'

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



sequenceShots(3)