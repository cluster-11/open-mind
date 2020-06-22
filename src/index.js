import p5 from "p5";
import ml5 from "ml5";
let video;
let features;
let knn;
let labelP;
let ready = false;
const containerElement = document.getElementById("p5-container");
const sketch = (p) => {
  p.setup = function () {
    p.createCanvas(600, 400);
    video = p.createCapture(p5.VIDEO);
    video.size(600, 400);
    video.hide();
    features = ml5.featureExtractor("MobileNet", () => {
      console.log("Model is ready");
    });
    knn = ml5.KNNClassifier();
    labelP = p.createP("need training data");
  };

  p.draw = function () {
    //drawing the element on the dom p.
    p.image(video, 0, 0);

    setTimeout(() => {
      //checking if any data had been given to the model yet
      if (knn.getNumLabels() > 0) {
        goClassify();
        ready = true;
      }
    }, 20000);
  };

  //handling key press and training the model
  p.keyPressed = function () {
    //takes a instance of the video right at the moment when any key pressed
    const logits = features.infer(video);
    // TRAINING THE KNN MODEL
    if (p.key == "l") {
      //if the pressed key is 'l', adding that video instance(logits) and categorizing it as 'left'
      knn.addExample(logits, "left");
      console.log("left");
    } else if (p.key == "r") {
      knn.addExample(logits, "right");
      console.log("right");
    } else if (p.key == "u") {
      knn.addExample(logits, "up");
      console.log("up");
    }
  };
  function goClassify() {
    const logits = features.infer(video);
    //classifying the video instance (logits) and getting the result based on training data
    knn.classify(logits, (error, result) => {
      if (error) {
        console.error(error);
      } else {
        // displaying the result on the dom
        labelP.html(result.label);
        labelP.style("font-size", "64pt");

        //doing the classification continuously, so after a good training, the video recorder will capture every moment and shows it result
        goClassify();
      }
    });
  }
};

new p5(sketch, containerElement);
