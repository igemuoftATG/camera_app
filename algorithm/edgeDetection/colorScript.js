//alert('alert message goes here');
// prompt("prompt message",'input box default values')
function colorsDiff(data1,data2){
	var v1;
	var v2;
	var lab1;
	var lab2;
	for (var i = 0; i < data1.length; i+=4) {
		v1 = data1.slice(i,i+3);
		lab1 = RGBtoLAB(v1);

		v2 = data2.slice(i,i+3);
		lab2 = RGBtoLAB(v2);

		sum_diff += Math.abs(euclidean_distance(lab1,lab2));
	}
	var result = sum_diff / (img1.width * img1.height);

	/*/{
		sum_diff += Math.abs(v1[0]-v2[0]);
		sum_diff += Math.abs(v1[1]-v2[1]);
		sum_diff += Math.abs(v1[2]-v2[2]);
	}
	var result = 100 * sum_diff / (data1.length/4 * 3 * 255);//*/

	$('#debug').html('passed');
	return result;
}
function colorDiff(p1,p2){ // vi is [r,g,b]
	//$('#debug').html("in colorScript.js");
	v1 = [p1[0]+0,p1[1]+0,p1[2]+0];
	v2 = [p2[0]+0,p2[1]+0,p2[2]+0];
	return Math.abs(euclidean_distance(RGBtoLAB(v1),RGBtoLAB(v2)));
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
