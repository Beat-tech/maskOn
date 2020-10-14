var canvas = document.getElementById("preview");
var context = canvas.getContext("2d");
var btn = document.querySelector("#btn");

canvas.width = 512;
canvas.height = 384;

context.width = canvas.width;
context.height = canvas.height;

var video = document.getElementById("video");

function logger(msg) {
  document.querySelector(".status").innerText = msg;
}

function loadCam(stream) {
  video.srcObject = stream;
  logger("Camara funcionando");
  //console.log('camara funcionando');
}

function loadFail() {
  logger("Camara ha fallado reinicia");
  //console.log('camara a fallado')
}

function verVideo(video, context) {
  context.drawImage(video, 0, 0, context.width, context.height);
  socket.emit("stream", canvas.toDataURL("image/webp"));
}

btn.addEventListener("click", () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msgGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true }, loadCam, loadFail);
  }

  var intervalo = setInterval(() => {
    verVideo(video, context);
  }, 500);
});
