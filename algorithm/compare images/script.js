//Credits: Zion

//alert('alert message goes here');
// prompt("prompt message",'input box default values')
var compareImgApp = angular.module('CompareImgApp',[]);

compareImgApp.controller('TryCtrl',function($scope){
	$scope.debug = 'debug msg';
	$scope.output = 'output msg';

	$scope.load_img1 = function(){ //blicked button
		$('#debug').html('loading img1');
    $scope.img1src = "images/"+$scope.img1Name;
		$scope.debug = 'clicked "load_img1" button';
	};

	$scope.load_img2 = function(){ //blicked button
		$('#debug').html('loading img2');
    $scope.img2src = "images/"+$scope.img2Name;
		$scope.debug = 'clicked "load_img2" button';
	};

	$scope.compare = function(){ //clicked button
		$('#debug').html('loading compare');
    compareImg('img1','img2',function(result){
			$scope.output = result;
		});
		$scope.debug = 'clicked "compare" button';
	};
});


function getData(imgID, callback) {
	var imgObj = document.getElementById(imgID);


  imgObj.canvas = $('<canvas />')[0];

  imgObj.canvas.width = imgObj.width;
  imgObj.canvas.height = imgObj.height;
  imgObj.canvas.getContext('2d').drawImage(imgObj, 0, 0, imgObj.width, imgObj.height);

  var imgcx = imgObj.canvas.getContext('2d');

  callback(imgcx.getImageData(0, 0, imgObj.width, imgObj.height));
}

function compareImg(firstImage, secondImage,callback) {
	$('#debug').html('loading compareImg');


	getData(firstImage, function (img1) {
		getData(secondImage, function (img2) {
      if (img1.width !== img2.width || img1.height != img2.height) {
				callback(NaN);
				return;
			}

			var sum_diff = 0;
			var lab1;
			var lab2;

			for (var i = 0; i < img1.data.length / 4; i++) {
														//*  //<-- use the //* to switch between methods

				v1 = [img1.data[4 * i + 0],img1.data[4 * i + 1],img1.data[4 * i + 2]];
				lab1 = RGBtoLAB(v1);

				v2 = [img2.data[4 * i + 0],img2.data[4 * i + 1],img2.data[4 * i + 2]];
				lab2 = RGBtoLAB(v2);

				sum_diff += Math.abs(euclidean_distance(lab1,lab2));
			}
			// total amount of pixels/points used in calculation is = area of img
			var result = sum_diff / (img1.width * img1.height);

			/*/
				sum_diff += Math.abs(img1.data[4 * i + 0] - img2.data[4 * i + 0]) / 255;
				sum_diff += Math.abs(img1.data[4 * i + 1] - img2.data[4 * i + 1]) / 255;
				sum_diff += Math.abs(img1.data[4 * i + 2] - img2.data[4 * i + 2]) / 255;
			}
			var result = 100 * sum_diff / (img1.width * img1.height * 3);//*/

      $('#debug').html('passed');
			callback(result);
		});
	});
}

function euclidean_distance(v1,v2){
	return Math.pow(Math.pow(v1[0]-v2[0],2)+Math.pow(v1[1]-v2[1],2)+Math.pow(v1[2]-v2[2],2),0.5);
}

function RGBtoLAB(rgb){ // [r,g,b] --> [l,a,b]
	return XYZtoLAB(RGBtoXYZ(rgb));
}

function RGBtoXYZ(rgb){ // [r,g,b] --> [x,y,z]
	for (var i = 0; i < 3; i++) {
		rgb[i] = ( rgb[i] / 255.0 );

		if ( rgb[i] > 0.04045 ){
			rgb[i] = 100 * Math.pow((rgb[i] + 0.055 ) / 1.055 , 2.4);
			continue;
		}
		rgb[i] = 100 * rgb[i] / 12.92;
	}	// may not need to multiply by 100

  X = rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805;
  Y = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  Z = rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505;
  return [X, Y, Z];
}

function XYZtoLAB(xyz){ // [x,y,z] --> [l,a,b]
	var ref_xyz = [95.05, 100.0, 108.89999999999999]; // this is the xyz of WHITE

	for (var i = 0; i < 3; i++) {
		xyz[i] = ( xyz[i] / ref_xyz[i] );

		if ( xyz[i] > 0.008856 ){							// 0.008856 <=> 216.0/24389
			xyz[i] = Math.pow(xyz[i] , 1.0/3);
			continue;
		}
		xyz[i] = ( 903.3*xyz[i] + 16 ) / 116; // 903.3 <=> 24389.0/27
	}

  L = 116 * xyz[1] - 16;
  a = 500 * ( xyz[0] - xyz[1] );
  b = 200 * ( xyz[1] - xyz[2] );

	return [L,a,b];
}
/*
xyz = RGBtoXYZ([Red,Green,Blue]); // e.g. input: [56,79,132]
ref_xyz = RGBtoXYZ([255,255,255]);

lab = XYZtoLAB(xyz,ref_xyz); //						output: [34.2,8.07,-32.47]
*/
