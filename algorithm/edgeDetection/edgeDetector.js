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

  this.wells = [];
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

    this.ctx.drawImage(this.imgElement,0,0);
    this.pixelData = this.ctx.getImageData(0,0,this.ctxDimensions.width, this.ctxDimensions.height);
  };

  this.clearCanvas = function(){
    //$('#debug').html("in copyImage");
    this.rawctx.clearRect(0,0,this.ctxDimensions.width,this.ctxDimensions.height);
    //* The following is optional, omitting them can speed things up
    this.ctx.clearRect(0,0,this.ctxDimensions.width,this.ctxDimensions.height);
    this.ctx.drawImage(this.imgElement,0,0);//*/
  };

  this.findEdges = function(bound){ //[t,d,l,r] -> [[x],[y]]
    //$('#debug').html("in coreLoop");

    var x = 0;
    var y = 0;

    var left = undefined;
    var top = undefined;
    var right = undefined;
    var bottom = undefined;

    var detected = false;
    var edgeDataX = [];
    var edgeDataY = [];
    for(y=bound[0];y<=bound[1];y++){
      for(x=bound[2];x<=bound[3];x++){
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
            edgeDataX.push(x);
            edgeDataY.push(y);
            this.plotPoint(x,y);
            detected = false;
          }
      }}
      return [edgeDataX,edgeDataY];
  };

  this.plotPoint = function(x,y){
      $('#debug').html("in plotPoint");

      this.ctx.fillStyle ='green';
      this.ctx.fillRect(x, y, 0.6, 0.6);

      this.rawctx.fillStyle ='green';
      this.rawctx.fillRect(x, y, 0.7, 0.7);
  };

  this.findCircle = function(points){
    $('#debug').html("in findCircles");
    var top = Math.min.apply(null,points[1]);
    var bot = Math.max.apply(null,points[1]);
    var left = Math.min.apply(null,points[0]);
    var right = Math.max.apply(null,points[0]);

    var currWell = [(left+right)/2,(top+bot)/2,(bot-top + right-left)/4*0.90];
    this.wells.push(currWell);
    this.rawctx.beginPath();
    this.rawctx.fillStyle = 'black';
    //the following code uses circle with 90% of avg radius
    this.rawctx.arc(currWell[0],currWell[1],currWell[2],0,2*Math.PI);
    this.rawctx.stroke();

    //$('#debug').html();
  }

  this.compareWithControl = function(wellNum){
    var temp;
    var control = this.wells[0];
    var currWell = this.wells[wellNum];
    /*
    for(var x=currWell[0];x<=currWell[0];x++){
      temp = parseInt(Math.pow(Math.pow(currWell[2],2)-x*x,0.5));
      for(var y=currWell[1]-temp;y<=currWell[1]+temp;y++){
        index = (x + y*this.ctxDimensions.width)*4;

        currWellData.push(this.pixelData.data[index]);
        currWellData.push(this.pixelData.data[index+1]);
        currWellData.push(this.pixelData.data[index+2]);
      }}*/
  }

  this.compareWithControl = function(wellNum){
    var control = getWellData(0);
    for (var i = 0; i < array.length; i++) {
      colorsDiff(getWellData(1))
    }

    return results;

  }

  this.clearWellData = function(){
    this.wells = [];
    this.wellData = [];
  }
}
var detector = new edgeDetector();
