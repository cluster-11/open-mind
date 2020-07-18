import { ml5Features, knn } from "./index";
//dom-element
const cs1TrainBtn = document.querySelector("#btn-1");
const cs2CaptureVideo = document.querySelector("#btn-2");
const cs1ImageCounter = document.querySelector("#cs1-image-counter");
const cs2ImageCounter = document.querySelector("#cs2-image-counter");
const cs1ImageUpload = document.querySelector("#cs1-image-upload");
const cs2ImageUpload = document.querySelector("#cs2-image-upload");

let video1 = document.querySelector("#cs1-video");
let video2 = document.querySelector("#cs2-video");
let totalImage = 0;

//setting up the video capture component
export async function setUpVideo(v) {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      v.srcObject = stream;
      v.play();
    })
    .catch(() => {
      alert(
        "You'll have to enable webcam access in order to use video-capture feature."
      );
    });
}

setUpVideo(video1);
setUpVideo(video2);

//changing progress bar color based on total image
function changeProgressColor(arg) {
  const totalCounter = arg;
  if (totalCounter["class1"] > 75) {
    cs1ImageCounter.classList.remove("bg-mid");
    cs1ImageCounter.classList.add("bg-done");
  } else if (totalCounter["class1"] > 50) {
    cs1ImageCounter.classList.remove("bg-warning");
    cs1ImageCounter.classList.add("bg-mid");
  } else if (totalCounter["class1"] > 25) {
    cs1ImageCounter.classList.remove("bg-danger");
    cs1ImageCounter.classList.add("bg-warning");
  }
  if (totalCounter["class2"] > 75) {
    cs2ImageCounter.classList.remove("bg-mid");
    cs2ImageCounter.classList.add("bg-done");
  } else if (totalCounter["class2"] > 50) {
    cs2ImageCounter.classList.remove("bg-warning");
    cs2ImageCounter.classList.add("bg-mid");
  } else if (totalCounter["class2"] > 25) {
    cs2ImageCounter.classList.remove("bg-danger");
    cs2ImageCounter.classList.add("bg-warning");
  }
}

//changing `knn.kNum` based on total image example given from the user. The higher the total image, the higher will be `knn.kNum`
function changeKNum() {
  const totalCounter = knn.getCountByLabel();
  if (totalCounter["class1"]) {
    totalImage = totalCounter["class1"];
    if (totalCounter["class2"]) {
      totalImage += totalCounter["class2"];
    }
  } else if (totalCounter["class2"]) {
    totalImage += totalCounter["class2"];
    if (totalCounter["class1"]) {
      totalImage = totalCounter["class1"];
    }
  }

  if (totalImage < 50) {
    knn.kNum = 3;
  } else if (totalImage < 100) {
    knn.kNum = 10;
  } else if (totalImage < 200) {
    knn.kNum = 22;
  } else if (totalImage < 400) {
    knn.kNum = 30;
  } else {
    knn.kNum = 60;
  }
  changeProgressColor(totalCounter);
  changeProgressColor(totalCounter);
}

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
        const totalImage = knn.getCountByLabel();
        cs1ImageCounter.style.width = totalImage["class1"]
          ? `${totalImage["class1"]}%`
          : "0%";
        cs2ImageCounter.style.width = totalImage["class2"]
          ? `${totalImage["class2"]}%`
          : "0%";
      };
    });
  }
  //default, capturing from the the video
  else {
    const logits = ml5Features.infer(fromVideo);
    knn.addExample(logits, className);

    knn.addExample(logits, className);
    const totalImage = knn.getCountByLabel();
    if (totalImage)
      cs1ImageCounter.style.width = totalImage["class1"]
        ? `${totalImage["class1"]}%`
        : "0%";
    cs2ImageCounter.style.width = totalImage["class2"]
      ? `${totalImage["class2"]}%`
      : "0%";
  }

  //changing `knn.kNum` based on total image example given from the user
  changeKNum();
}

cs1TrainBtn.addEventListener("mousedown", () => {
  addData(video1, "class1");
  //calling the function again to capture more data
  addData(video1, "class1");
});

cs1ImageUpload.addEventListener("change", (e) => {
  addData(undefined, "class1", e);
});

cs2CaptureVideo.addEventListener("mousedown", () => {
  addData(video2, "class2");
  //calling the function again to capture more data
  addData(video2, "class2");
});

cs2ImageUpload.addEventListener("change", (e) => {
  addData(undefined, "class2", e);
});

// For the about section
