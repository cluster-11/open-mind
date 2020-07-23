//Not expected result? One of the reason could be not enough example images
//want to integrate this kind of feature? see the starter template or use this
//facing bug/issues, create a github issue here
//like this project? give it a star
//application using unet, webpack, javascript....
//view the application on github
// about- this project is part of cluster-11 organization
//view a similar application from google teachable machine
//download the model
//remove console.log
//test on gpu slowdown, create new js for mobile
//use teachable machine show result css
//ask for images if none is provided [there are not enough sample images to train  this model alert]
//add the main-header as most voted type on result-video
//show good job when they add more images
//show clear all example in a dropdown beside the button
//show a reload button, in the result page
//show `download dataset` and load `new dataset side` by side
//[

//how this application works, a short message, we don't save your images, all training happens on the browser,     Try to give as much example image as possible to get the best
// possible outcome
//            You didn't add any example image to train the model. You have to
//provide example images, so the machine learning model gets enough
//data to understand the difference between your two image classes and
//prepare the result.
//]

//try display none

import "../styles.css";
import "./handle-training";
import "./handle-result";
import Mobilenet from "./knn-classifier&mobileNet/mobileNet";
import KNNClassifier from "./knn-classifier&mobileNet/knn-classifier";

// alert("==================================================================");

export let ml5Features = new Mobilenet("MobileNet", () => {});
export let knn = new KNNClassifier();

//CLOSED FOR DEVELOPMENT
//ask before leaving/quitting the application
window.onbeforeunload = function () {
  return "Changes you made may not be saved";
};
