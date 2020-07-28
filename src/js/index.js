import "../styles.css";
import "./handle-training";
import "./handle-result";
// Using custom model instead from the `ml5` cdn. It gives us much more flexibility. Took help from tensorflowjs
import Mobilenet from "./knn-classifier&mobileNet/mobileNet";
import KNNClassifier from "./knn-classifier&mobileNet/knn-classifier";
import { noWrReload } from "./handle-result";

export let ml5Features = new Mobilenet("MobileNet", () => {});
export let knn = new KNNClassifier();

//ask before leaving/quitting the application
window.onbeforeunload = function () {
  //if user click on `train again` button, don't show them the warning
  if (!noWrReload) {
    return "Changes you made may not be saved";
  }
};
