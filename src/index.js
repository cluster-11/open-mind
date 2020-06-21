import p5 from "p5";
import ml5 from "ml5";

let video;
let features;

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {
  p.setup = function () {
    p.createCanvas(600, 400);

    video = p.createCapture(p5.VIDEO);

    video.size(600, 400);

    video.hide();

    features = ml5.featureExtractor("MobileNet", modelReady);
  };

  p.draw = function () {
    p.image(video, 0, 0);
  };

  p.mousePressed = function () {
    const logits = features.infer(video);
    console.log(logits.dataSync());
    logits.print();
  };

  function modelReady() {
    console.log("Model is ready");
  }
};

new p5(sketch, containerElement);
