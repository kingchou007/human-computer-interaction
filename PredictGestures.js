const knnClassifier = ml5.KNNClassifier();
var trainingCompleted = false;
var numSamples = 2;
var testingSampleIndex = 0;
// var predictedClassLabels = nj.zeros(2);
var controllerOptions;
var moreThanOneHand;

// function draw(){
Leap.loop(controllerOptions, function(frame){
    clear();
    if (trainingCompleted == false){
        Train();
    }
    HandleFrame(frame);
    Test();
});

// Train 0 and 2
function Train(){
    trainingCompleted = true;
    for (var i = 0; i < train0.shape[3]; i++) {
        var features = train0.pick(null,null,null,i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),0);
        features = train2.pick(null,null,null,i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),2);
    }
}

function Test(){
    var currentFeatures =  test.pick(null,null,null,testingSampleIndex).reshape(1,120);
    var currentLabel =  0;
    var predictedLabel = knnClassifier.classify(currentFeatures.tolist());
    knnClassifier.classify(currentFeatures.tolist(),GotResults);
}

function GotResults(err, result){
    console.log(testingSampleIndex + ": " + result.label);
    predictedClassLabels.set(testingSampleIndex, parseInt(result.label));
    testingSampleIndex += 1;
    if (testingSampleIndex > 99){
        testingSampleIndex = 0;
    }


}

function DrawCircles(){
}


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

    framesOfData.set(fingerIndex, boneType, 0, currentSample, x1);
    framesOfData.set(fingerIndex, boneType, 1, currentSample, y1);
    framesOfData.set(fingerIndex, boneType, 2, currentSample, z1);
    framesOfData.set(fingerIndex, boneType, 3, currentSample, x2);
    framesOfData.set(fingerIndex, boneType, 4, currentSample, y2);
    framesOfData.set(fingerIndex, boneType, 5, currentSample, z2);

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