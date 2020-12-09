//Global Variables
var controllerOptions = {};
//kNN classifier
const knnClassifier = ml5.KNNClassifier();
var trainingCompleted = false;
var testingSampleIndex = 0;
var predictedClassLabels = nj.zeros(2);
//6 coords(two sets of x,y,z for top & bottom) for each 4 bones for each 5 fingers - 5x4x6
var oneFrameOfData = nj.zeros([5,4,6]);
var numPrediction = 0;
var meanPredictionAccuracy = 0;
var digitTested = 1;
var programState = 0;
var digitToShow = 1;
var timeSinceLastDigitChange = new Date();
var timeWithDigit = false;
//In order to make time window smaller
var maxTimeWindow = 6;
var minTimeWindow = 1;
var timeWindowPerDigit = [maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow, maxTimeWindow];
var timewindow;
//In order to visualization that shows how their performance during their current session differs from their performance during their last
//Store current accuracies per digit
var currentCorrectSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var timesDigitTested = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var currentMeanAccuracies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//Store pervious accuracies per digit
// var perviousCorrectAvg = [0.7, 0.75, 0.72, 0.79, 0.73, 0, 0, 0, 0, 0];
var currentCorrectAvg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var perviousCorrectAvg = [50.123, 50.789, 55.8789, 50.890, 50.261, 0, 0, 0, 0, 0];
var printCorrectAvgOnce = false;
// var printPerviousCorrectAvg = false;



var sessions = 2;
var avgCorrectOverall = [50, 50, 50, 50, 50, 0, 0, 0, 0, 0];
var avgCorrectOverallUser1 = [50, 51, 56, 51, 50, 0, 0, 0, 0, 0];
rank = 0;


Leap.loop(controllerOptions, function(frame){
    clear();
    if (trainingCompleted == false){
        //TrainKNNIfNotDoneYet()
        Train();
    }
    DetermineState(frame);
    if (programState==0) {
        HandleState0(frame);
    } else if (programState==1) {
        HandleState1(frame);
    } else {
        HandleState2(frame);
        // printPerviousCorrectAvg = true;
        printCorrectAvgOnce = true;
    }
});

function DetermineState(frame){
    if(frame.hands.length == 0){
        programState = 0;	//No hand(s) present
    } else if (HandIsUncentered()) {
        programState = 1;	//Hand uncentered
    } else {
        programState = 2; 	//Else
    }
}

function HandleState0(frame) {	//No hand(s)
    //TrainKNNIfNotDoneYet()
    DrawImageToHelpUserPutTheirHandOverTheDevice()
    //Print Mean Accuracy,
    if (printCorrectAvgOnce){
        for (var i = 0; i < currentCorrectAvg.length; i++) {
            if (timesDigitTested[i] == 0) {
                currentCorrectAvg[i] = 0;
            }
        }
        console.log(currentCorrectAvg);
        // printPerviousCorrectAvg = false;
        printCorrectAvgOnce = false;
    }
}

function HandleState1(frame){	//Hand(s) uncentered
    HandleFrame(frame);
    if (HandIsTooFarToTheLeft()){
        DrawArrowRight();
    }
    else if (HandIsTooFarToTheRight()){
        DrawArrowLeft();
    }
    else if (HandIsTooFarToTheUp()){
        DrawArrowDown();
    }
    else if (HandIsTooFarToTheDown()){
        DrawArrowUp();
    }
    else if (HandIsTooFarAway()){
        DrawArrowToward();
    }
    else if (HandIsTooFarToward()){
        DrawArrowAway();
    }
}


function HandleState2(frame){	//Hand(s) centered
    HandleFrame(frame);
    DrawLowerRightPaneDigit();
    //Starts after as new image of digit is put on screen
    if (timeWithDigit == false){
        timeSinceLastDigitChange = new Date();
        timeWithDigit = true;
    }
    DetermineWhetherToSwitchDigits();
    //Write Accuracy to the screen
    strokeWeight(0);
    textSize(18);
    fill(50);
    //text('Current Accuracy', window.innerWidth/8-70, window.innerHeight/2+60);
    //text('Correct:', window.innerWidth/8-70, window.innerHeight/2+80);
    // text('Current Accuracy:', window.innerWidth/8-70, window.innerHeight/2+80);
    if (timesDigitTested[digitToShow] == 0){	//If first time signed of session
        var printCorrect = "Current Accuracy: " + "Null(There is no data for you) ";
    } else {	//Any sign after the first time signed of session
        var printCorrect = "Current Accuracy: " +  ((currentCorrectSum[digitToShow]/timesDigitTested[digitToShow])*100).toFixed(2).toString() + "%";
    }
    text(printCorrect, window.innerWidth/8-70, window.innerHeight/2+60);

    var status;
    if(meanPredictionAccuracy >0.7) {
        text("Awesome! Nice Work!", window.innerWidth/8-70, window.innerHeight/2+100);
    }else if(0.7>meanPredictionAccuracy>0.6){
        text("Good, keep this gesture!", window.innerWidth/8-70, window.innerHeight/2+100);
    }else if(0.6>meanPredictionAccuracy>0.5){
        text("Please continue to adjust your gesture!", window.innerWidth/8-70, window.innerHeight/2+100);
    }else{
        text("Your gesture might be wrong, please refer to the picture on the right!", window.innerWidth/8-70, window.innerHeight/2+100);
    }

    //Write Pervious Accuracy to the screen
    // text('Average Correct', window.innerWidth/8-50+200, window.innerHeight/2+60);
    // text('Last Session Accuracy:', window.innerWidth/8-50+200, window.innerHeight/2+80);
    // text('Last Session Accuracy:', window.innerWidth/8-70, window.innerHeight/2+20+100);
    // var printPervCorrect = (perviousCorrectAvg[digitToShow].toFixed(2)*100).toString() + "%";
    // text(printPervCorrect, window.innerWidth/8-50+200, window.innerHeight/2+100);
    var printPervCorrect = "Last Session Accuracy: " + (perviousCorrectAvg[digitToShow].toFixed(2)).toString() + "%";
    text(printPervCorrect, window.innerWidth/8-70, window.innerHeight/2+140);

    //Update avg correct Over All Sessions, only once info is available
    if (timesDigitTested[digitToShow] == 0){
        avgCorrectOverall[digitToShow] = perviousCorrectAvg[digitToShow];
    } else {
        avgCorrectOverall[digitToShow] = (currentCorrectAvg[digitToShow] + perviousCorrectAvg[digitToShow]) / sessions;
    }

    //Write Average correct over all
    // text('Average Correct', window.innerWidth/8-70, window.innerHeight/2+60+120);
    // text('Over all Sessions:', window.innerWidth/8-70, window.innerHeight/2+80+120);
    //
    //text('Over all Sessions:', window.innerWidth/8-70, window.innerHeight/2+60+100);
    var printAvgCorrectOverall = "The Avg-accuracy of Total Sessions: " + avgCorrectOverall[digitToShow].toFixed(2).toString() + "%";
    text(printAvgCorrectOverall, window.innerWidth/8-70, window.innerHeight/2+180);
    //Write Sessions
    var printSessions = 'Total Sessions: ' + sessions;
    text(printSessions, window.innerWidth/8-70, window.innerHeight/2+220);


    //Users rank compared to others
    if(avgCorrectOverall[digitTested] > avgCorrectOverallUser1[digitTested]){
        rank = 1
    } else {
        rank = 2
    }
    var users = 2;
    var rankMsg = 'User-accuracy Ranking: ' + rank + '/' + users;
    text(rankMsg, window.innerWidth/8+120, window.innerHeight/2+220);

}

function DrawLowerRightPaneASLDigit(){
    if (digitToShow == 0) {
        image(n0, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if(digitToShow == 1){
        image(n1, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 2){
        image(n2, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 3){
        image(n3, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 4){
        image(n4, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 5){
        image(n5, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 6){
        image(n6, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 7){
        image(n7, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 8){
        image(n8, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if(digitToShow == 9) {
        image(n9 , window.innerWidth / 2 , window.innerHeight / 2 , 200 , 200);
    }
}

function DrawLowerRightPaneDigit(){
    if (digitToShow == 0) {
        image(d0, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if(digitToShow == 1){
        image(d1, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 2){
        image(d2, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 3){
        image(d3, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 4){
        image(d4, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 5){
        image(d5, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 6){
        image(d6, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 7){
        image(d7, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if (digitToShow == 8){
        image(d8, window.innerWidth/2, window.innerHeight/2, 200, 200);
    } else if(digitToShow == 9) {
        image(d9 , window.innerWidth / 2 , window.innerHeight / 2 , 200 , 200);
    }

}

//SWITCHING DIGITS
function DetermineWhetherToSwitchDigits() {
    if(TimeToSwitchDigits() == true){
        SwitchDigits();
    }
}

function TimeToSwitchDigits(){
    //Count seconds passed since digit presented
    var currentTime = new Date();
    var ElapsedInMilliseconds = timeSinceLastDigitChange - currentTime;
    var ElapsedInSeconds = ElapsedInMilliseconds/-1000.0;

    //Must meet an accuracy of 50% or 5 seconds pass
    timewindow = TimeWidowForDigit(0)	//No time change just getting time window
    // console.log(ElapsedInSeconds);

    //Which ever is first: digit is signed corrected or time widow has run out
    if (meanPredictionAccuracy >= .50 || ElapsedInSeconds >= timewindow){
        //If digit is signed correctly within time window
        if(meanPredictionAccuracy < 0.35) {
            image(wrong , window.innerWidth/2,0,200,200);
        }else if(meanPredictionAccuracy > 0.35){
            image(right , window.innerWidth/2,0,200,200);
        }

        if (meanPredictionAccuracy >= .50 && ElapsedInSeconds <= timewindow){
            //Shorten time widow
            var changeTime = TimeWidowForDigit(-1);
            currentCorrectSum[digitToShow] = currentCorrectSum[digitToShow] + 1
            console.log(digitToShow + " " + currentCorrectSum[digitToShow])
        } else if (ElapsedInSeconds >= timewindow) {
            // Digit is NOT signed correctly within timewindow
            var changeTime = TimeWidowForDigit(1);
            currentCorrectSum[digitToShow] = currentCorrectSum[digitToShow] + 0
            console.log(digitToShow + " " + currentCorrectSum[digitToShow])
        }
        timeSinceLastDigitChange = new Date();
        timeWithDigit = false;
        return true;
    }
}

// Changes time window, makes sure time widow does not go over the max
function TimeWidowForDigit(timechange){
    if (digitToShow == 0){
        if ((timeWindowPerDigit[0] + timechange) < minTimeWindow){
            return timeWindowPerDigit[0];
        } else if ((timeWindowPerDigit[0] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[0];
        } else {
            timeWindowPerDigit[0] = timeWindowPerDigit[0] + timechange;
            return timeWindowPerDigit[0];
        }
    } else if (digitToShow == 1){
        if ((timeWindowPerDigit[1] + timechange) < minTimeWindow){
            return timeWindowPerDigit[1];
        } else if ((timeWindowPerDigit[1] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[1];
        } else {
            timeWindowPerDigit[1] = timeWindowPerDigit[1] + timechange;
            return timeWindowPerDigit[1];
        }
    } else if (digitToShow == 2){
        if ((timeWindowPerDigit[2] + timechange) < minTimeWindow){
            return timeWindowPerDigit[2];
        } else if ((timeWindowPerDigit[2] + timechange) > maxTimeWindow){
            return timeWindowPerDigit[2];
        } else {
            timeWindowPerDigit[2] = timeWindowPerDigit[2] + timechange;
            return timeWindowPerDigit[2];
        }
    }else if (digitToShow == 3) {
        if ((timeWindowPerDigit[3] + timechange) < minTimeWindow) {
            return timeWindowPerDigit[3];
        } else if ((timeWindowPerDigit[3] + timechange) > maxTimeWindow) {
            return timeWindowPerDigit[3];
        } else {
            timeWindowPerDigit[3] = timeWindowPerDigit[3] + timechange;
            return timeWindowPerDigit[4];
        }
    }else if (digitToShow == 4) {
        if ((timeWindowPerDigit[4] + timechange) < minTimeWindow) {
            return timeWindowPerDigit[4];
        } else if ((timeWindowPerDigit[4] + timechange) > maxTimeWindow) {
            return timeWindowPerDigit[4];
        } else {
            timeWindowPerDigit[4] = timeWindowPerDigit[4] + timechange;
            return timeWindowPerDigit[4];
        }
    }
}

function SwitchDigits(){
    //Adds occurance to digt tested
    timesDigitTested[digitToShow] = timesDigitTested[digitToShow] + 1;
    currentCorrectAvg[digitToShow] = ((currentCorrectSum[digitToShow]/timesDigitTested[digitToShow])*100);

    console.log(currentCorrectAvg[digitToShow]);
    numPrediction = 0;


    if (digitToShow == 0){
    	digitToShow = 1;
    } else if (digitToShow == 1){
    	digitToShow = 2;
    } else if (digitToShow == 2){
    	digitToShow = 3;
    } else if (digitToShow == 3) {
        digitToShow = 4;
    } else if (digitToShow == 4){
        digitToShow = 0;
    }


}

//TRAININ
function Train(){
    trainingCompleted = true;
    for (var i = 0; i < train0.shape[3]; i++) {
        features0 = train0.pick(null,null,null,i);
        features0 = features0.reshape(120);
        knnClassifier.addExample(features0.tolist(), 0);
    }

    for (var i = 0; i < train0.shape[3]; i++) {
        features0w = train0Wills.pick(null,null,null,i);
        features0w = features0w.reshape(120);
        knnClassifier.addExample(features0w.tolist(), 0);
    }

    for (var i = 0; i < train1.shape[3]; i++) {
        features1 = train1.pick(null,null,null,i);
        features1 = features1.reshape(120);
        knnClassifier.addExample(features1.tolist(), 1);
    }

    for (var i = 0; i < train1.shape[3]; i++) {
        features1d = train1Davis.pick(null,null,null,i);
        features1d = features1d.reshape(120);
        knnClassifier.addExample(features1d.tolist(), 1);
    }

    for (var i = 0; i < train1.shape[3]; i++) {
        features1b = train1Bongard.pick(null,null,null,i);
        features1b = features1b.reshape(120);
        knnClassifier.addExample(features1b.tolist(), 1);
    }

    for (var i = 0; i < train2.shape[3]; i++) {
        features2 = train2.pick(null,null,null,i);
        features2 = features2.reshape(120);
        knnClassifier.addExample(features2.tolist(), 2);
    }

    for (var i = 0; i < train3.shape[3]; i++) {
        features3 = train3.pick(null,null,null,i);
        features3 = features3.reshape(120);
        knnClassifier.addExample(features3.tolist(), 3);
    }

    for (var i = 0; i < train4.shape[3]; i++) {
        features4 = train4.pick(null,null,null,i);
        features4 = features4.reshape(120);
        knnClassifier.addExample(features4.tolist(), 4);
    }


    for (var i = 0; i < train4.shape[3]; i++) {
        features4b = train4Bongard.pick(null,null,null,i);
        features4b = features4b.reshape(120);
        knnClassifier.addExample(features4b.tolist(), 4);
    }

    for (var i = 0; i < train5.shape[3]; i++) {
        features5 = train5.pick(null, null, null, i);
        features5 = features5.reshape(120);
        knnClassifier.addExample(features5.tolist(), 5);
    }

    for (var i = 0; i < train5.shape[3]; i++) {
        features5b = train5Bongard.pick(null, null, null, i);
        features5b = features5b.reshape(120);
        knnClassifier.addExample(features5b.tolist(), 5);
    }

    for (var i = 0; i < train6.shape[3]; i++) {
        features6 = train6.pick(null,null,null,i);
        features6 = features6.reshape(120);
        knnClassifier.addExample(features6.tolist(), 6);
    }

    for (var i = 0; i < train7.shape[3]; i++) {
        features7 = train7.pick(null,null,null,i);
        features7 = features7.reshape(120);
        knnClassifier.addExample(features7.tolist(), 7);
    }

    for (var i = 0; i < train7.shape[3]; i++) {
        feature7v = train7Vega.pick(null,null,null,i);
        feature7v = feature7v.reshape(120);
        knnClassifier.addExample(feature7v.tolist(), 7);
    }

    for (var i = 0; i < train7.shape[3]; i++) {
        feature7f = train7Fisher.pick(null,null,null,i);
        feature7f = feature7f.reshape(120);
        knnClassifier.addExample(feature7f.tolist(), 7);
    }

    for (var i = 0; i < train7.shape[3]; i++) {
        feature7m = train7Manian.pick(null,null,null,i);
        feature7m = feature7m.reshape(120);
        knnClassifier.addExample(feature7m.tolist(), 7);
    }

    for (var i = 0; i < train8.shape[3]; i++) {
        features8 = train8.pick(null,null,null,i);
        features8 = features8.reshape(120);
        knnClassifier.addExample(features8.tolist(), 8);
    }

    for (var i = 0; i < train9.shape[3]; i++) {
        features9= train9.pick(null,null,null,i);
        features9 = features9.reshape(120);
        knnClassifier.addExample(features9.tolist(), 9);
    }

}


function Test(){
    //CenterData(); //?????
    var currentFeatures =  oneFrameOfData.pick(null,null,null).reshape(1,120);
    var predictedLabel = knnClassifier.classify(currentFeatures.tolist());
    knnClassifier.classify(currentFeatures.tolist(),GotResults);
}

function GotResults(err, result){
    var currentPrediction = result.label;
    //console.log(currentPrediction);
    predictedClassLabels.set(parseInt(result.label));

    numPrediction += 1;
    meanPredictionAccuracy = (((numPrediction-1)*meanPredictionAccuracy) + (currentPrediction == digitToShow))/numPrediction;
    //Accuracy
    //console.log(numPrediction + " " + meanPredictionAccuracy + " " + currentPrediction);

    console.log(meanPredictionAccuracy.toFixed(2) + " " + currentPrediction);
}

//Handles a single frame
function HandleFrame(frame) {
    var InteractionBox = frame.interactionBox;
    //No hand - variables undefine
    if(frame.hands.length == 1 || frame.hands.length == 2){
        //Grabs 1st hand per frame
        var hand = frame.hands[0];
        HandleHand(hand,1,InteractionBox);
        Test();
        if(frame.hands.length == 2){
            //Grabs 2nd hand per frame
            //var hand = frame.hands[1];
            HandleHand(hand,2,InteractionBox);
        }
    }
}

//Handles a single hand
function HandleHand(hand, numHand, InteractionBox) {
    //Grabs fingers
    var fingers = hand.fingers;
    //Draws all five finger bones(1-4) at a time

    //Distal phalanges are bones.type = 3
    var l = 3;

    //We know there are 4 bones in each finger
    for (var j=0; j<4; j++){
        //All five bones of a type at a time
        for(var k=0; k<fingers.length; k++){
            //Gets all bones of a finger
            var bones = fingers[k].bones;
            //Draws finger w/ finger index i --holds the value of the current finger
            HandleBone(bones[l], k, InteractionBox);
        }
        l--;
    }
}

//Handles a single bone
function HandleBone(bone, fingerIndex, InteractionBox){
    //Capture the X, Y, Z coordinates the TIP of each bone
    var normalizedNextJoint = InteractionBox.normalizePoint(bone.nextJoint, true);
    //console.log(normalizedNextJoint.toString());

    //Capture the X, Y, Z coordinates the BASE of each bone
    var normalizedPrevJoint = InteractionBox.normalizePoint(bone.prevJoint, true);
    //console.log(normalizedPrevJoint.toString());

    //Saves the data to 4x5x6 from [0,1] range		//Possibly make into a for loop!!
    oneFrameOfData.set(fingerIndex, parseInt(bone.type), 0, normalizedPrevJoint[0]);
    oneFrameOfData.set(fingerIndex, parseInt(bone.type), 1, normalizedPrevJoint[1]);
    oneFrameOfData.set(fingerIndex, parseInt(bone.type), 2, normalizedPrevJoint[2]);
    oneFrameOfData.set(fingerIndex, parseInt(bone.type), 3, normalizedNextJoint[0]);
    oneFrameOfData.set(fingerIndex, parseInt(bone.type), 4, normalizedNextJoint[1]);
    oneFrameOfData.set(fingerIndex, parseInt(bone.type), 5, normalizedNextJoint[2]);

    // Convert the normalized coordinates to span the canvas
    var canvasXTip = window.innerWidth/2 * normalizedNextJoint[0];
    var canvasYTip = window.innerHeight/2 * (1 - normalizedNextJoint[1]);
    var canvasXBase = window.innerWidth/2 * normalizedPrevJoint[0];
    var canvasYBase = window.innerHeight/2 * (1 - normalizedPrevJoint[1]);

    //Determine strokeWeight
    var width = 3;
    var accuracyColor = meanPredictionAccuracy;
    //To no go over 50%
    if (meanPredictionAccuracy > 0.35){
        accuracyColor = 0.45
    }

    if (bone.type == 0){
        strokeWeight(12);
        stroke(230*(1-(accuracyColor*2)), (210*(accuracyColor*2)), 0);
        //stroke(red, green, blue);
    } else if (bone.type == 1){
        strokeWeight(8);
        stroke((230*(1-(accuracyColor*2)))-50, (210*(accuracyColor*2))-50, 0);
        //stroke(150);
        //stroke(200, 55, 0);
    } else if (bone.type == 2){
        strokeWeight(5);
        stroke((230*(1-(accuracyColor*2)))-100, (210*(accuracyColor*2))-100, 0);
        //stroke(50);
        //stroke(150, 155, 0);
    } else {
        strokeWeight(2);
        stroke((230*(1-(accuracyColor*2)))-150, (210*(accuracyColor*2))-150, 0);
        //stroke(0, 200, 0);
    }
    //Draw lines
    line(canvasXTip, canvasYTip, canvasXBase, canvasYBase);
}

function CenterData(){
    CenterDataX();
    CenterDataY();
    CenterDataZ();
}

function CenterDataX(){
    //Find mean
    var xValues = oneFrameOfData.slice([],[],[0,6,3]);
    //console.log(xValues.toString());
    var currentMean = xValues.mean();
    var horizontalShift = 0.5 - currentMean;
    //Shifts all x coords
    for (var f = 0; f < 5; f++) {
        for (var b = 0; b < 4; b++) {
            var currentX = oneFrameOfData.get(f,b,0);
            var shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(f,b,0, shiftedX);
            currentX = oneFrameOfData.get(f,b,3);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(f,b,3, shiftedX);
        }
    }
}

function CenterDataY(){
    //Find mean
    var yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentMeanY = yValues.mean();
    var verticalShift = 0.5 - currentMeanY;
    //console.log("y " + currentMean);
    //Shifts all Y coords
    for (var f = 0; f < 5; f++) {
        for (var b = 0; b < 4; b++) {
            var currentY = oneFrameOfData.get(f,b,1);
            var shiftedY = currentY + verticalShift;
            oneFrameOfData.set(f,b,1, shiftedY);
            currentY = oneFrameOfData.get(f,b,4);
            shiftedY = currentY + verticalShift;
            oneFrameOfData.set(f,b,4, shiftedY);
        }
    }
}

function CenterDataZ(){
    var zValues = oneFrameOfData.slice([],[],[2,6,3]);
    currentMean = zValues.mean();
    var zShift = 0.5 - currentMean;
    for (var f = 0; f < 5; f++) {
        for (var b = 0; b < 4; b++) {
            var currentZ = oneFrameOfData.get(f,b,2);
            var shiftedZ = currentZ + zShift;
            oneFrameOfData.set(f,b,2, shiftedZ);
            currentZ = oneFrameOfData.get(f,b,5);
            shiftedZ = currentZ + zShift;
            oneFrameOfData.set(f,b,5, shiftedZ);
        }
    }
}

function DrawImageToHelpUserPutTheirHandOverTheDevice(){
    image(img, 10, 10, window.innerWidth/2, window.innerHeight/2);
}

function DrawArrowRight(){
    image(arrowLeft, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowLeft(){
    image(arrowRight,window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowDown(){
    image(arrowDown, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowUp(){
    image(arrowUp, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowToward(){
    //image(imgHandToward, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
    image(arrowTowards,window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}

function DrawArrowAway(){
    image(arrowAway, window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
}


function HandIsUncentered(){
    if(HandIsTooFarToTheLeft() || HandIsTooFarToTheRight() || HandIsTooFarToTheUp() || HandIsTooFarToTheDown() || HandIsTooFarAway() || HandIsTooFarToward()){
        return true;
    }
    return false;
}

function HandIsTooFarToTheLeft(){
    var xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentMean = xValues.mean();
    if (currentMean < 0.25){
        return true;
    } else {
        return false;
    }
}

function HandIsTooFarToTheRight(){
    var xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentMean = xValues.mean();
    if (currentMean > 0.75){
        return true;
    } else {
        return false;
    }
}

function HandIsTooFarToTheDown(){
    var yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentMeanY = yValues.mean();
    if (currentMeanY < 0.25){
        return true;
    } else {
        return false;
    }
}

function HandIsTooFarToTheUp(){
    var yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentMeanY = yValues.mean();
    if (currentMeanY > 0.75){
        return true;
    } else {
        return false;
    }
}
function HandIsTooFarAway(){
    var zValues = oneFrameOfData.slice([],[],[2,6,3]);
    currentMeanZ = zValues.mean();
    if (currentMeanZ < 0.25){
        return true;
    } else {
        return false;
    }
}

function HandIsTooFarToward(){
    var zValues = oneFrameOfData.slice([],[],[2,6,3]);
    currentMeanZ = zValues.mean();
    if (currentMeanZ > 0.75){
        return true;
    } else {
        return false;
    }
}

// Sign In
function SignIn(){
    //Get username from html input using id
    var username = document.getElementById('username').value;
    //Get an unordered list of users
    var list = document.getElementById('users');
    if(IsNewUser(username, list)){
        CreateNewUser(username,list)
        CreateSignInItem(username,list)
    } else { //Returing User
        //ID tag for the list item user’s number of sign in attempts
        var ID = String(username) + "_signins";
        //Will return such an item.
        var listItem = document.getElementById(ID);
        listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
    }

    console.log(list.innerHTML);
    return false;
}

function IsNewUser(username, list) {
    var usernameFound = false;
    var users = list.children;
    for (var i = 0; i < users.length; i++) {
        if (username == users[i].innerHTML){
            usernameFound = true;
        }
    }
    return usernameFound == false;
}
function CreateNewUser(username,list){
    //Creating an html list item
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
}

function CreateSignInItem(username,list){
    //Creating a 2nd list item (keep track of signins)
    var item2 = document.createElement('li');
    item2.id = String(username) + "_signins";
    item2.innerHTML = 1;
    list.appendChild(item2);
}


