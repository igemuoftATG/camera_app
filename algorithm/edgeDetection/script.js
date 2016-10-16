var img_used = document.getElementById("image");
detector.imgElement = img_used;
detector.init();



function detect(){
  $('#debug').html("loading");
  var user_input = $("#threshold")[0].value;
  detector.threshold = Number(user_input);

  detector.clearCanvas();
  detector.clearWellData();
  loopThroughSample(detector);

  $('#debug').html("done");
}

function loopThroughSample(d){
  var row = $("#rows")[0].value;
  var col = $("#cols")[0].value;
  var rSpace = d.ctxDimensions.height/row;
  var cSpace = d.ctxDimensions.width/col;
  //control as the first well (r,c) = (0,0)
  d.findCircle(d.findEdges([0,rSpace,0,cSpace]));
  //rest of first row
  for (var c = 1; c < col; c++) {
    //$('#debug').html(c);
    d.findCircle(d.findEdges([0,rSpace,c*cSpace,(c+1)*cSpace]));
    //d.compareWithControl(r*col+c);
  }
  //rest of the rows
  for (var r = 1; r < row; r++) {
    for (var c = 0; c < col; c++) {
      //$('#debug').html(c);
      d.findCircle(d.findEdges([r*rSpace,(r+1)*rSpace,c*cSpace,(c+1)*cSpace]));
      //d.compareWithControl(r*col+c);
    }
  }
}

$(function() {// tracks the canvas and for debug

    $('#image').mousemove(function(e) {

        if(!this.canvas) {
            this.canvas = $('<canvas />')[0];
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
        x = event.offsetX;
        y=event.offsetY;
        $('#coordinate').html('( '+x +' , '+ y+' )');
        //d = detector;
        //debug_img(x,y);


    });
    function debug_img(x,y){
      var index = (x + y*d.ctxDimensions.width)*4;
      var pixel = d.pixelData.data.slice(index,index+3);
      var left = d.pixelData.data.slice(index-4,index-1);
      var right = d.pixelData.data.slice(index+4,index+7);
      var top = d.pixelData.data.slice(index-(d.ctxDimensions.width*4),index-(d.ctxDimensions.width*4)+3);

      var bot = d.pixelData.data.slice(index+(d.ctxDimensions.width*4),index+(d.ctxDimensions.width*4)+3);
      var detected = false;
      if(colorDiff(pixel,left)>this.threshold){
          detected = true;
      }
      else if(colorDiff(pixel,right)>this.threshold){
          detected = true;
      }
      else if(colorDiff(pixel,top)>this.threshold){
          detected = true;
      }
      else if(colorDiff(pixel,bot)>this.threshold){
          detected = true;
      }//*/
      $('#debug').html(colorDiff(pixel,right));
      $('#debug_img').html('top:'+top+'\nbot:'+bot+'\nleft:'+left+'\nright:'+right+'\nedge:'+detected);
    };

});
