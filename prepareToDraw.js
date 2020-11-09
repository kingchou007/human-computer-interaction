var img;
var arrowAway;
var arrowTowards;
var arrowRight;
var arrowLeft;
var arrowDown;
var arrowUp;

// create two new variables that point to those two images. (Del_09)
var n0;
var n2;

function setup() {
    createCanvas(window.innerWidth,window.innerHeight);
    img = loadImage('https://i.imgur.com/xlgHoq9.jpg');
    arrowAway = loadImage('https://i.imgur.com/ArRz2qu.jpg');
    arrowTowards  = loadImage('https://i.imgur.com/jemJrwT.jpg');
    arrowRight = loadImage('https://i.imgur.com/Yy9SwoG.jpg');
    arrowLeft = loadImage('https://i.imgur.com/YFXuaXu.jpg');
    arrowDown = loadImage('https://i.imgur.com/6gNfGbL.jpg');
    arrowUp = loadImage('https://i.imgur.com/7MedbAa.jpg');
    n0 = loadImage('https://i.imgur.com/B0BJfCO.png');
    n2 = loadImage('https://i.imgur.com/MHlWfkC.png');
}