import p5 from "p5";
import ml5 from "ml5";

const video1Container = document.querySelector(".video1-container");
const video2Container = document.querySelector(".video2-container");
const video3Container = document.querySelector(".video3-container");
const showResult = document.querySelector(".show-result");
const trainBtn1 = document.querySelector(".btn-1");
const trainBtn2 = document.querySelector(".btn-2");
const submitBtn = document.querySelector(".submit-btn");

let video1;
let video2;
let video3;
let ml5Features = ml5.featureExtractor("MobileNet", () => {});
let knn = ml5.KNNClassifier();

//adding video1 as a video on the dom
const sketch = (p) => {
  p.setup = function () {
    p.createCanvas(600, 400);
    video1 = p.createCapture(p5.VIDEO);
    video1.size(600, 400);
  };
};

//adding video2 as a video on the dom
const sketch2 = (p) => {
  p.setup = function () {
    p.createCanvas(600, 400);
    video2 = p.createCapture(p5.VIDEO);

    video2.size(600, 400);
  };
};

function addData(v, className) {
  console.log(v);
  const logits = ml5Features.infer(v);
  knn.addExample(logits, className);
  console.log("Added example for", className);
}

function getResult(v) {
  const logits = ml5Features.infer(v);
  //classifying the video instance (logits) and getting the result based on training data
  knn.classify(logits, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      //showing result on the dom
      showResult.innerText = result.label;
      //running the classification function continuously.
      setTimeout(() => {
        getResult(v);
      }, 50);
    }
  });
}

trainBtn1.addEventListener("click", () => {
  addData(video1, "class1");
});

trainBtn2.addEventListener("click", () => {
  addData(video2, "class2");
});

submitBtn.addEventListener("click", () => {
  video1.hide();
  video2.hide();

  //adding video3 as a video on the dom
  const sketch3 = (p) => {
    p.setup = function () {
      p.createCanvas(600, 400);
      video3 = p.createCapture(p5.VIDEO);
      video3.size(600, 400);
    };
  };
  new p5(sketch3, video3Container);

  getResult(video3);
});

new p5(sketch, video1Container);
new p5(sketch2, video2Container);

//TODO: save the model and later when users reloads the page, ask them if they want to use the pertained model
