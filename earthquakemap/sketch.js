//https://www.youtube.com/watch?v=ZiYdOwOrGyc&list=PLRqwX-V7Uu6a-SQiI4RtIwuOrLJGnel0r&index=11

//21:26

var mapimg;

//variables for centering the map
var clat = 0;
var clon = 0;

var lat = 49.2827;
var lon = -123.1207;

var zoom = 1;

var earthquakes;

var counter = 1;
var ticker = 0;

function preload() {
    //preloads the map image
    mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,01,1,0/1024x512?access_token=pk.eyJ1IjoibXdlaW5iZXJnIiwiYSI6ImNqZ2I5azJtNTJlemYyd215ZTV3bXBmcWoifQ.Rd-1dcf3z9asEQqbu1MxOw');

    earthquakes = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');
}
// converting lon into the projection of lon
//abotu 15:50 into the video
function mercX(lon) {
    lon = radians(lon);
    var a = (256 / PI) * pow(2, zoom);
    var b = lon + PI;
    return a * b;
}

//converting lat into the projection of lat
function mercY(lat) {
    lat = radians(lat);
    var a = (256 / PI) * pow(2, zoom);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
}



function setup() {
    createCanvas(1024, 512);
    //moves origin point from top left to center of canvas

    //frames per second, default is 60
    frameRate(120);
}





function draw() {

    translate(width / 2, height / 2);
    //makes the image start drawing from the center
    imageMode(CENTER);
    image(mapimg,0,0);

    //for the progress bar
    strokeWeight(2);
    stroke('grey');
    line(100, 200, 300, 200);

    var cx = mercX(clon);
    var cy = mercY(clat);

    if (counter > earthquakes.length) {
        counter = earthquakes.length;
    }

    //progress bar 
    ticker = map(counter, 0, earthquakes.length, 100, 300);
    line(ticker, 190, ticker, 210);

    // walk through eath line of earthquakes until you get to the end
    //because loadStrings will load earthquakes as a
    //set of lines
    for (var i = 0; i < counter; i++) {
        //use regex to break up the line along commas
        var data = earthquakes[i].split(/,/);

        //print data for debugging
        //console.log(data);

        //pull out the relevant info
        var lat = data[1];
        var lon = data[2];
        var depth = data[3];
        var mag = data[4];

        //correct for log scale of ricter scale
        mag = pow(10, mag);
        mag = sqrt(mag);
        var magmax = sqrt(pow(10,10));

        //correct depth to change colors
        var depthmod = map(depth, 0, 25, 0, 255)

        //draw a circle with it
        var x = mercX(lon) - cx;
        var y = mercY(lat) - cy;
        //takes the mag and draws a proportional circle
        var d = map(mag, 0, magmax, 0, 500);

        stroke(depthmod, 0, 255);
        fill(depthmod, 0, 255, 200);
        ellipse(x, y, d, d);


    }

    counter ++;

}
