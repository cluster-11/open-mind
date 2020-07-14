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
        }/ as much as possible`;
        cs2ImageCounter.innerText = `${
          totalImage[1] ? totalImage[1] : 0
        }/ as much as possible`;
      };
    });
  }
  //default, capturing from the the video
  else {
    const logits = ml5Features.infer(fromVideo);
    knn.addExample(logits, className);

    const totalExample = knn.getCountByLabel();
    //showing total totalExample on the dom
    cs1ImageCounter.innerText = `${
      totalExample["class1"] ? totalExample["class1"] : 0
    }/ as much as possible`;
    cs2ImageCounter.innerText = `${
      totalExample["class2"] ? totalExample["class2"] : 0
    }/ as much as possible`;
  }
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
