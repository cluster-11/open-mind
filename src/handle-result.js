import { setUpVideo } from "./handle-training";
import { ml5Features, knn } from "./index";

//dom-element
const submitBtn = document.querySelector("#submit-btn");
const result1Text = document.querySelector("#result1-text");
const result2Text = document.querySelector("#result2-text");
let resultVideo = document.querySelector("#result-video");

const cs1Name = document.querySelector("#cs1-name");
const cs2Name = document.querySelector("#cs2-name");
const cs1SampleContainer = document.querySelector("#class1-sample");
const cs2SampleContainer = document.querySelector("#class2-sample");

//getting the result
function getResult(v) {
  const logits = ml5Features.infer(v);
  //classifying the video instance (logits) and getting the result based on training data
  knn.classify(logits, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log(result);
      if (result.label == "class1") {
        //showing result on the dom, showing the class name based on what the user decided
        result1Text.innerText = `${cs1Name.value} ${
          result.confidencesByLabel["class1"] * 100
        }`;
      } else if (result.label == "class2") {
        result2Text.innerText = `${cs2Name.value} ${
          result.confidencesByLabel["class2"] * 100
        }`;
      }
      //running the classification function continuously, with a 40 milliseconds break
      setTimeout(() => {
        getResult(v);
      }, 40);
    }
  });
}

submitBtn.addEventListener("click", () => {
  //removing some element and adding some element
  cs1SampleContainer.style.display = "none";
  cs2SampleContainer.style.display = "none";
  submitBtn.style.display = "none";
  resultVideo.style.display = "inline";
  result1Text.style.display = "block";
  result2Text.style.display = "block";
  setUpVideo(resultVideo);
  getResult(resultVideo);
});
