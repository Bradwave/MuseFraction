// Origin
let xOrigin, yOrigin;
let percentage = 0.7;

// Scale and descale factors
let minDim, scaleFactor, descaleFactor;

// Bounds
let minCartesianY, maxCartesianY;

// Wave
let waveSize;

/**
 * Updates the coordinate system.
 * @param {Number} xPercentage Number between 0 and 1 (0.7 as default)
 * @param {Number} yPercentage Number between 0 and 1 (0.33 as default)
 * which the Cartesian unit represented as a percentage of the canvas width 
 */
function updateSystem(xPercentage = 0.7, yPercentage = 0.33) {
    minDim = min(width, height);

    // Scale and descale factors
    percentage = xPercentage;
    scaleFactor = width * percentage;
    descaleFactor = 1.000000 / scaleFactor;

    // Origin
    xOrigin = - (1.5 * percentage - 0.5) * width;
    yOrigin = height * yPercentage;

    // Bounds
    minCartesianY = toCartesianY(height);
    maxCartesianY = toCartesianY(0);

    // Wave
    waveSize = scaleFactor * 0.05;
}

/**
 * Converts screen coordinates to Cartesian coordinates with origin set by the user.
 * @param {Number} x Coordinate x
 * @param {Number} y Coordinate y
 */
function toCartesian(x, y) {
    return { x: toCartesianX(x), y: toCartesianY(y) };
}

/**
 * Converts screen coordinate x to Cartesian coordinate x
 * where the origin of the Cartesian coordinate system is set by the user.
 * @param {*} x Coordinate x
 */
function toCartesianX(x) {
    return (x - xOrigin) * descaleFactor;
}

/**
 * Converts screen coordinate y to Cartesian coordinate y
 * where the origin of the Cartesian coordinate system is set by the user.
 * @param {*} y Coordinate y
 */
function toCartesianY(y) {
    return (yOrigin - y) * descaleFactor;
}

/**
* Converts Cartesian coordinates to screen coordinates with origin in the top left corner of the window.
* @param {Number} x Coordinate x
* @param {Number} y Coordinate y
*/
function toScreen(x, y) {
    return { x: toScreenX(x), y: toScreenY(y) };
}

/**
 * Converts Cartesian coordinate x to screen coordinate x
 * where the origin of the screen coordinate system is in the top left corner of the canvas.
 * @param {Number} x Coordinate x
 */
function toScreenX(x) {
    return x * scaleFactor + xOrigin;
}

/**
 * Converts Cartesian coordinate y to screen coordinate y
 * where the origin of the screen coordinate system is in the top left corner of the canvas.
 * @param {Number} y Coordinate y 
 */
function toScreenY(y) {
    return yOrigin - y * scaleFactor;
}

