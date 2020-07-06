//Not expected result? One of the reason could be not enough example images
//want to integrate this kind of feature? see the starter template or use this
//facing bug/issues, create a github issue here
//like this project? give it a start
// about- this project is part of cluster-11 organization
//view a similar application from google teachable machine
//download the model
//vanilla javascript and html code of this application
//remove console.log
//you need to give permisson to use the webcam (if theres no webcam)

//split the code
//move codebase to ml5 cdn, its much faster, link: https://stackoverflow.com/questions/43605215/using-cdn-vs-installing-library-by-npm

import "./styles.css";
import "./handle-training";
import "./handle-result";

//setting up ml5 and knn components
export let ml5Features = ml5.featureExtractor("MobileNet", () => {});
export let knn = ml5.KNNClassifier();

//CLOSED FOR DEVELOPMENT
// //ask before leaving/quitting the application
// window.onbeforeunload = function () {
//   return "Changes you made may not be saved";
// };
