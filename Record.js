// var controllerOptions = {};
// var x = window.innerWidth / 2;
// var y = window.innerHeight / 2;
// var z = 0;
// var x1 = window.innerWidth / 2;
// var y1 = window.innerHeight / 2;
// var z1 = 0;
// var x2 = window.innerWidth / 2;
// var y2 = window.innerHeight / 2;
// var z2 = 0;
// var previousNumHands = 0;
// var currentNumHands = 0;
// var moreThanOneHand;
// var numSamples = 100;
// var currentSample = 0;
// nj.config.printThreshold = 1000;
// var framesOfData = nj.zeros([5, 4, 6, numSamples]);
//
//
// Leap.loop(controllerOptions, function(frame)
//     {
//         currentNumHands = frame.hands.length;
//         clear();
//         HandleFrame(frame);
//         RecordData();
//         previousNumHands = currentNumHands;
//     }
// );
//
//
// function HandleFrame(frame) {
//     var interactionBox = frame.interactionBox;
//     if (frame.hands.length == 1){
//         moreThanOneHand = false;
//         var hand = frame.hands[0];
//         HandleHand(hand, moreThanOneHand, interactionBox);
//     } else if (frame.hands.length > 1) {
//         moreThanOneHand = true;
//         var hand = frame.hands[0];
//         HandleHand(hand, moreThanOneHand, interactionBox);
//     } else {
//         moreThanOneHand = false;
//     }
// }
//
//
// function HandleHand(hand, moreThanOneHand, interactionBox) {
//     var fingers = hand.fingers;
//     for (var i = 3; i >= 0; i -= 1) {
//         for (var j = 4; j >= 0; j -= 1) {
//
//             HandleBone(fingers[j].bones[i], fingers[j].bones[i].type, j, moreThanOneHand, interactionBox);
//         }
//     }
// }
//
//
// function HandleBone(bone, boneType, fingerIndex, moreThanOneHand, interactionBox) {
//     var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
//     var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);
//
//     x1 = normalizedNextJoint[0];
//     y1 = normalizedNextJoint[1];
//     z1 = normalizedNextJoint[2];
//
//     x2 = normalizedPrevJoint[0];
//     y2 = normalizedPrevJoint[1];
//     z2 = normalizedPrevJoint[2];
//
//     framesOfData.set(fingerIndex, boneType, 0, currentSample, x1);
//     framesOfData.set(fingerIndex, boneType, 1, currentSample, y1);
//     framesOfData.set(fingerIndex, boneType, 2, currentSample, z1);
//     framesOfData.set(fingerIndex, boneType, 3, currentSample, x2);
//     framesOfData.set(fingerIndex, boneType, 4, currentSample, y2);
//     framesOfData.set(fingerIndex, boneType, 5, currentSample, z2);
//
//     var canvasPrevX = window.innerWidth * normalizedPrevJoint[0];
//     var canvasPrevY = window.innerHeight * (1 - normalizedPrevJoint[1]);
//
//     var canvasNextX = window.innerWidth * normalizedNextJoint[0];
//     var canvasNextY = window.innerHeight * (1 - normalizedNextJoint[1]);
//
//     if (moreThanOneHand) {
//         if (boneType == 0) {
//             strokeWeight(12*3);
//             stroke(255,0,0);
//         } else if (boneType == 1) {
//             strokeWeight(8*3);
//             stroke(207,0,0);
//         } else if (boneType == 2) {
//             strokeWeight(5*3);
//             stroke(158,0,0);
//         } else {
//             strokeWeight(2*3);
//             stroke(0,0,0);
//         }
//     } else {
//         if (boneType == 0) {
//             strokeWeight(12*3);
//             stroke(0,255,0);
//         } else if (boneType == 1) {
//             strokeWeight(8*3);
//             stroke(0,207,0);
//         } else if (boneType == 2) {
//             strokeWeight(5*3);
//             stroke(0,158,0);
//         } else {
//             strokeWeight(2*3);
//             stroke(0,0,0);
//         }
//     }
//     line(canvasNextX, canvasNextY, canvasPrevX, canvasPrevY, z1, z2);
// }
//
//
// function RecordData() {
//     if (currentNumHands == 2) {
//         currentSample += 1;
//
//         if (currentSample == numSamples) {
//             currentSample = 0;
//         }
//     }
//
//     if (previousNumHands == 2 && currentNumHands == 1) {
//         background(0)
//         console.log(framesOfData.toString());
//     }
// }


var controllerOptions = {};
nj.config.printThreshold = 1000;
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;
var z = 0;
// Bone Vars
var xt = window.innerWidth / 2;
var yt = window.innerHeight / 2;
var zt = 0;
var xb = window.innerWidth / 2;
var yb = window.innerHeight / 2;
var zb = 0;
var previousNumHands = 0;
var currentNumHands = 0;
var moreThanOneHand;
var numSamples = 100;
var currentSample = 0;
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
    } else if (frame.hands.length > 1) {
        moreThanOneHand = true;
        var hand = frame.hands[0];
        HandleHand(hand, moreThanOneHand, interactionBox);
    } else {
        moreThanOneHand = false;
    }
}
function HandleHand(hand, moreThanOneHand, interactionBox) {
    var fingers = hand.fingers;
    for (var i = 3; i >= 0; i -= 1) {     // For each bone
        for (var j = 4; j >= 0; j -= 1) {   // For each finger

            HandleBone(fingers[j].bones[i], fingers[j].bones[i].type, j, moreThanOneHand, interactionBox);
        }
    }
}

function HandleBone(bone, boneType, fingerIndex, moreThanOneHand, interactionBox) {
    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);


    xt = normalizedNextJoint[0];
    yt = normalizedNextJoint[1];
    zt = normalizedNextJoint[2];

    xb = normalizedPrevJoint[0];
    yb = normalizedPrevJoint[1];
    zb = normalizedPrevJoint[2];


    // console.log("Normalized Prev Joint: " + normalizedPrevJoint);
    // console.log("Normalized Next Joint: " + normalizedNextJoint);

    framesOfData.set(fingerIndex, boneType, 0, currentSample, xb);
    framesOfData.set(fingerIndex, boneType, 1, currentSample, yb);
    framesOfData.set(fingerIndex, boneType, 2, currentSample, zb);
    framesOfData.set(fingerIndex, boneType, 3, currentSample, xt);
    framesOfData.set(fingerIndex, boneType, 4, currentSample, yt);
    framesOfData.set(fingerIndex, boneType, 5, currentSample, zt);


    var canvasPrevX = window.innerWidth * normalizedPrevJoint[0];
    var canvasPrevY = window.innerHeight * (1 - normalizedPrevJoint[1]);

    var canvasNextX = window.innerWidth * normalizedNextJoint[0];
    var canvasNextY = window.innerHeight * (1 - normalizedNextJoint[1]);

    // console.log(oneFrameOfData);
    if (moreThanOneHand) {
        if (boneType == 0) {
            strokeWeight(8*3);
            // stroke(20);
            stroke(255,0,0);
        } else if (boneType == 1) {
            strokeWeight(6*3);
            // stroke(60);
            stroke(207,0,0);
        } else if (boneType == 2) {
            strokeWeight(4*3);
            // stroke(80);
            stroke(158,0,0);
        } else {
            strokeWeight(2*3);
            // stroke(100);
            stroke(115,0,0);
        }
    } else {
        if (boneType == 0) {
            strokeWeight(8*3);
            // stroke(20);
            stroke(0,255,0);
        } else if (boneType == 1) {
            strokeWeight(6*3);
            // stroke(60);
            stroke(0,207,0);
        } else if (boneType == 2) {
            strokeWeight(4*3);
            // stroke(80);
            stroke(0,158,0);
        } else {
            strokeWeight(2*3);
            // stroke(100);
            stroke(0,115,0);
        }
    }
    line(canvasNextX, canvasNextY, canvasPrevX, canvasPrevY, zt, zb);
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
        // console.log(framesOfData.pick(null, null, null, currentSample).toString());
        // console.log(framesOfData.pick(null, null, null, 0).toString());
        // console.log(framesOfData.pick(null, null, null, 1).toString());
        //CenterData();
        console.log(framesOfData.toString());

        //console.log(currentSample);
    }
}

function CenterData(){
    CenterDataX();
    CenterDataY();
    CenterDataZ();
}
function CenterDataX(){
    //Find mean
    var xValues = framesOfData.slice([],[],[0,6,3]);	//All 40 x-coor
    //console.log(xValues.toString());
    var currentMean = xValues.mean();					//Mean of all 40
    var horizontalShift = 0.5 - currentMean;
    //Shifts all x coords
    for (var f = 0; f < 5; f++) {
        for (var b = 0; b < 4; b++) {
            var currentX = framesOfData.get(f,b,0);
            var shiftedX = currentX + horizontalShift;
            framesOfData.set(f,b,0, shiftedX);
            currentX = framesOfData.get(f,b,3);
            shiftedX = currentX + horizontalShift;
            framesOfData.set(f,b,3, shiftedX);
        }
    }
}
function CenterDataY(){
    //Find mean
    var yValues = framesOfData.slice([],[],[1,6,3]);
    var currentMeanY = yValues.mean();
    var verticalShift = 0.5 - currentMeanY;
    //console.log("y " + currentMean);
    //Shifts all Y coords
    for (var f = 0; f < 5; f++) {
        for (var b = 0; b < 4; b++) {
            var currentY = framesOfData.get(f,b,1);
            var shiftedY = currentY + verticalShift;
            framesOfData.set(f,b,1, shiftedY);
            currentY = framesOfData.get(f,b,4);
            shiftedY = currentY + verticalShift;
            framesOfData.set(f,b,4, shiftedY);
        }
    }
}
function CenterDataZ(){
    var zValues = framesOfData.slice([],[],[2,6,3]);
    currentMean = zValues.mean();
    var zShift = 0.5 - currentMean;
    //console.log("z " + currentMean);
    //Shifts all Z coords
    for (var f = 0; f < 5; f++) {
        for (var b = 0; b < 4; b++) {
            var currentZ = framesOfData.get(f,b,2);
            var shiftedZ = currentZ + zShift;
            framesOfData.set(f,b,2, shiftedZ);
            currentZ = framesOfData.get(f,b,5);
            shiftedZ = currentZ + zShift;
            framesOfData.set(f,b,5, shiftedZ);
        }
    }
}


