const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const photobooth = document.getElementsByTagName("html")[0];
const ctx = canvas.getContext("2d");
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let h1 = document.createElement("h1");
const words = document.querySelector(".words");

const colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral",
  "crimson",
  "cyan",
  "fuchsia",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lime",
  "linen",
  "magenta",
  "maroon",
  "moccasin",
  "navy",
  "olive",
  "orange",
  "orchid",
  "peru",
  "pink",
  "plum",
  "purple",
  "red",
  "salmon",
  "sienna",
  "silver",
  "snow",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "white",
  "yellow",
];

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

//! Speech recognition

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en";

words.appendChild(h1);

function test() {
  recognition.addEventListener("result", (e) => {
    // console.log(e);
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");
    h1.textContent = transcript;
    if (e.results[0].isFinal) {
      // if we finish talking we create another paragraph
      h1 = document.createElement("h1");
      words.appendChild(h1);
    }
    if (transcript.includes("unicorn")) {
      const emoji = document.createElement("span");
      emoji.textContent = "🦄";
      photobooth.classList.add("unicorn");
      canvas.classList.add("unicorn");

      console.log("yei");
      words.appendChild(emoji);
    }
    console.log(transcript);
  });
  recognition.start();
}

/* function colorBackground(color) {
  colors.map((color) => {
    console.log(color);
  });
}

colorBackground() */

video.addEventListener("canplay", paintToCanvas);
recognition.addEventListener("end", test);
test();
