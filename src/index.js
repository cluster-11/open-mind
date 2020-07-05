//Not expected result? One of the reason could be not enough example images
//want to integrate this kind of feature? see the starter template or use this
//facing bug/issues, create a github issue here
//like this project? give it a start
// about- this project is part of cluster-11 organization
//view a similar application from google teachable machine
//download the model

//spit the code

import ml5 from "ml5";
import "./styles.css";

//dom-element
const cs1TrainBtn = document.querySelector("#btn-1");
const cs2CaptureVideo = document.querySelector("#btn-2");
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
  //if the user uploads image instead of capturing them from the video
  if (customImgEvent) {
    //if the user uploads multiple image
    [...customImgEvent.target.files].map((i) => {
      const newImg = new Image(460, 345);
      const imgSrc = window.URL.createObjectURL(i);
      //Preference: hiding the img element, we don't want to show it on this application
      // https://stackoverflow.com/questions/3511200/new-image-how-to-know-if-image-100-loaded-or-not
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
    });
  }
  //default, capturing from the the video
  else {
    const logits = ml5Features.infer(fromVideo);
    knn.addExample(logits, className);

    const totalExample = knn.getCountByLabel();
    console.log(totalExample);
    //showing total totalExample on the dom
    cs1ImageCounter.innerText = `${
      totalExample["class1"] ? totalExample["class1"] : 0
    }/ minimum 10`;
    cs2ImageCounter.innerText = `${
      totalExample["class2"] ? totalExample["class2"] : 0
    }/ minimum 10`;
  }
}

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

cs1TrainBtn.addEventListener("mousedown", () => {
  addData(video1, "class1");
});

cs1ImageUpload.addEventListener("change", (e) => {
  addData(undefined, "class1", e);
});

cs2CaptureVideo.addEventListener("mousedown", () => {
  addData(video2, "class2");
});

cs2ImageUpload.addEventListener("change", (e) => {
  addData(undefined, "class2", e);
});

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

// window.onbeforeunload = function () {
//   window.confirm("Changes you made may not be saved");c
// };

window.onbeforeunload = function () {
  return "Changes you made may not be saved";
};
