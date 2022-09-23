//jshint esversion:8
// listen to UPload a pic
document
  .querySelector('input[type="file"]')
  .addEventListener("change", function () {
    const timeStart = window.performance.now();

    if (this.files && this.files[0]) {
      var img = document.querySelector("img");
      img.onload = () => {
        //procsses the image
        const dataImage = tf.browser.fromPixels(img).resizeBilinear([128, 128]);

        const preprocessedInput = dataImage.expandDims();

        sendToPredict(preprocessedInput).then((result) =>
          updateScore(result[0][0], result[0][1], window.performance.now() - timeStart)
        );
        //predict(preprocessedInput);
        URL.revokeObjectURL(img.src); // no longer needed, free memory
      };

      img.src = URL.createObjectURL(this.files[0]); // set src to blob url
    }
  });

//function cald from url image

function imgUrl() {
  const timeStart = window.performance.now();
  const form_image = document.getElementById("url");

  var img = new Image();
  img.crossOrigin = "anonymous";
  img.src = form_image.value;
  console.log(img.src);

  img.onload = () => {
    //procsses the image
    document.getElementById("myImg").src = img.src;
    const dataImage = tf.browser.fromPixels(img).resizeBilinear([128, 128]);

    const preprocessedInput = dataImage.expandDims();
    sendToPredict(preprocessedInput).then((result) =>
      updateScore(result[0][0], result[0][1], window.performance.now() - timeStart)
    );
    URL.revokeObjectURL(img); // no longer needed, free memory
  };
}

let model;


(async function loadChachModel() {
  // load the model after page loaded
  const loadstart = window.performance.now();
  model = await tf.loadGraphModel("tfjs_graph/model.json");
  prediction = await model.predict(tf.zeros([1, 128, 128, 3]));
  console.log("model loaded");
  const loadends = window.performance.now();
  $("#ui").show(600);
  $("#loading").hide(600);
  $("#loadTime").html(Math.round(loadends - loadstart) + ' ms');
})();




async function sendToPredict(preprocessedInputToArray) {
  // const model = await tf.loadGraphModel("tfjs_graph/model.json");
  // console.log("model loaded");
  const prediction = await model.predict(preprocessedInputToArray);
  return prediction.array();
}

function updateScore(cat, dog, timeTook) {
  $("#catScore").html(cat * 100 + "%,");
  $("#dogScore").html(dog * 100 + "%");
  $("#run").show(600);
  $("#runningTime").html(Math.round(timeTook) + ' ms');
}
