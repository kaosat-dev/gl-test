var fs    = require('fs')

export function outputToFile(buffer, width, height, fileName){

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

  function log(inBuf, width, height){
    var channels = inBuf.length / 4
    for (var i = 0; i < channels; ++i) {
      var r = inBuf[i*4]
      var g = inBuf[i*4+1]
      var b = inBuf[i*4+2]
      var a = inBuf[i*4+3]

      console.log(r,g,b,a)
      console.log("//")

    }
  }

  genOutput2(buffer, width, height)


  
}
