import { setUpVideo } from "./handle-training";
import { ml5Features, knn } from "./index";

//dom-element
const cs1TrainBtn = document.querySelector("#btn-1");
const cs2CaptureVideo = document.querySelector("#btn-2");
const submitBtn = document.querySelector("#submit-btn");
const cs1ImageCounter = document.querySelector("#cs1-image-counter");
const cs2ImageCounter = document.querySelector("#cs2-image-counter");
const resultText = document.querySelector("#result-text");
let video1 = document.getElementById("video1");
let video2 = document.getElementById("video2");
let video3 = document.getElementById("video3");
const cs1Name = document.querySelector("#cs1-name");
const cs2Name = document.querySelector("#cs2-name");

submitBtn.addEventListener("click", () => {
  //removing some element and adding some element
  video1.style.display = "none";
  video2.style.display = "none";
  cs1TrainBtn.style.display = "none";
  cs2CaptureVideo.style.display = "none";
  submitBtn.style.display = "none";
  cs1ImageCounter.style.display = "none";
  cs2ImageCounter.style.display = "none";
  video3.style.display = "inline";
  resultText.style.display = "block";
  setUpVideo(video3);
  getResult(video3);
});

//getting the result
function getResult(v) {
  const logits = ml5Features.infer(v);
  //classifying the video instance (logits) and getting the result based on training data
  knn.classify(logits, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log(result.label);
      if (result.label == "class1") {
        //showing result on the dom
        resultText.innerText = cs1Name.value;
      } else if (result.label == "class2") {
        resultText.innerText = cs2Name.value;
      }
      //running the classification function continuously, with a 40 milliseconds break
      setTimeout(() => {
        getResult(v);
      }, 40);
    }
  });
}

window.onbeforeunload = function () {
  return "Changes you made may not be saved";
};
