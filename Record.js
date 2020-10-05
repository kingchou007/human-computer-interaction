var controllerOptions = {};
var oneFrameOfData = nj.zeros([5,4,6]);
// var rawXMin = -10;
// var rawXMax = 20;
// var rawYMin = -10;
// var rawYMax = 20;
var previousNumHands = 0;
var currentNumHands = 0;
var moreHands;
var numSamples = 2;
var currentSample = 0;


Leap.loop(controllerOptions, function(frame){
    currentNumHands = frame.hands.length;
    clear();
    HandleFrame(frame);
    RecordData();
    console.log();
    previousNumHands = currentNumHands;
});


function HandleFrame(frame) {
    var interactionBox = frame.interactionBox;

    if (frame.hands.length == 1){
        moreHands = false;
        var hand = frame.hands[0];
        HandleHand(hand, moreHands, interactionBox);
    } else if (frame.hands.length > 1) {
        moreHands = true;
        var hand = frame.hands[0];
        HandleHand(hand, moreHands, interactionBox);
    } else {
        moreHands = false;
    }
}


function HandleHand(hand, moreHands, interactionBox) {
    var fingers = hand.fingers;
    for (var i = 3; i >= 0; i -= 1) {
        for (var j = 4; j >= 0; j -= 1) {
            HandleBone(fingers[j].bones[i], fingers[j].bones[i].type, j, moreHands, interactionBox);
        }
    }
}


function HandleBone(bone, boneType, fingerIndex, moreHands, interactionBox) {
    var x1 = normalizedNextJoint[0];
    var y1 = normalizedNextJoint[1];
    var z1 = normalizedNextJoint[2];

    var x2 = normalizedPrevJoint[0];
    var y2 = normalizedPrevJoint[1];
    var z2 = normalizedPrevJoint[2];

    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);

    var canvasPrevX = window.innerWidth * normalizedPrevJoint[0];
    var canvasPrevY = window.innerHeight * (1 - normalizedPrevJoint[1]);

    var canvasNextX = window.innerWidth * normalizedNextJoint[0];
    var canvasNextY = window.innerHeight * (1 - normalizedNextJoint[1]);

    // console.log(window.innerWidth + window.innerHeight);
    // console.log( canvasPrevX + canvasPrevY);
    // console.log( canvasNextX + canvasNextY);

    // [x1, y1] = TransformCoordinates(x1, y1);
    // [x2, y2] = TransformCoordinates(x2, y2);

    frameOfData.set(fingerIndex, boneType, 0, x1);
    frameOfData.set(fingerIndex, boneType, 1, y1);
    frameOfData.set(fingerIndex, boneType, 2, z1);
    frameOfData.set(fingerIndex, boneType, 3, x2);
    frameOfData.set(fingerIndex, boneType, 4, y2);
    frameOfData.set(fingerIndex, boneType, 5, z2);

    if (moreHands) {
        if (boneType == 0) {
            strokeWeight(12);
            stroke(250,0,0);
        } else if (boneType == 1) {
            strokeWeight(8);
            stroke(160,0,0);
        } else if (boneType == 2) {
            strokeWeight(5);
            stroke(110,0,0);
        } else {
            strokeWeight(2);
            stroke(50,0,0);
        }
    } else {
        if (boneType == 0) {
            strokeWeight(12);
            stroke(0,250,0);
        } else if (boneType == 1) {
            strokeWeight(8);
            stroke(0,160,0);
        } else if (boneType == 2) {
            strokeWeight(5);
            stroke(0,110,0);
        } else {
            strokeWeight(2);
            stroke(0,50,0);
        }
    }
    line(canvasNextX, canvasNextY, canvasPrevX, canvasPrevY, z1, z2);
}


function RecordData() {
    if (previousNumHands == 1 && currentNumHands == 2) {
        currentSample++;
        if (currentSample >= numSamples) {
            currentSample = 0;
        }
    }
    if (previousNumHands == 2 && currentNumHands == 1) {
        background(0)
        console.log(frameOfData.pick(null, null, null, 1).toString());
    }
}

