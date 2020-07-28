import { ml5Features, knn } from "./index";
import { checkMobile } from "./utils";
//dom-element
const cs1TrainBtn = document.querySelector("#btn-1");
const cs2CaptureVideo = document.querySelector("#btn-2");
const cs1ImageCounterPG = document.querySelector("#cs1-image-counter");
const cs2ImageCounterPG = document.querySelector("#cs2-image-counter");
const cs1ImageUpload = document.querySelector("#cs1-image-upload");
const cs2ImageUpload = document.querySelector("#cs2-image-upload");
const cs1ImageCounter = document.querySelector("#total-cs1-img");
const cs2ImageCounter = document.querySelector("#total-cs2-img");
const webcamDoc = document.querySelector("#webcam-doc-alert");
const mobileWarning = document.querySelector("#mobile-warning-alert");
const clearExampleBtn1 = document.querySelector("#clear-example-btn1");
const clearExampleBtn2 = document.querySelector("#clear-example-btn2");
const clearExample = document.querySelector("#clear-modal-btn");

let video1 = document.querySelector("#cs1-video");
let video2 = document.querySelector("#cs2-video");
let totalImage = 0;
let totalCounter;
const expectedImgSample = 100 / 300; // 200 is the expected sample
//capturing the webcam permission so that we don't have to run the error message twice when the users denies permission
let gaveCamPermission = true;
//capturing which class to clear, needed for example clear warning modal
let clearExampleFrom = "";

const clearExampleWarningModal = new bootstrap.Modal(
  document.getElementById("clear-img-warning-modal"),
  { show: false }
);

//showing performance warning on mobile
if (checkMobile()) {
  mobileWarning.style.display = "block";
}

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
      if (gaveCamPermission) {
        alert(
          "ERROR ACCESSING WEBCAM!!!\n Make sure you've enabled webcam access for this web application. \n\n If you've already given permission, close other applications that are using the camera and then refresh"
        );
      }

      gaveCamPermission = false;
      webcamDoc.style.display = "block";
    });
}

setUpVideo(video1);
setUpVideo(video2);

//changing example image progress bar color based on total image
function changeProgressColor(arg) {
  const totalImgByLabel = arg;
  if (totalImgByLabel["class1"] > 75) {
    cs1ImageCounterPG.style.backgroundColor = "rgb(0, 174, 255)";
    cs1ImageCounter.style.backgroundColor = "rgb(0, 174, 255)";
  } else if (totalImgByLabel["class1"] > 50) {
    cs1ImageCounterPG.style.backgroundColor = "rgb(3, 238, 140)";
    cs1ImageCounter.style.backgroundColor = "rgb(3, 238, 140)";
  } else if (totalImgByLabel["class1"] > 25) {
    cs1ImageCounterPG.style.backgroundColor = "#ffc107";
    cs1ImageCounter.style.backgroundColor = "#ffc107";
  }
  if (totalImgByLabel["class2"] > 75) {
    cs2ImageCounterPG.style.backgroundColor = "rgb(0, 174, 255)";
    cs2ImageCounter.style.backgroundColor = "rgb(0, 174, 255)";
  } else if (totalImgByLabel["class2"] > 50) {
    cs2ImageCounterPG.style.backgroundColor = "rgb(3, 238, 140)";
    cs2ImageCounter.style.backgroundColor = "rgb(3, 238, 140)";
  } else if (totalImgByLabel["class2"] > 25) {
    cs2ImageCounterPG.style.backgroundColor = "#ffc107";
    cs2ImageCounter.style.backgroundColor = "#ffc107";
  }
}

//changing `knn.kNum` based on total image example given from the user. The higher the total image, the higher will be `knn.kNum`
function handleImageNumber() {
  totalCounter = knn.getCountByLabel();
  //sometimes users might start with `class1` sample, in that case, `class2` might be null
  if (totalCounter["class1"]) {
    //totalCounter["class1"] hasn't modified by us yet
    totalImage = totalCounter["class1"];
    cs1ImageCounter.innerText = totalCounter["class1"];

    //rounding up totalImage data to match up with our expected image sample, it helps to update progress border as expected
    totalCounter["class1"] = Math.round(
      totalCounter["class1"] * expectedImgSample
    );
    if (totalCounter["class2"]) {
      //totalCounter["class2"] hasn't modified by us yet
      totalImage += totalCounter["class2"];
      cs2ImageCounter.innerText = totalCounter["class2"];

      totalCounter["class2"] = Math.round(
        totalCounter["class2"] * expectedImgSample
      );
    }
  }
  //sometimes users might start with `class2` sample, in that case, `class1` might be null
  else if (totalCounter["class2"]) {
    //totalCounter["class2"] hasn't modified by us yet
    totalImage += totalCounter["class2"];
    cs2ImageCounter.innerText = totalCounter["class2"];

    totalCounter["class2"] = Math.round(
      totalCounter["class2"] * expectedImgSample
    );
    if (totalCounter["class1"]) {
      //totalCounter["class1"] hasn't modified by us yet
      totalImage = totalCounter["class1"];
      cs1ImageCounter.innerText = totalCounter["class1"];

      totalCounter["class2"] = Math.round(
        totalCounter["class2"] * expectedImgSample
      );
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
        //changing `knn.kNum` and `totalCounter` based on total image example given from the user
        handleImageNumber();
        cs1ImageCounterPG.style.width = totalCounter["class1"]
          ? `${totalCounter["class1"]}%`
          : "0%";
        cs2ImageCounterPG.style.width = totalCounter["class2"]
          ? `${totalCounter["class2"]}%`
          : "0%";
      };
    });
  }
  //default, capturing from the the video
  else {
    const logits = ml5Features.infer(fromVideo);
    knn.addExample(logits, className);

    knn.addExample(logits, className);
    //changing `knn.kNum` and `totalCounter` based on total image example given from the user
    handleImageNumber();
    cs1ImageCounterPG.style.width = totalCounter["class1"]
      ? `${totalCounter["class1"]}%`
      : "0%";
    cs2ImageCounterPG.style.width = totalCounter["class2"]
      ? `${totalCounter["class2"]}%`
      : "0%";
  }
}

//cs1 image example capture from video
cs1TrainBtn.addEventListener("mousedown", () => {
  addData(video1, "class1");
  //calling the function again to capture more data
  addData(video1, "class1");
});

//cs1 image example capture from video
cs1ImageUpload.addEventListener("change", (e) => {
  //for image upload
  addData(undefined, "class1", e);
});

cs2CaptureVideo.addEventListener("mousedown", () => {
  addData(video2, "class2");
  //calling the function again to capture more data
  addData(video2, "class2");
});

cs2ImageUpload.addEventListener("change", (e) => {
  //for image upload
  addData(undefined, "class2", e);
});

//handling clear example data click
clearExampleBtn1.addEventListener("click", () => {
  clearExampleFrom = "class1";
  clearExampleWarningModal.show();
});

clearExampleBtn2.addEventListener("click", () => {
  clearExampleFrom = "class2";
  clearExampleWarningModal.show();
});

//handling clear example data click
clearExample.addEventListener("click", () => {
  knn.clearLabel(clearExampleFrom);
  if (clearExampleFrom == "class1") {
    cs1ImageCounter.innerText = 0;
    cs1ImageCounterPG.style.width = "0%";
    cs1ImageCounterPG.style.backgroundColor = "#6c757d";
  } else if (clearExampleFrom == "class2") {
    cs2ImageCounter.innerText = 0;
    cs2ImageCounterPG.style.width = "0%";
    cs2ImageCounterPG.style.backgroundColor = "#6c757d";
  }
});
