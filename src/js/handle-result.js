import { setUpVideo } from "./handle-training";
import { ml5Features, knn } from "./index";

//dom-element
const submitBtn = document.querySelector("#submit-btn");
const result1Container = document.querySelector("#result1-pc-container");
const result2Container = document.querySelector("#result2-pc-container");
const result1PC = document.querySelector("#result1-pc");
const result2PC = document.querySelector("#result2-pc");
let resultVideo = document.querySelector("#result-video");
const cs1Name = document.querySelector("#cs1-name").value;
const cs2Name = document.querySelector("#cs2-name").value;
const cs1SampleContainer = document.querySelector("#class1-sample");
const cs2SampleContainer = document.querySelector("#class2-sample");
const result1Name = document.querySelector("#result1-name");
const result2Name = document.querySelector("#result2-name");
const downloadModel = document.querySelector("#download-model");

//getting the result
function getResult(v) {
  const logits = ml5Features.infer(v);
  //classifying the video instance (logits) and getting the result based on training data
  knn.classify(logits, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      const resultPC1 = result.confidencesByLabel["class1"] * 100;
      const resultPC2 = result.confidencesByLabel["class2"] * 100;

      //showing result on the dom, showing the class name based on what the user decided
      result1PC.style.width = `${resultPC1}%`;
      result2PC.style.width = `${resultPC2}%`;

      result1PC.innerText = `${resultPC1.toFixed(2)}%`;
      result2PC.innerText = `${resultPC2.toFixed(2)}%`;
      //running the classification function continuously, with a 40 milliseconds break
      setTimeout(() => {
        getResult(v);
      }, 5);
    }
  });
}

submitBtn.addEventListener("click", () => {
  //removing some element and adding some element
  cs1SampleContainer.style.display = "none";
  cs2SampleContainer.style.display = "none";
  submitBtn.style.display = "none";
  resultVideo.style.display = "inline";
  result1Container.style.display = "block";
  result2Container.style.display = "block";
  result1PC.style.display = "inline-block";
  result2PC.style.display = "inline-block";
  downloadModel.style.display = "block";
  result1Name.innerText = cs1Name;
  result2Name.innerText = cs2Name;
  setUpVideo(resultVideo);
  getResult(resultVideo);
});

downloadModel.addEventListener("click", () => {
  console.log("Download model triggered");
  knn.save();
});
