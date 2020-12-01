let pitValues = [[0, 0], [2, 1], [4, 2], [11, 6], [1, 0], [3, 1], [5, 2], [2, 0], [7, 4], [9, 5], [6, 3], [8, 4], [10, 5]];
let natValues = [[1, 1], [9, 8], [5, 4], [4, 3], [3, 2], [5, 3], [15, 8], [2, 1], [16, 15], [6, 5], [45, 32], [8, 5], [9, 5]];
let eqValues = [0, 2, 4, 5, 7, 9, 11, 12, 1, 3, 6, 8, 10];

function getNumSharp() {
    let numFlat = 0;
    keys.forEach(key => {
        if (key.isFlat())
            numFlat++;
    })
    return numFlat;
}

function randomTemperament() {
    let numFlat = getNumSharp();
    let numSharp = keys.size - numFlat + 2;

    let i = 0, j = -1;

    keys.forEach(key => {
        let xOffset = key.isFlat() ?
            (1 + i++ / numFlat) :
            (1.05 + (j == 1 ? (j += 2) : (j += 1)) / numSharp);
        key.setPosition(xOffset + Math.random() * 0.04, -0.1);
    })

    redraw();
}

function pithagoreanTemperament() {
    let i = 0;

    keys.forEach(key => {
        let n = pitValues[i][0];
        let m = pitValues[i++][1];

        key.setPosition(Math.pow(3, n) / Math.pow(2, n + m), -0.1);
    })

    redraw();
}

function naturalTemperament() {
    let i = 0;

    keys.forEach(key => {
        let p = natValues[i][0];
        let q = natValues[i++][1];

        key.setPosition(p / q, -0.1);
    })

    redraw();
}

function equalTemperament() {
    let i = 0;

    keys.forEach(key => {
        let n = eqValues[i++];
        key.setPosition(Math.pow(2, n / 12), -0.1);
    })

    redraw();
}