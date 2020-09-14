var controllerOptions = {};
// var i = 0;
// var ranX, ranY;
var x = window.innerWidth/2;
var y = window.innerHeight/2;
var rawXMin, rawXMax, rawYMin, rawYMax;
var rawXMin = 300;
var rawYMin = 300;
var rawXMax = -300;
var rawYMax = -300;


Leap.loop(controllerOptions, function(frame){
    clear();
    HandleFrame(frame);
});


function HandleHand(hand) {
    // HandleFinger(hand.indexFinger);
    var fingers = hand.fingers;
    for (let i=0; i<fingers.length; i++){
        HandleFinger(fingers[i])
    }
}


function HandleFrame(frame){
    if (frame.hands.length == 1) {
        var hand = frame.hands[0];
        HandleHand(hand);
    }
}


function HandleFinger(finger){
    var bones = finger.bones;
    for(var i=0; i<bones.length; i++){
        HandleBone(finger.bones[i]);
    }
}


function HandleBone(bone){
    var basePosition, tipPosition;
    var x, y;

    basePosition = bone.prevJoint;
    tipPosition = bone.nextJoint;
    x = tipPosition[0];
    y = tipPosition[1];

    if (x < rawXMin){
        rawXMin = x;
    }
    if (x > rawXMax){
        rawXMax = x;
    }
    if (y < rawYMin){
        rawYMin = y;
    }
    if (y > rawYMax){
        rawYMax = y;
    }

    var scaX = ((x - rawXMin)/(rawXMax - rawXMin)) * (window.innerWidth);
    var scaY = ((y - rawYMin)/(rawYMax - rawYMin)) * (window.innerHeight);
    circle(scaX, window.innerHeight - scaY, 50);
}

