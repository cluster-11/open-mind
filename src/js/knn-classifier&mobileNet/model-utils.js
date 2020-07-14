//took help from https://github.com/ml5js/ml5-library/blob/release/src/utils/callcallback.js and  https://github.com/ml5js/ml5-library/blob/release/src/utils/io.js

import * as tf from "@tensorflow/tfjs";

const cropImage = (img) => {
  const size = Math.min(img.shape[0], img.shape[1]);
  const centerHeight = img.shape[0] / 2;
  const beginHeight = centerHeight - size / 2;
  const centerWidth = img.shape[1] / 2;
  const beginWidth = centerWidth - size / 2;
  return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
};

export const saveBlob = async (data, name, type) => {
  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);
  const blob = new Blob([data], { type });
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
};

export const loadFile = async (path, callback) =>
  fetch(path)
    .then((response) => response.json())
    .then((json) => {
      if (callback) {
        callback(null, json);
      }
      return json;
    })
    .catch((error) => {
      if (callback) {
        callback(error);
      }
      console.error(
        `There has been a problem loading the file: ${error.message}`
      );
      alert(`There has been a problem loading the file: ${error.message}`); //showing alert if the json file is invalid
      throw error;
    });

export function callCallback(promise, callback) {
  if (callback) {
    promise
      .then((result) => {
        callback(undefined, result);
        return result;
      })
      .catch((error) => {
        callback(error);
        return error;
      });
  }
  return promise;
}

// Static Method: image to tf tensor
export function imgToTensor(input, size = null) {
  return tf.tidy(() => {
    let img = tf.browser.fromPixels(input);
    if (size) {
      img = tf.image.resizeBilinear(img, size);
    }
    const croppedImage = cropImage(img);
    const batchedImage = croppedImage.expandDims(0);
    return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
  });
}

export class Video {
  constructor(video, size) {
    this.videoElt = null;
    this.size = size;
    this.videoReady = false;

    if (video instanceof HTMLVideoElement) {
      this.videoElt = video;
    } else if (
      video !== null &&
      typeof video === "object" &&
      video.elt instanceof HTMLVideoElement
    ) {
      // Handle p5.js video element
      this.videoElt = video.elt;
    }
  }

  async loadVideo() {
    let stream;
    return new Promise((resolve) => {
      this.video = document.createElement("video");
      const sUsrAg = navigator.userAgent;
      if (sUsrAg.indexOf("Firefox") > -1) {
        stream = this.videoElt.mozCaptureStream();
      } else {
        stream = this.videoElt.captureStream();
      }
      this.video.srcObject = stream;
      this.video.width = this.size;
      this.video.height = this.size;
      this.video.autoplay = true;
      this.video.playsinline = true;
      this.video.muted = true;
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          resolve(this.video);
        });
      }
    });
  }
}
