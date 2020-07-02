//FORM SUBMITTING DOESN'T WORK

import ml5 from "ml5";
import "./styles.css";

const trainBtn1 = document.querySelector("#btn-1");
const trainBtn2 = document.querySelector("#btn-2");
const submitBtn = document.querySelector("#submit-btn");
const imageCounter1 = document.querySelector("#image-counter1");
const imageCounter2 = document.querySelector("#image-counter2");
const resultText = document.querySelector("#result-text");
const imageInput1 = document.querySelector("#cs1-image-upload");
let video1 = document.getElementById("video1");
let video2 = document.getElementById("video2");
let video3 = document.getElementById("video3");
let ml5Features = ml5.featureExtractor("MobileNet", () => {});
let knn = ml5.KNNClassifier();

//setting up the video capture component
async function setUpVideo(v) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  v.srcObject = stream;
  v.play();
}

setUpVideo(video1);
setUpVideo(video2);
video3.style.display = "none";
resultText.style.display = "none";

//adding data, training the model
function addData(v, className) {
  const logits = ml5Features.infer(v);
  knn.addExample(logits, className);
  const totalImage = knn.getCount();
  imageCounter1.innerText = `${totalImage[0] ? totalImage[0] : 0}/ minimum 10`;
  imageCounter2.innerText = `${totalImage[1] ? totalImage[1] : 0}/ minimum 10`;
}

//getting the result
function getResult(v) {
  const logits = ml5Features.infer(v);
  //classifying the video instance (logits) and getting the result based on training data
  knn.classify(logits, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      //showing result on the dom
      resultText.innerText = result.label;
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

imageInput1.addEventListener("change", (e) => {
  // console.log(img);
  const imgSrc = window.URL.createObjectURL(e.target.files[0]);
  console.log(imgSrc);
});

submitBtn.addEventListener("click", () => {
  //removing some element and adding some element
  video1.style.display = "none";
  video2.style.display = "none";
  trainBtn1.style.display = "none";
  trainBtn2.style.display = "none";
  submitBtn.style.display = "none";
  imageCounter1.style.display = "none";
  imageCounter2.style.display = "none";
  video3.style.display = "inline";
  resultText.style.display = "block";
  setUpVideo(video3);
  getResult(video3);
});
