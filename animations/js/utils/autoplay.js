let autoPlaying = false;
let startTime, songIndex;
const timeUnit = 0.5;
const odeOfJoy = [["d", 1], ["d", 1], ["f", 1], ["g", 1], ["g", 1], ["f", 1], ["d", 1], ["s", 1],
["a", 1], ["a", 1], ["s", 1], ["d", 1], ["d", 1], ["s", 1.5], ["s", 1],
["d", 1], ["d", 1], ["f", 1], ["g", 1], ["g", 1], ["f", 1], ["d", 1],
["s", 1], ["a", 1], ["a", 1], ["s", 1], ["d", 1], ["s", 1], ["a", 1.5], ["a", 1]];

function instantAutoPlay() {
    for (let i = 0; i < odeOfJoy.length; i++) {
        playNote(odeOfJoy[i][0], timeUnit * (i + odeOfJoy[i][1]));
    }
}

function toggleAutoPlay() {
    if (!autoPlaying) {
        autoPlaying = true;
        startTime = millis();
        songIndex = 0;
        loop();
        autoLabel.html('&#10539');
    } else {
        autoPlaying = false;
        autoLabel.html('&#10239');
    }
}

function autoPlay() {
    if (autoPlaying) {
        let timePassed = millis() - startTime;
        if (timePassed > 500 * (songIndex - 1 + odeOfJoy[songIndex][1])) {
            playNote(odeOfJoy[songIndex][0]);
            songIndex++;
        }
        if (songIndex == odeOfJoy.length) {
            autoPlaying = false;
        }
    }
}