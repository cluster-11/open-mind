import { ml5Features, knn } from "./index";
//dom-element
const cs1TrainBtn = document.querySelector("#btn-1");
const cs2CaptureVideo = document.querySelector("#btn-2");
const cs1ImageCounterPG = document.querySelector("#cs1-image-counter");
const cs2ImageCounterPG = document.querySelector("#cs2-image-counter");
const cs1ImageUpload = document.querySelector("#cs1-image-upload");
const cs2ImageUpload = document.querySelector("#cs2-image-upload");
const cs1ImageCounter = document.querySelector("#total-cs1-img");
const cs2ImageCounter = document.querySelector("#total-cs2-img");

let video1 = document.querySelector("#cs1-video");
let video2 = document.querySelector("#cs2-video");
let totalImage = 0;
let totalCounter;
const expectedImgSample = 100 / 300; // 200 is the expected sample
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
        "Error accessing webcam, make sure you've enabled webcam access for this application and no other application is using the camera"
      );
    });
}

setUpVideo(video1);
setUpVideo(video2);

//changing progress bar color based on total image
function changeProgressColor(arg) {
  const totalImgByLabel = arg;
  if (totalImgByLabel["class1"] > 75) {
    cs1ImageCounterPG.classList.remove("bg-mid");
    cs1ImageCounter.classList.remove("bg-mid");
    cs1ImageCounterPG.classList.add("bg-done");
    cs1ImageCounter.classList.add("bg-done");
  } else if (totalImgByLabel["class1"] > 50) {
    cs1ImageCounterPG.classList.remove("bg-warning");
    cs1ImageCounter.classList.remove("bg-warning");
    cs1ImageCounterPG.classList.add("bg-mid");
    cs1ImageCounter.classList.add("bg-mid");
  } else if (totalImgByLabel["class1"] > 25) {
    cs1ImageCounterPG.classList.remove("bg-danger");
    cs1ImageCounter.classList.remove("bg-secondary");
    cs1ImageCounterPG.classList.add("bg-warning");
    cs1ImageCounter.classList.add("bg-warning");
  }
  if (totalImgByLabel["class2"] > 75) {
    cs2ImageCounterPG.classList.remove("bg-mid");
    cs2ImageCounter.classList.remove("bg-mid");
    cs2ImageCounterPG.classList.add("bg-done");
    cs2ImageCounter.classList.add("bg-done");
  } else if (totalImgByLabel["class2"] > 50) {
    cs2ImageCounterPG.classList.remove("bg-warning");
    cs2ImageCounter.classList.remove("bg-warning");
    cs2ImageCounterPG.classList.add("bg-mid");
    cs2ImageCounter.classList.add("bg-mid");
  } else if (totalImgByLabel["class2"] > 25) {
    cs2ImageCounterPG.classList.remove("bg-danger");
    cs2ImageCounter.classList.remove("bg-secondary");
    cs2ImageCounterPG.classList.add("bg-warning");
    cs2ImageCounter.classList.add("bg-warning");
  }
}

//changing `knn.kNum` based on total image example given from the user. The higher the total image, the higher will be `knn.kNum`
function handleImageNumber() {
  totalCounter = knn.getCountByLabel();
  //sometimes users might start with `class1` sample, in that case, `class2` might be null
  console.log(totalCounter);
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
