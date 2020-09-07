var controllerOptions = {} ;
var i = 0;
var x = 480, y = 438;
Leap.loop(controllerOptions, function(frame){
    console.log(i)
    clear();
    circle(Math.floor(Math.random() * 2) + 199, Math.floor(Math.random() * 2) + 199,100); 
}
);
