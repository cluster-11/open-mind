//Not expected result? One of the reason could be not enough example images
//want to integrate this kind of feature? see the starter template or use this
//facing bug/issues, create a github issue here
//view the application on github
// about- this project is part of cluster-11 organization
//view a similar application from google teachable machine
//remove console.log
//use teachable machine show result css
//show good job when they add more images
//show clear all example in a dropdown beside the button

//[

//how this application works, a short message, we don't save your images, all training happens on the browser,     Try to give as much example image as possible to get the best
// possible outcome
//            You didn't add any example image to train the model. You have to
//provide example images, so the machine learning model gets enough
//data to understand the difference between your two image classes and
//prepare the result.
//This is a open source project
//]

//try display none

import "../styles.css";
import "./handle-training";
import "./handle-result";
// Using custom model instead from the `ml5` cdn. It gives us much more flexibility
import Mobilenet from "./knn-classifier&mobileNet/mobileNet";
import KNNClassifier from "./knn-classifier&mobileNet/knn-classifier";
import { noWrReload } from "./handle-result";

export let ml5Features = new Mobilenet("MobileNet", () => {});
export let knn = new KNNClassifier();

//CLOSED FOR DEVELOPMENT
//ask before leaving/quitting the application
// window.onbeforeunload = function () {
//   //if user click on `train again` button, don't show them the warning
//   if (!noWrReload) {
//     return "Changes you made may not be saved";
//   }
// };
