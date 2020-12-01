let keys = new Map();
let selected, startPos, finalPos;
let playing = false;
let autoPlayPause, autoLabel, pSystem, eSystem, rSystem;

// Images
let flat1, flat2, sharp1, sharp2;
// Image folder link
let imgsLink = 'https://bradwave.github.io/PianoFreq/imgs/keys/';

const synth = new Tone.Synth().toDestination();

function preload() {
  // Static images
  flat1 = loadImage(imgsLink + 'flat-1.png');
  flat2 = loadImage(imgsLink + 'flat-2.png');
  sharp1 = loadImage(imgsLink + 'sharp-1.png');
  sharp2 = loadImage(imgsLink + 'sharp-2.png');
}

function setup() {
  // Canvas
  createCanvas(windowWidth, windowHeight);
  updateSystem();

  // Font
  textFont('Georgia');
  textAlign(CENTER);

  // Keys
  createKeys();
  randomTemperament();

  // Interface
  autoPlayPause = select('#autoPlay');
  autoLabel = select("#autoLabel");
  pSystem = select("#pithagorean");
  nSystem = select("#natural");
  eSystem = select("#equal");
  rSystem = select("#random")
  updateButtons();

  // Render loop
  noLoop();
}

function windowResized() {
  // Update canvas
  resizeCanvas(windowWidth, windowHeight);
  updateSystem();

  // Update keys
  keys.forEach(k => k.setSize());

  // Button
  updateButtons();

  // Redraw
  if (!playing)
    redraw();
}

function updateButtons() {
  let sOffset = autoPlayPause.elt.offsetWidth / 2;
  let bOffset = height * 0.1;
  autoPlayPause.position(width / 2 - bOffset * 2.4 - sOffset, height * 0.1);
  rSystem.position(width / 2 - bOffset * 1 - sOffset, height * 0.1);
  pSystem.position(width / 2 - sOffset, height * 0.1);
  nSystem.position(width / 2 + bOffset * 1 - sOffset, height * 0.1);
  eSystem.position(width / 2 + bOffset * 2 - sOffset, height * 0.1);
}

function touchStarted() {
  selected = undefined;
  keys.forEach(function (k, i) {
    if (k.selected(mouseX, mouseY)) {
      selected = i;
    }
  });
  startPos = { x: mouseX, y: mouseY };
}

function touchMoved() {
  finalPos = { x: mouseX, y: mouseY };
  if (selected != undefined) {
    keys.get(selected).translate(startPos.x - finalPos.x, startPos.y - finalPos.y);
  }
  startPos = finalPos;

  // Redraw
  if (!playing)
    redraw();
}

function touchEnded() {
  if (selected != undefined) {
    playNote(selected);
  }
}

function keyPressed() {
  if (keys.has(key.toLowerCase())) {
    playNote(key.toLowerCase());
  }
}

function playNote(k, t = 0) {
  loop();
  playing = true;
  keys.get(k).play();
  synth.triggerAttackRelease(440 * keys.get(k).getFrequency(), "8n", Tone.now() + t);
}

function createKeys() {
  keys.set("a", new PianoKey(1, -0.1, true, "A"));
  keys.set("s", new PianoKey(9 / 8, -0.1, true, "S"));
  keys.set("d", new PianoKey(5 / 4, -0.1, true, "D"));
  keys.set("f", new PianoKey(4 / 3, -0.1, true, "F"));
  keys.set("g", new PianoKey(3 / 2, -0.1, true, "G"));
  keys.set("h", new PianoKey(5 / 3, -0.1, true, "H"));
  keys.set("j", new PianoKey(15 / 8, -0.1, true, "J"));
  keys.set("k", new PianoKey(2, -0.1, true, "K"));

  keys.set("w", new PianoKey(1.0625, -0.1, false, "W"));
  keys.set("e", new PianoKey(1.1875, -0.1, false, "E"));
  keys.set("t", new PianoKey(1.4167, -0.1, false, "T"));
  keys.set("y", new PianoKey(1.5833, -0.1, false, "Y"));
  keys.set("u", new PianoKey(1.7708, -0.1, false, "U"));
}

function drawLine() {
  stroke(255);
  strokeWeight(4);
  let x1 = toScreenX(0.9);
  let x2 = toScreenX(2.1);
  let y = toScreenY(0);

  let jumps = [];
  keys.forEach(k => {
    if (k.played())
      jumps.push(toScreenX(k.getFrequency()));
  });
  jumps.sort((a, b) => a - b);

  if (jumps.length > 0) {
    let offset = waveSize * 0.5;
    line(x1, y, jumps[0] - offset, y);
    for (let j = 0; j < jumps.length; j++) {
      line(jumps[j] + offset, y, jumps[j + 1] - offset, y)
    }
    line(jumps[jumps.length - 1] + offset, y, x2, y);
  } else {
    line(x1, y, x2, y);
  }
}

function drawWaves() {
  let keyPlaying = false;
  keys.forEach(k => {
    if (k.played()) {
      keyPlaying = true;
      drawDistortion(toScreenX(k.getFrequency()), yOrigin, k.getAmp());
      k.fade();
    }
  });
  if (playing && !keyPlaying && !autoPlaying) {
    playing = false;
    noLoop();
  }
}

function drawDistortion(x, y, amp) {
  push();
  translate(x - waveSize / 2, y)
  beginShape();
  for (let t = 0; t < waveSize; t += 0.5) {
    vertex(t, waveSize * distortion(t / waveSize * HALF_PI, amp));
  }
  endShape();
  pop();
}

function distortion(x, amp) {
  return -(x * (x - HALF_PI)) * amp * Math.sin(18 * x);
}

function draw() {
  // Background
  background(0);

  // Frequency line
  drawLine();

  // Distortions
  noFill();
  drawWaves();

  // Connections lines
  stroke(255);
  strokeWeight(1);
  keys.forEach(k => k.drawConnections());

  // Keys
  keys.forEach(k => k.drawKey());

  // Auto-play
  autoPlay();
}