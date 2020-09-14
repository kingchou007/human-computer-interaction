var controllerOptions = {};
// var i = 0;
// var ranX, ranY;
var x = window.innerWidth/2;
var y = window.innerHeight/2;
var rawXMin = -10;
var rawXMax = 20;
var rawYMin = -10;
var rawYMax = 20;
// var rawXMin = 300;
// var rawYMin = 300;
// var rawXMax = -300;
// var rawYMax = -300;


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
    var x,y,z;
    var x1,y1,z1;
    var basePosition,tipPosition;
    basePosition = bone.prevJoint;
    tipPosition = bone.nextJoint;

    x = tipPosition[0];
    y = tipPosition[1];
    z = tipPosition[2];
    var newTipPosition = TransformCoordinates(x,z-y)

    x1 = basePosition[0];
    y1 = basePosition[1];
    z1 = basePosition[2];
    var newBasePostion = TransformCoordinates(x1,z1-y1)
    // circle(scaX, window.innerHeight - scaY, 50);

    if (bone.type == 0){
        strokeWeight(4);
        stroke(210);
    } else if (bone.type == 1){
        strokeWeight(3);
        stroke(150);
    } else if (bone.type == 2){
        strokeWeight(2);
        stroke(50);
    } else {
        strokeWeight(1);
        stroke(51);
    }

    line(newTipPosition[0], newTipPosition[1], newBasePostion[0], newBasePostion[1]);
}

function TransformCoordinates(x,y) {
    if(x < rawXMin){
        rawXMin = x;
    }
    if(y < rawYMin){
        rawYMin = y;
    }
    if(x > rawXMax){
        rawXMax = x;
    }
    if(y > rawYMax){
        rawYMax = y;
    }

    var scaX = ((x - rawXMin)/(rawXMax - rawXMin)) * (window.innerWidth);
    var scaY = ((y - rawYMin)/(rawYMax - rawYMin)) * (window.innerHeight);
    return [scaX, scaY];
}