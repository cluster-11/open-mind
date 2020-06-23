import p5 from "p5";
import ml5 from "ml5";
let video;
let features;
let knn;
let labelP;
let ready = true;
let endTrainingData = false;
let trainingFinished = false;
let logitsContainer = [];
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
    //drawing the element on the dom
    p.image(video, 0, 0);
    //The statement will run only once when all of its condition fulfilled
    if (knn.getNumLabels() > 0 && ready && trainingFinished) {
      goClassify();
      ready = false;
      console.log(p);
    }
  };

  //handling key press and training the model
  p._onkeydown = function () {
    if (!endTrainingData) {
      //takes a instance of the video right at the moment when any key pressed
      const logits = features.infer(video);
      console.log(p.keyCode);
      // TRAINING THE KNN MODEL
      if (p.keyCode == 37) {
        console.log("left", logitsContainer.length);
        logitsContainer.push({ logits, class: "left" });
      } else if (p.keyCode == 39) {
        console.log("right", logitsContainer.length);
        logitsContainer.push({ logits, class: "right" });
      } else if (p.keyCode == 38) {
        console.log("up", logitsContainer.length);
        logitsContainer.push({ logits, class: "up" });
      } else if (p.keyCode == 40) {
        console.log("down", logitsContainer.length);
        logitsContainer.push({ logits, class: "down" });
      }
      //if the user presses enter, gathering all data and training the model
      else if (p.keyCode == 13) {
        //stopping keyPress-events so the user can't add any more data
        endTrainingData = true;

        labelP.html(`Training, ${logitsContainer.length}`);

        logitsContainer.map((data) => {
          //training the model based on data from logitsContainer
          knn.addExample(data.logits, data.class);
        });
        labelP.html("Training Completed");

        //setting trainingFinished to true, so we can start displaying the result
        trainingFinished = true;
      }
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
        //doing the classification continuously, so after a good training, the video recorder will capture every moment with a 50ms gape. and shows it result
        setTimeout(() => {
          goClassify();
        }, 50);
      }
    });
  }
};

new p5(sketch, containerElement);
