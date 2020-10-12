var controllerOptions = {};
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;
var z = 0;
var x1 = window.innerWidth / 2;
var y1 = window.innerHeight / 2;
var z1 = 0;
var x2 = window.innerWidth / 2;
var y2 = window.innerHeight / 2;
var z2 = 0;
var previousNumHands = 0;
var currentNumHands = 0;
var moreThanOneHand;
var numSamples = 100;
var currentSample = 0;
nj.config.printThreshold = 1000;
var framesOfData = nj.zeros([5, 4, 6, numSamples]);


Leap.loop(controllerOptions, function(frame)
    {
        currentNumHands = frame.hands.length;
        clear();
        HandleFrame(frame);
        RecordData();
        previousNumHands = currentNumHands;
    }
);


function HandleFrame(frame) {
    var interactionBox = frame.interactionBox;
    if (frame.hands.length == 1){
        moreThanOneHand = false;
        var hand = frame.hands[0];
        HandleHand(hand, moreThanOneHand, interactionBox);
        console.log(oneFrameOfData.toString);
        Test();
    } else if (frame.hands.length > 1) {
        moreThanOneHand = true;
        var hand = frame.hands[0];
        HandleHand(hand, moreThanOneHand, interactionBox);
        console.log(oneFrameOfData.toString);
        Test();
    } else {
        moreThanOneHand = false;
    }
}


function HandleHand(hand, moreThanOneHand, interactionBox) {
    var fingers = hand.fingers;
    for (var i = 3; i >= 0; i -= 1) {
        for (var j = 4; j >= 0; j -= 1) {

            HandleBone(fingers[j].bones[i], fingers[j].bones[i].type, j, moreThanOneHand, interactionBox);
        }
    }
}


function HandleBone(bone, boneType, fingerIndex, moreThanOneHand, interactionBox) {
    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);

    x1 = normalizedNextJoint[0];
    y1 = normalizedNextJoint[1];
    z1 = normalizedNextJoint[2];

    x2 = normalizedPrevJoint[0];
    y2 = normalizedPrevJoint[1];
    z2 = normalizedPrevJoint[2];

    oneFrameOfData.set(fingerIndex, boneType, 0, x1);
    oneFrameOfData.set(fingerIndex, boneType, 1, y1);
    oneFrameOfData.set(fingerIndex, boneType, 2, z1);
    oneFrameOfData.set(fingerIndex, boneType, 3, x2);
    oneFrameOfData.set(fingerIndex, boneType, 4, y2);
    oneFrameOfData.set(fingerIndex, boneType, 5, z2);

    var canvasPrevX = window.innerWidth * normalizedPrevJoint[0];
    var canvasPrevY = window.innerHeight * (1 - normalizedPrevJoint[1]);

    var canvasNextX = window.innerWidth * normalizedNextJoint[0];
    var canvasNextY = window.innerHeight * (1 - normalizedNextJoint[1]);

    if (moreThanOneHand) {
        if (boneType == 0) {
            strokeWeight(12*3);
            stroke(255,0,0);
        } else if (boneType == 1) {
            strokeWeight(8*3);
            stroke(207,0,0);
        } else if (boneType == 2) {
            strokeWeight(5*3);
            stroke(158,0,0);
        } else {
            strokeWeight(2*3);
            stroke(0,0,0);
        }
    } else {
        if (boneType == 0) {
            strokeWeight(12*3);
            stroke(0,255,0);
        } else if (boneType == 1) {
            strokeWeight(8*3);
            stroke(0,207,0);
        } else if (boneType == 2) {
            strokeWeight(5*3);
            stroke(0,158,0);
        } else {
            strokeWeight(2*3);
            stroke(0,0,0);
        }
    }
    line(canvasNextX, canvasNextY, canvasPrevX, canvasPrevY, z1, z2);
}


function RecordData() {
    if (currentNumHands == 2) {
        currentSample += 1;

        if (currentSample == numSamples) {
            currentSample = 0;
        }
    }

    if (previousNumHands == 2 && currentNumHands == 1) {
        background(0)
        console.log(framesOfData.toString());
    }
}


