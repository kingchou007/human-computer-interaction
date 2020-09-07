var controllerOptions = {};
// var i = 0;
// var ranX, ranY;
var x = window.innerWidth/2;
var y = window.innerHeight/2;
var rawXMin = 300;
var rawYMin = 300;
var rawXMax = -300;
var rawYMax = -300;


Leap.loop(controllerOptions, function(frame){
    // console.log(i)
    // i+=1
    clear();
    // ranX = Math.floor(Math.random()*2) - 1;
    // ranY = Math.floor(Math.random()*2) - 1;
    // circle(x + ranX, y + ranY, 100);
    HandleFrame(frame);
});


function HandleHand(hand) {
    // clear
    HandleFinger(hand.indexFinger); // index
}


function HandleFrame(frame) {
    if (frame.hands.length == 1) {
        var hand = frame.hands[0];
        HandleHand(hand);
    }
}


function HandleFinger(finger) {
    var x, y, z;
    [x, y, z] = finger.tipPosition;

    if (x < rawXMin) {
        rawXMin = x;
    }
    
    if (x > rawXMax) {
        rawXMax = x;
    }

    if (y < rawYMin) {
        rawYMin = y;
    }

    if (y > rawYMax) {
        rawYMax = y;
    }
    
    // scale value (https://stackoverflow.com/questions/14224535/scaling-between-two-number-ranges)
    var scaX  = window.innerWidth * ((x - rawXMin)/(rawXMax - rawXMin));
    var scaY  = window.innerHeight * ((y - rawYMin)/(rawYMax - rawYMin));

    // circle function (https://p5js.org/reference/#/p5/circle)
    circle(scaX, window.innerHeight - scaY, 100);   
}
