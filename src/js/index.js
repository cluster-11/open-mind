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
//ask for images if none is provided
//add the main-header as most voted type on result-video
//show good job when they add more images
//use lazy loading
//show clear all example in a dropdown beside the button
//show a reload button, in the result page
//show `download dataset` and load `new dataset side` by side
//show `how to enable webcam link`
//if you want to get a better experience, you might wanna enable webcam access, heres how to do it.  Video capture features requires webcam feed, enable webcam acccess for this application. Heres how to do it
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
// window.onbeforeunload = function () {
//   return "Changes you made may not be saved";
// };
