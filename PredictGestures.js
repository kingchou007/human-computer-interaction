var controllerOptions = {};
const knnClassifier = ml5.KNNClassifier();
var trainingCompleted = false;
var numSamples = 2;
// var testingSampleIndex = 0;
var predictedClassLabels = nj.zeros([numSamples]);
var moreThanOneHand;
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;
var z = 0;
var x1 = window.innerWidth / 2;
var y1 = window.innerHeight / 2;
var z1 = 0;
var x2 = window.innerWidth / 2;
var y2 = window.innerHeight / 2;
var z2 = 0;
var oneFrameOfData = nj.zeros([5, 4, 6]);

var meanPredictionAccuracy = 0;
var numOfPredictions = 0;
var digitTested = 2;


// function draw(){
Leap.loop(controllerOptions, function(frame) {
    clear();
    if (trainingCompleted == false){
        Train();
    }
    HandleFrame(frame);
    // console.log(oneFrameOfData.toString())
    // Test();
});

// Train 0 and 2
function Train(){
    trainingCompleted = true;
    for (var i = 0; i < train0.shape[3]; i++) {
        var features = train0.pick(null,null,null,i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),0);
        features = train2.pick(null,null,null,i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),2);
        // console.log(tensorIterator + " " + features.toString());
    }
}

function Test(){
    centerData();
    // var currentFeatures =  oneFrameOfData.pick(null,null,null,testingSampleIndex).reshape(1, 120);
    var currentFeatures =  oneFrameOfData.pick(null,null,null).reshape(1,120);
    var currentLabel =  0;
    var predictedLabel = knnClassifier.classify(currentFeatures.tolist());
    knnClassifier.classify(currentFeatures.tolist(),GotResults);
}

function centerData() {
    xValues = framesOfData.slice([],[],[0,6,3]);
    var currentMean = xValues.mean();
    var horizontalShift = 0.5 - currentMean;
    console.log("x " + currentMeanX);
    // shifts x
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            var currentX = oneFrameOfData.get(i, j, 0);
            var shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(i, j, 0, shiftedX);
            currentX = oneFrameOfData.get(i, j, 3);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(i, j, 3, shiftedX);
        }
    }

}


function GotResults(err, result){
    // console.log(result.label);
    // predictedClassLabels.set(parseInt(result.label));
    // predictedClassLabels.set(testingSampleIndex, parseInt(result.label));
    // console.log(testingSampleIndex + " " + result.label);
    // testingSampleIndex += 1;
    // if (testingSampleIndex > 99){
    //     testingSampleIndex = 0;
    // }
    var currentPrediction = result.label;
    predictedClassLabels.set(parseInt(result.label));
    numOfPredictions += 1;
    meanPredictionAccuracy = (((numOfPredictions-1)*meanPredictionAccuracy) + (currentPrediction == digitTested))/numOfPredictions;
    console.log(numOfPredictions + " " + meanPredictionAccuracy + " " + currentPrediction);

}


function HandleFrame(frame) {
    var interactionBox = frame.interactionBox;
    if (frame.hands.length == 1){
        moreThanOneHand = false;
        var hand = frame.hands[0];
        HandleHand(hand, moreThanOneHand, interactionBox);
        //console.log(oneFrameOfData.toString());
        Test();
    } else if (frame.hands.length > 1) {
        moreThanOneHand = true;
        var hand = frame.hands[0];
        HandleHand(hand, moreThanOneHand, interactionBox);
        //console.log(oneFrameOfData.toString());
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