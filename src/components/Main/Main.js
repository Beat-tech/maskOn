import React, { Component } from "react";
import "./Main.css";
import io from "socket.io-client";
const ENDPOINT = "ws://localhost:5000/";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io.connect(ENDPOINT),
      video: React.createRef(),
      canvas: React.createRef(),
      viewCanvas: React.createRef(),
      img: React.createRef(),
      _context: undefined,
      get context() {
        if (!this._context)
          this._context = this.canvas.current.getContext("2d");
        return this._context;
      },
      _viewContext: undefined,
      get viewContext() {
        if (!this._viewContext)
          this._viewContext = this.viewCanvas.current.getContext("2d");
        return this._viewContext;
      },
    };

    this.loadCam = this.loadCam.bind(this);
    this.logger = this.logger.bind(this);
    this.loadFail = this.loadFail.bind(this);
    this.verVideo = this.verVideo.bind(this);
  }

  borrar() {
    new WebSocket(ENDPOINT);
  }

  componentDidMount() {
    // const script1 = document.createElement("script");
    // script1.src = "./socket.io-client.js";
    // script1.async = true;
    // document.body.appendChild(script1);
    // const script2 = document.createElement("script");
    // script2.src = "./js/script.js";
    // script2.async = true;
    // document.body.appendChild(script2);
    this.state.socket.emit("evento_video", "esta cadena representa el video");
    this.state.socket.emit("connection");
    this.state.socket.on("message", (data) => console.log(data));
    this.state.socket.on("respuesta", (data) => {
      console.log("Los datos recibidos son: " + data);
    });
  }

  logger(msg) {
    document.querySelector(".status").innerText = msg;
  }

  loadCam(stream) {
    this.state.video.current.srcObject = stream;
    this.logger("Camara funcionando");
    //console.log('camara funcionando');
  }

  loadFail() {
    this.logger("Camara ha fallado reinicia");
    //console.log('camara a fallado')
  }

  verVideo(video, context) {
    this.state.context.drawImage(
      video,
      0,
      0,
      this.state.context.width,
      this.state.context.height
    );

    this.state.socket.emit(
      "stream",
      this.state.canvas.current.toDataURL("stream", "image/webp")
    );
    this.state.socket.on("stream", (image) => {
      console.log(image);
      this.state.img.current.src = image;
    });
  }

  handleClick() {
    console.log("emitiendo");
    this.state.socket.emit("stream", "Pito");

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msgGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true }, this.loadCam, this.loadFail);
    }

    var intervalo = setInterval(() => {
      this.verVideo(this.state.video.current, this.state.context);
    }, 500);

    this.state.canvas.current.width = 512;
    this.state.canvas.current.height = 384;

    this.state.context.width = this.state.canvas.current.width;
    this.state.context.height = this.state.canvas.current.height;

    this.state.viewCanvas.current.width = 512;
    this.state.viewCanvas.current.height = 384;

    this.state.viewContext.width = this.state.viewCanvas.current.width;
    this.state.viewContext.height = this.state.viewCanvas.current.height;
  }
  render() {
    return (
      <div class="main">
        <script src="./socket.io/socket.io.js"></script>
        <h1>Streaming de video - emitimos</h1>
        <button id="btn" onClick={this.handleClick.bind(this)}>
          Emitir
        </button>
        <button onClick={this.verVideo}>Ver Video</button>
        <video ref={this.state.video} src="" id="video" autoplay="true"></video>
        <canvas
          ref={this.state.canvas}
          id="send"
          style={{ display: "none" }}
        ></canvas>
        <canvas ref={this.state.viewCanvas} id="preview"></canvas>
        <img ref={this.state.img} alt="ni de"></img>
        <div class="status"></div>
      </div>
    );
  }
}

export default Main;
