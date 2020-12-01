let frequencies = [];
let playing = false;

const synth = new Tone.Synth().toDestination();

function setup() {
  // Canvas
  createCanvas(windowWidth, windowHeight);
  updateSystem();

  // Font
  textFont('Georgia');
  textSize(18);
  textAlign(CENTER);

  // Render loop
  noLoop();
}

function windowResized() {
  // Update canvas
  resizeCanvas(windowWidth, windowHeight);
  updateSystem();

  // Redraw
  if (!playing)
    redraw();
}

function touchStarted() {
  let freq = toCartesianX(mouseX)
  if ((freq - 0.9) * (freq - 2.1) < 0) {
    frequencies.push(new Note(freq, true));
    playFrequncy(freq, 0);
  }
}

function playFrequncy(f) {
  loop();
  playing = true;
  synth.triggerAttackRelease(440 * f, "8n");
}

function drawLine() {
  stroke(255);
  strokeWeight(4);
  let x1 = toScreenX(0.9);
  let x2 = toScreenX(2.1);
  let y = toScreenY(0);

  let jumps = [];
  frequencies.forEach(note => {
    jumps.push(toScreenX(note.getFrequency()));
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

  fill(255);
  strokeWeight(0);
  let x = toScreenX(1);
  text("440Hz", x, y - waveSize / 1.5);

  strokeWeight(4);
  line(x, y - waveSize / 3, x, y + waveSize / 3);

  strokeWeight(0);
  x = toScreenX(2);
  text("880Hz", x, y - waveSize / 1.5);

  strokeWeight(4);
  line(toScreenX(2), y - waveSize / 3, toScreenX(2), y + waveSize / 3);
}

function drawWaves() {
  let notePlaying = false;
  frequencies.forEach(note => {
    if (note.played()) {
      notePlaying = true;
      drawDistortion(toScreenX(note.getFrequency()), yOrigin, note.getAmp());
      note.fade();
      if (!note.played())
        frequencies.shift();
    }
  });
  if (playing && !notePlaying) {
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
}