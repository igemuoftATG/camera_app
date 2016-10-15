function edgeDetector(){
  // Variables
  this.img = undefined;
  this.imgElement = undefined;
  this.ctx = undefined;
  this.canvasElement = undefined;
  this.rawCanvas = undefined;
  this.rawctx = undefined;
  this.ctxDimensions = {
    width: undefined,
    height:undefined
  };
  this.pixelData = undefined;

  this.edgeDataX  = [];
  this.edgeDataY  = [];
  this.well = [];
  this.wellData = [];

  this.threshold = undefined; //default value

  this.init = function(){
    $('#debug').html("in init");
    // Build the canvas
    var width = $(this.imgElement).width();
    var height = $(this.imgElement).height();

    this.canvasElement = $('#layer')[0];
    this.rawCanvas = $('#rawData')[0];
    this.canvasElement.width = width;
    this.rawCanvas.width = width;
    this.canvasElement.height = height;
    this.rawCanvas.height = height;


    this.ctx = this.canvasElement.getContext('2d');
    this.rawctx = this.rawCanvas.getContext('2d');

    // Store the Canvas Size
    this.ctxDimensions.width = width;
    this.ctxDimensions.height = height;
  };

  this.findEdges = function(){
    //$('#debug').html("in findEdges");
    this.copyImage();
    this.coreLoop();
  };

  this.copyImage = function(){
    //$('#debug').html("in copyImage");
    this.rawctx.clearRect(0,0,this.ctxDimensions.width,this.ctxDimensions.height);

    this.ctx.drawImage(this.imgElement,0,0);

    this.pixelData = this.ctx.getImageData(0,0,this.ctxDimensions.width, this.ctxDimensions.height);
    //$('#debug').html("passed");
  };

  this.coreLoop = function(){
    //$('#debug').html("in coreLoop");

    var x = 0;
    var y = 0;

    var left = undefined;
    var top = undefined;
    var right = undefined;
    var bottom = undefined;

    var detected = false;
    var xPad = 0;
    var yPad = 0;

    for(y=yPad;y<this.pixelData.height-yPad;y++){
      for(x=xPad;x<this.pixelData.width-xPad;x++){
          index = (x + y*this.ctxDimensions.width)*4;

          pixel = this.pixelData.data.slice(index,index+3);

          left = this.pixelData.data.slice(index-4,index-1);
          right = this.pixelData.data.slice(index+4,index+7);
          top = this.pixelData.data.slice(index-(this.ctxDimensions.width*4),index-(this.ctxDimensions.width*4)+3);
          bot = this.pixelData.data.slice(index+(this.ctxDimensions.width*4),index+(this.ctxDimensions.width*4)+3);

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
          if (detected){
            this.edgeDataX.push(x);
            this.edgeDataY.push(y);
            this.plotPoint(x,y);
            detected = false;
          }
      }}
  };

  this.plotPoint = function(x,y){
      //$('#debug').html("in plotPoint");

      this.ctx.fillStyle ='green';
      this.ctx.fillRect(x, y, 0.6, 0.6);

      this.rawctx.fillStyle ='green';
      this.rawctx.fillRect(x, y, 0.7, 0.7);
  };

  this.findCircles = function(){
    //$('#debug').html("in findCircles");
    var top = Math.min.apply(null,this.edgeDataY);
    var bot = Math.max.apply(null,this.edgeDataY);
    var left = Math.min.apply(null,this.edgeDataX);
    var right = Math.max.apply(null,this.edgeDataX);

    this.well = [(left+right)/2,(top+bot)/2,(bot-top + right-left)/4*0.90];
    this.rawctx.beginPath();
    this.rawctx.fillStyle = 'black';
    //the following code uses circle with 90% of avg radius
    this.rawctx.arc(this.well[0],this.well[1],this.well[2],0,2*Math.PI);
    this.rawctx.stroke();

    //$('#debug').html();
  }

  this.getInfos = function(){
    var temp;
    var wellData = [];
    for(var x=this.well[0];x<=this.well[0];x++){
      temp = Math.pow(Math.pow(this.well[2],2)-x*x,0.5)
      for(var y=this.well[1]-temp;y<=this.well[1]+temp;y++){
        index = (x + y*this.ctxDimensions.width)*4;

        wellData.push(this.pixelData.data[index]);
        wellData.push(this.pixelData.data[index+1]);
        wellData.push(this.pixelData.data[index+2]);
      }}
  }

  this.clearEdgeData = function(){
    this.edgeDataX  = [];
    this.edgeDataY  = [];
    this.well = [];
    this.wellData = [];
  }
}
var detector = new edgeDetector();
