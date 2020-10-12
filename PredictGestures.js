const knnClassifier = ml5.KNNClassifier();
var trainingCompleted = false;
var numSamples = 2;
var testingSampleIndex = 0;
// var predictedClassLabels = nj.zeros(2);

// function draw(){
Leap.loop(controllerOptions, function(frame){
    clear();
    if (trainingCompleted == false){
        Train();
    }
    Test();
});

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
    for (var j = 0; j < numSamples; j++) {
        var x = irisData.pick(j).get(0);
        var y = irisData.pick(j).get(1);
        var c = irisData.pick(j).get(4);

        if (c == 0){
            fill('rgb(250,0,0)');
        } else if (c == 1){
            fill('rgb(0,235,0)');
        } else {
            fill('rgb(0,0,250)');
        }

        if (j % 2 == 0){
            stroke('rgb(0,0,0)');
        } else {
            console.log(j + ": " + predictedClassLabels.get(j));
            if (predictedClassLabels.get(j) == 0){
                stroke('rgb(250,0,0)');
            } else if (predictedClassLabels.get(j) == 1){
                stroke('rgb(0,235,0)');
            } else {
                stroke('rgb(0,0,250)');
            }
        }

        circle(x*100,y*100,10);
    }
}