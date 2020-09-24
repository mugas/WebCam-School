const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error(`Oh No`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixel out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    ctx.globalAlpha = 0.8;
    // pixels = greenScreen(pixels);
    // pixels = greenScreen(pixels)
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 500] = pixels.data[i + 1]; // green
    pixels.data[i - 550] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);

//! Speech recognition

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "en";

const p = document.createElement("p");
let h1 = document.createElement("h1");
const words = document.querySelector(".words");
words.appendChild(h1);

recognition.addEventListener("result", (e) => {
  // console.log(e);
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");
  console.log(e.results);

  h1.textContent = transcript;
  if (e.results[0].isFinal) {
    // if we finish talking we create another paragraph
    h1 = document.createElement("h1");

    words.appendChild(h1);
  }
  if (transcript.includes("unicorn")) {
    const emoji = document.createElement("span");
    emoji.textContent = "🦄";
    console.log("yei");
    words.appendChild(emoji);
  }
  console.log(transcript);
});

recognition.addEventListener("end", recognition.start);
recognition.start();
