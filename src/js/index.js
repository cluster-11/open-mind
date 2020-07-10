//Not expected result? One of the reason could be not enough example images
//want to integrate this kind of feature? see the starter template or use this
//facing bug/issues, create a github issue here
//like this project? give it a start
// about- this project is part of cluster-11 organization
//view a similar application from google teachable machine
//download the model
//vanilla javascript and html code of this application
//remove console.log
//test on gpu slowdown, create new js for mobile
//webpack input css on top
//use teachable machine show result css
//ml5 doesn't show show percentage, stuck at 66.33% or 33.33% work on that, create a github issue or visit other demo

import "../styles.css";
import "./handle-training";
import "./handle-result";
import Mobilenet from "./knn-classifier&mobileNet/mobileNet";
import KNNClassifier from "./knn-classifier&mobileNet/knn-classifier";

//setting up ml5 and knn components
export let ml5Features = Mobilenet;
export let knn = KNNClassifier;

//CLOSED FOR DEVELOPMENT
//ask before leaving/quitting the application
window.onbeforeunload = function () {
  return "Changes you made may not be saved";
};
