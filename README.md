# iOS Smartphone App for Colorimetric Analysis

## INTRODUCTION

Colorimetric assays, through convenience and simplicity, have garnered
lasting value in both academia and industry. This year, the University
of Toronto iGEM Computational Team has developed an iOS application for
colorimetric image analysis, usable on-the-go for even greater
convenience and intuitive handling.

Our app is compatible with colorimetric reaction data from any
one-to-one colour change, including the gold detector implemented by our
Wet Lab in the form of their cell-free paper-based biosensor. To
illustrate, upon the conversion of yellow substrate
(chlorophenol-red-beta-D-galactopyranoside) into purple product
(chlorophenol red) within the paper disks of the biosensor (Pardee et
al. 2014)., where the intensity of the colour change corresponds
directly to concentration of analyte, one of our Wet Lab members could
take an iPhone photograph in order to automatically determine the
concentration of gold present. Many of the test cases used for our app
were based on this yellow-to-purple colour change.

Our app utilizes the iPhone camera and advanced colorimetric analysis
algorithms in order to perform quantitative comparisons between images
of the control and images of the sample. The values representing
differences in colour and intensity are analyzed via a machine learning
algorithm that has been trained using image datasets of molecules
susceptible to colorimetric changes, over various concentrations.

## USER EXPERIENCE

Upon opening the app for the first time, the user would be asked to
create a project, as shown in Appendix IV below, and will be prompted to
provide a project name, project location, date, and any additional
notes, as shown in Appendix V below. Alternatively, if the app has been
used before, the user would be able to select a previously created
project. A sample project is shown in Appendix VI.

Each project would contain multiple tests, as shown in for each of which
the user would be prompted to create the following fields: test name,
date, description, number of rows in the well plate, and number of
columns in the well plate, as shown in Appendix VII. A list of tests is
shown in Appendix VIII. Further, upon starting the test, the user would
receive a prompt offering a choice to use an existing photo or take a
new photo, after which the chosen photo would be saved and analyzed, as
shown in Appendix IX. For expediency, we have advised users to place a
control in the first row and the first column of the wells (position
1,1).

Following this, our analytical algorithm would be used in combination
with the number of row and column inputs in order to display a table of
results showing differences in colour between the images of the control
and images of the sample. In addition, a table showing estimated
concentrations of analyte will be generated for the user, as shown in
Appendix X.

This data hierarchy has been created in order to support multiple tests
for a single large location or project. Thus, the user would be able to
store all tests related to the same area in an organized manner.

In addition, we have advised that images should be taken under
relatively even light distribution, given that reflections from the
wells will lower the accuracy of the results.

## SOFTWARE DEVELOPMENT


We chose Apache Cordova, an open-source program for developing
multiplatform apps, for development of our app. Apache Cordova operates
through creation of a web application and use of native wrappers for
select devices. Further, Apache Cordova allows native device APIs to be
accessed freely through plugins such as the camera plugin used
extensively with our app. As Apache Cordova apps are simply modified web
applications, our source code has been written in HTML, CSS, and
JavaScript, notwithstanding the exceptions described below.

The Apache Cordova camera plugin allowed us to integrate the ability to
use the iPhone camera to capture photos in-app and the render the image
accessible through the app at the same time. Our team then made use of
front-end Javascript framework, AngularJS, (along with its modules and
controllers) and HTML Canvas in order to seamlessly and dynamically
retrieve image data and output the analyzed results on the user’s
screen.

All data is stored through Cordova-sqlite-Storage (Brody, 2016), which
uses its own implementation of sqlite3 for on device storage.
Cordova-sqlite-Storage has made it possible for us to store data for
multiple projects and corresponding tests using key-value tuples,
allowing for constant time data recovery.

## ANALYTICAL ALGORITHMS


### Image data retrieval

The captured image would be drawn on an HTML Canvas, giving us the
ability to retrieve and analyze pixel information. However, in order to
conduct the first step of the analysis, we were required to split up the
image of multiple wells into sections of single wells that could be used
for analysis. We generated an algorithm for retrieving image data for
every well and comparing it to image data for the control well (row 1,
column 1) through implementation of Sobel operators for edge detection
(via location of neighbouring pixels with high contrast) (Gonzalez and
Woods, 1992). Our method is applied to the control well in order to find
the values representing the x-min, x-max, y-min and y-max of the well’s
circular circumference, after which the radius of the control well in
the image is calculated. As all wells are expected to have the same
size, the radius of the control well is used as a reference for all
other wells. This method is particularly effective in combination with
the paper-based biosensor utilized by our Wet Lab, as the black
background of the sensor contrasts sharply with the yellow/purple wells.
Our code for the edge detection algorithm can be viewed in Appendix I
below.

The next stage of the pixel retrieval involves image cropping based on
the ratio of rows and columns and reduction of the total image into
single-well divisions. To ensure that the process of division is
executed correctly, we have advised the user to align the edges of the
photo with the edges of the biosensor or well plate.

The edge detection method will be used once again on the single-well
divisions in order to find the value corresponding to the x-min edge. At
this point, given the well radius, the exact pixel-level locations of
the remaining any of the remaining wells can be determined. In the next
step, we submit the colour values determined within each circular well
to our analysis algorithm. In order to ensure that no overlap occurred
between the black background of the biosensor and the approximated well
location, thereby heightening the difference in colour values, we also
downsized the circumference of the wells by a small margin.

### Color Difference Detection (Delta-E calculation)

In order to quantify the difference in colour between our control and
sample wells, we used the CIE76 color difference algorithm, which takes
two pixels and calculates Delta-E (Euclidean Distance) between them
\[some ref\]. However, the CIE76 algorithm uses CIELAB color space as
input (L = Lightness, A = Color Channel A, B = Color Channel B), whereas
smartphone images are commonly saved as RGB (Red Channel, Green Channel,
Blue Channel). The first step in our colour analysis algorithm was the
creation of Javascript functions for conversion of RGB values to CIELAB
color space. In the conversion process, the smartphone-based RGB value
was first converted to an XYZ value and then to a LAB value based on
existing mathematical equations (Lindbloom, 2016).

Please refer to Appendix II to view our code for colour conversion.

Following the conversion of the color channels to CIELAB, we developed
our javascript functions based on the CIE76 Delta-E algorithm (Sharma,
2003), as shown in Appendix III.

### Concentration approximation

Thus far, the applications of our algorithms are limited to determining
the difference in colour between two images. However, in order to be
able to interpolate within concentration ranges for each molecule
susceptible to colorimetric change, we first had to establish a
correlation between the color change and the concentration. Our team
developed a machine learning regressor using the TensorFlow library,
which is to be trained using datasets containing images of molecules
susceptible to colorimetric change and their concentrations. Due to the
lack of a sufficiently sized dataset, it was not possible to train this
algorithm using a real dataset.

For the case of the yellow-to-purple color change visible in our
cell-free paper-based biosensor, we determined that the concentrations
of the molecule susceptible to colour change and the intensity of the
colour change are linearly dependent. Given this linear relationship, we
created a dummy dataset to train the regressor such that it would output
approximated values for the concentration of the molecules. Given an
appropriate dataset, the regressor could be re-trained with minimal
effort. Further, because the regressor operates independently to the
particular hue of colours present and what type of relationships exist
between colour and concentration, (linear, quad, expo), the regressor
can potentially be trained for any apparatus.

## TEST CASES AND OTHER POSSIBLE APPLICATIONS

Most of the test cases run by our team were produced graphically in
Photoshop, wherein we tried to imitate the yellow-to-purple color change
visible in our Wet Lab’s paper-based biosensor for gold detection, as
shown in Appendix VI.

As explained in the section directly above, this analysis is applicable
to any apparatus and any one-to-one color change, given that the
regressor has been trained.

## PLATFORM SUPPORT

Our app was developed and tested for iOS devices. The rationale behind
this decision is that iPhone camera image quality is more consistent
across different versions of iPhones compared to Android devices, which
are manufactured by different companies and may have greatly differing
camera standards depending on the device.

However, given that the application was created using Cordova, which
allows for development in multiple platforms from a single code base,
the application can be made available as an Android app and in-browser.
However, the caveat that camera performance consistency would need to be
tested remains in effect, as image quality plays a very important role
in our app.

## References

1.  Pardee K, Green AA, Ferrante T, Cameron DE, DaleyKeyser A, Yin P,
    Collins JJ. 2014. *Paper-based synthetic gene networks.* Cell.
    159(4): 940-954.

2.  Brody, C. (2016) Cordova/PhoneGap sqlite storage adapter*,*
    litehelpers/Cordova-sqlite-storage, Retrieved from
    <https://github.com/litehelpers/Cordova-sqlite-storage>

3.  Gonzalez, R. and Woods, R. 1992. *Digital Image Processing.*
    Addison Wesley. 414-428.

4.  Lindbloom, J.B. 2003. Useful Colour Equations*,* Retrieved from
    [*http://www.brucelindbloom.com/index.html?Equations.html*](http://www.brucelindbloom.com/index.html?Equations.html)

5.  Sharma, G. 2003. *Digital Colour Imaging.* New York, Webster:
    CRC Press.

## APPENDICES

##### Appendix I: Edge Detection

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
  
##### Appendix II: Colourspace Conversion

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

##### Appendix III: Euclidean Distance Calculation
    function colorsDiff(data1,data2){ //[r,g,b,a,r,g,b,a,r,...]
      var v1;
      var v2;
      var lab1;
      var lab2;
      var sum_diff = 0;
      for (var i = 0; i < data1.length; i+=4) {
        v1 = data1.slice(i,i+3);
        lab1 = RGBtoLAB(v1);

        v2 = data2.slice(i,i+3);
        lab2 = RGBtoLAB(v2);

        sum_diff += euclidean_distance(lab1,lab2);
      }
      var result = sum_diff / (data1.length/4);
      
      var result = 100 * sum_diff / (data1.length/4 * 3 * 255);//*/

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

Appendix IV: Projects page

![](media/image1.png){width="4.648661417322835in"
height="8.245179352580928in"}

Appendix V: Creating New Project

![](media/image2.png){width="4.355261373578303in"
height="7.724785651793526in"}

Appendix VI: Sample Project

![](media/image3.png){width="4.578431758530184in"
height="8.120616797900263in"}

Appendix VII: Creating New Test

![](media/image4.png){width="3.9521981627296587in"
height="7.009885170603675in"}

Appendix VIII: List of Tests

![](media/image5.png){width="4.696078302712161in"
height="8.329282589676291in"}

Appendix IX: Input Image

![](media/image6.png){width="4.3004297900262465in"
height="7.62753280839895in"}

Appendix X: Analysis Results

![](media/image7.png){width="4.764738626421697in"
height="8.451061898512686in"}
