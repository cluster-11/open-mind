//Add the second image data first, the bug will appear

import ml5 from "ml5";
import "./styles.css";

//dom-element
const cs1TrainBtn = document.querySelector("#btn-1");
const cs2TrainBtn = document.querySelector("#btn-2");
const submitBtn = document.querySelector("#submit-btn");
const cs1ImageCounter = document.querySelector("#cs1-image-counter");
const cs2ImageCounter = document.querySelector("#cs2-image-counter");
const cs1ImageUpload = document.querySelector("#cs1-image-upload");
const cs2ImageUpload = document.querySelector("#cs2-image-upload");
const cs1Name = document.querySelector("#cs1-name");
const cs2Name = document.querySelector("#cs2-name");
const resultText = document.querySelector("#result-text");
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
function addData(fromVideo, className, customImgEvent = undefined) {
  console.log("Getting image data");
  //if the user uploads image instead of capturing them from the video
  if (customImgEvent) {
    //if the user uploads multiple image
    [...customImgEvent.target.files].map((i) => {
      const newImg = new Image(1, 1);
      const imgSrc = window.URL.createObjectURL(i);
      //Preference: hiding the img element, we don't want to show it on this application
      newImg.style.display = "none";
      newImg.src = imgSrc;
      newImg.onload = () => {
        const logits = ml5Features.infer(newImg);
        knn.addExample(logits, className);
        const totalImage = knn.getCount();
        cs1ImageCounter.innerText = `${
          totalImage[0] ? totalImage[0] : 0
        }/ minimum 10`;
        cs2ImageCounter.innerText = `${
          totalImage[1] ? totalImage[1] : 0
        }/ minimum 10`;
      };
      console.log("feeded image data");
      console.log(knn.getCountByLabel(cs1Name.value));
      console.log(knn.getCountByLabel(cs2Name.value));
    });
  }
  //default, capturing from the the video
  else {
    console.log("Getting video data");

    const logits = ml5Features.infer(fromVideo);
    knn.addExample(logits, className);
    const totalImage = knn.getCount();
    cs1ImageCounter.innerText = `${
      totalImage[0] ? totalImage[0] : 0
    }/ minimum 10`;
    cs2ImageCounter.innerText = `${
      totalImage[1] ? totalImage[1] : 0
    }/ minimum 10`;
  }
  console.log("feeded video data");
  console.log(knn);
  console.log(knn.getCountByLabel()[cs1Name.value]);
  console.log(knn.getCountByLabel()[cs2Name.value]);
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
      //running the classification function continuously, with a 40 milliseconds break
      setTimeout(() => {
        getResult(v);
      }, 40);
    }
  });
}

//changing the class name
function changeClassName(newName, index) {
  if (knn.knnClassifier.mapStringToIndex) {
    knn.knnClassifier.mapStringToIndex[index] = newName;
  }
}

cs1TrainBtn.addEventListener("click", () => {
  addData(video1, cs1Name.value);
});

cs2TrainBtn.addEventListener("click", () => {
  addData(video2, cs2Name.value);
});

cs1ImageUpload.addEventListener("change", (e) => {
  addData(undefined, cs1Name.value, e);
});

cs2ImageUpload.addEventListener("change", (e) => {
  addData(undefined, cs2Name.value, e);
});

cs1Name.addEventListener("keyup", () => {
  //first class starts ar 0
  changeClassName(cs1Name.value, 0);
});

cs2Name.addEventListener("keyup", () => {
  //second class starts ar 1
  changeClassName(cs2Name.value, 1);
});

submitBtn.addEventListener("click", () => {
  // Important, final check if the class names are as expected
  changeClassName(cs1Name.value, 0);
  changeClassName(cs2Name.value, 1);

  //removing some element and adding some element
  video1.style.display = "none";
  video2.style.display = "none";
  cs1TrainBtn.style.display = "none";
  cs2TrainBtn.style.display = "none";
  submitBtn.style.display = "none";
  cs1ImageCounter.style.display = "none";
  cs2ImageCounter.style.display = "none";
  video3.style.display = "inline";
  resultText.style.display = "block";
  setUpVideo(video3);
  getResult(video3);
});
