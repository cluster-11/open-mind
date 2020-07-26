import { setUpVideo } from "./handle-training";
import { ml5Features, knn } from "./index";

//dom-element
const submitBtn = document.querySelector("#submit-btn");
const result1Container = document.querySelector("#result1-pc-container");
const result2Container = document.querySelector("#result2-pc-container");
const result1PC = document.querySelector("#result1-pc");
const result2PC = document.querySelector("#result2-pc");
const cs1Name = document.querySelector("#cs1-name");
const cs2Name = document.querySelector("#cs2-name");
const cs1SampleContainer = document.querySelector("#class1-sample");
const cs2SampleContainer = document.querySelector("#class2-sample");
const result1Name = document.querySelector("#result1-name");
const result2Name = document.querySelector("#result2-name");
const result1Label = document.querySelector("#result1-pc-label");
const result2Label = document.querySelector("#result2-pc-label");
const downloadModel = document.querySelector("#download-dataset");
const previousModelInput = document.querySelector("#prev-model-input");
const githubLink = document.querySelector("#github-star-alert");
const githubAlertClose = document.querySelector("#close-github-alert");
const prevModelTxt = document.querySelector("#prev-model-txt");
const recognizedClassTitle = document.querySelector("#recognized-class");
const trainNewBtn = document.querySelector("#train-new-dataset");

const noImgModal = new bootstrap.Modal(
  document.getElementById("no-img-modal"),
  { show: false }
);

let resultVideo = document.querySelector("#result-video");
//reloading without warning
export let noWrReload = false;

//getting the result
function getResult(v) {
  const logits = ml5Features.infer(v);
  //classifying the video instance (logits) and getting the result based on training data
  knn.classify(logits, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      if (result.label == "class1") {
        recognizedClassTitle.innerText = cs1Name.value;
      } else if (result.label == "class2") {
        recognizedClassTitle.innerText = cs2Name.value;
      }
      //showing result percentage
      const resultPC1 = result.confidencesByLabel["class1"] * 100;
      const resultPC2 = result.confidencesByLabel["class2"] * 100;

      //showing result on the dom, showing the class name based on what the user decided
      result1PC.style.width = `${resultPC1}%`;
      result2PC.style.width = `${resultPC2}%`;

      result1Label.innerText = `${resultPC1.toFixed(2)}%`;
      result2Label.innerText = `${resultPC2.toFixed(2)}%`;

      //running the classification function continuously, with a 40 milliseconds break
      setTimeout(() => {
        getResult(v);
      }, 5);
    }
  });
}

//removing and adding some elements from the dom
function modifyDomElem() {
  cs1SampleContainer.style.display = "none";
  cs2SampleContainer.style.display = "none";
  submitBtn.style.display = "none";
  resultVideo.style.display = "inline";
  result1Container.style.display = "inline-block";
  result2Container.style.display = "inline-block";
  result1PC.style.display = "inline-block";
  result2PC.style.display = "inline-block";
  downloadModel.style.display = "block";
  trainNewBtn.style.display = "block";
  result1Name.innerText = cs1Name.value;
  result2Name.innerText = cs2Name.value;
  prevModelTxt.innerText = "Upload New Dataset";
  const showGitHubAlert = JSON.parse(localStorage.getItem("showGitHubAlert"));
  //if the user already closed it once, don't show it again on next refresh
  if (showGitHubAlert && !showGitHubAlert.showGitHubAlert) {
    githubLink.style.display = "none";
  } else {
    githubLink.style.display = "block";
  }
}

//handles the submit, creates new interface and displays result
submitBtn.addEventListener("click", () => {
  const totalExampleImage = knn.getCountByLabel();

  //blocking submitting result if no example image is given or if one of the class has no example image
  if (
    Object.keys(totalExampleImage).length === 0 ||
    !totalExampleImage["class1"] ||
    !totalExampleImage["class2"]
  ) {
    noImgModal.show();
    return;
  }

  modifyDomElem();
  setUpVideo(resultVideo); //this sets up the video element, connects webcam to video
});

resultVideo.addEventListener("loadeddata", () => {
  getResult(resultVideo);
});

//downloading the model
downloadModel.addEventListener("click", () => {
  knn.save();
});

//training the model again, reloading without warning
trainNewBtn.addEventListener("click", () => {
  noWrReload = true;
  window.location.reload();
});

//handling Github close event, if the users closes it once, don't show it again
githubAlertClose.addEventListener("click", () => {
  localStorage.setItem(
    "showGitHubAlert",
    JSON.stringify({ showGitHubAlert: false })
  );
});

//handling custom model input
previousModelInput.addEventListener("change", (e) => {
  knn.clearAllLabels();
  modifyDomElem();
  const dataSetSrc = window.URL.createObjectURL(e.target.files[0]);
  //need to work on invalid knn import
  knn.load(dataSetSrc, (e) => {
    if (e) {
      alert("You have imported an invalid KNN Dataset");
    } else {
      setUpVideo(resultVideo);
      if (resultVideo.readyState >= 4) {
        //checking if the video has loaded properly, more here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
        getResult(resultVideo);
      }
    }
  });
});
