const knnClassifier = ml5.KNNClassifier();
var numSamples = irisData.shape[0];
var numFeatures = irisData.shape[1] - 1;
var testingSampleIndex = 1;


function draw() {
    clear();
    if (!trainingCompleted) {
        Train();
        trainingCompleted = true;
    }
    if (!testingCompleted) {
        Test();
    } else {
        DrawCircles();
    }
}

function GotResults(err, result){
}

function Train() {
    for (var i = 0; i < train0.shape[3]; i++) {
        var features = train0.pick(null,null, null, i);
    }
}

function Test() {

}

function DrawCircles() {

}