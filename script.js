//jshint esversion:8

let model;
(async function loadChachModel() {
  // load the model after page loaded and Chach it

  const loadstart = window.performance.now();
  model = await tf.loadGraphModel("tfjs_graph/model.json"); // load model
  prediction = await model.predict(tf.zeros([1, 128, 128, 3])); //Fake prediction for chaching
  console.log("model loaded");
  const loadends = window.performance.now(); //count how long for the model to fully load
  $("#ui").show(600);
  $("#loading").hide(600);
  $("#loadTime").html(Math.round(loadends - loadstart) + ' ms');
})();

// this function handles url prdiction call from button click
function imgUrl() {
  const form_image = document.getElementById("url");
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.src = form_image.value;
  console.log(img.src);
  document.getElementById("myImg").src = img.src;
  // once we assign to my img a url image we trggering the
  // event listen on change and  get a prediction
  imageLoaded(img); // call procsesing function, and prediction
}

// listen to change on img
document
  .querySelector('input[type="file"]')
  .addEventListener("change", function () {
    if (this.files && this.files[0]) {
      var imgfirst = document.querySelector("img");
      imageLoaded(imgfirst); // call proces and prediction functions
      imgfirst.src = URL.createObjectURL(this.files[0]); // set src to blob url

    }
  });

// TODO: only get prediction from url after uploading a pic????
// FIXED

function imageLoaded(img) {
  img.onload = () => {
    const timeStart = window.performance.now(); // start counting when img loaded
    //procsses the image
    const dataImage = tf.browser.fromPixels(img)
      .resizeBilinear([128, 128]); // assign tf tensor and resize the shape of the img
    const preprocessedInput = dataImage.expandDims(); // expand dimantions as the model requires
    // call the prediction functhin and update the scores and runnig time of prediction
    sendToPredict(preprocessedInput).then((result) =>
      updateScore(result[0][0],
        result[0][1],
        window.performance.now() - timeStart)
    );
    URL.revokeObjectURL(img.src); // no longer needed, free memory
  };
}
// The prediction function
async function sendToPredict(preprocessedInputToArray) {
  // const model = await tf.loadGraphModel("tfjs_graph/model.json");
  // console.log("model loaded");
  const prediction = await model.predict(preprocessedInputToArray); // call tfjs prdict
  return prediction.array(); // return the prediction as an array
}
// this function Updates the score of the prediction and the runnig time
function updateScore(cat, dog, timeTook) {
  $("#catScore").html(cat * 100 + "%,");
  $("#dogScore").html(dog * 100 + "%");
  $("#run").show(600);
  $("#runningTime").html(Math.round(timeTook) + ' ms');
}
