class PianoKey {

    /**
     * Creates a key, given the (x,y) Cartesian coordinates and the key type.
     * @param {Number} x Coordinate x (Cartesian coordinate system)
     * @param {Number} y Coordinate y (Cartesian coordinate system)
     * @param {Boolean} flat True for a flat (white) key, false otherwise
     */
    constructor(x = 10, y = 10, flat = true, letter) {
        // Position (Cartesian coordinate system)
        this.x = x;
        this.y = y;

        // Flat or Sharp
        this.flat = flat;

        // Image
        this.selectImg();

        // Letter
        this.letter = letter;

        // Size
        this.scale = this.flat ? 0.327 : 0.356;
        this.setSize();

        // Wave timer
        this.DURATION = 15;
        this.t = 0;
    }

    /**
     * Select a white key if flat, black otherwise, between two version available from each.
     */
    selectImg() {
        this.img = Math.random() > 0.5 ?
            (this.flat ? flat1 : sharp1) : (this.flat ? flat2 : sharp2);
    }

    /**
     * Gets the frequency of the key.
     */
    getFrequency() {
        return this.x;
    }

    /**
     * Returns true if flat, false otherwise.
     */
    isFlat() {
        return this.flat;
    }

    /**
     * Sets the position of the key in the Cartesian coordinate system.
     * @param {Number} x Coordinate x
     * @param {Number} y Coordinate y
     */
    setPosition(x, y) {
        this.x = x == undefined ? 1 : (x < 1 ? 1 : (x > 2 ? 2 : x));
        this.y = y == undefined ? -0.1 : (y < (minCartesianY - 0.1) ?
            (minCartesianY - 0.1) : (y > maxCartesianY ? maxCartesianY : y));;
    }

    /**
     * Translates key by given amount in the screen coordinate system,
     * only if the new position is in bounds.
     * @param {*} x Translation on x screen axis 
     * @param {*} y Translation on y screen axis
     */
    translate(x, y) {
        // New position
        let newX = this.x - x * descaleFactor;
        let newY = this.y + y * descaleFactor;

        // Check if in bounds and eventually translates
        if ((newX - 1) * (newX - 2) <= 0)
            this.x = newX;
        if ((newY - minCartesianY - 0.1) * (newY - maxCartesianY) <= 0)
            this.y = newY;
    }

    /**
     * Sets the size of the key according to the coordinate system.
     */
    setSize() {
        this.height = this.img.height * 0.0007 * scaleFactor;
        this.width = this.height * this.scale;
    }

    /**
     * Draws the connection line between the key and the frequency line.
     */
    drawConnections() {
        // Position
        let p = toScreen(this.x, this.y);

        // Render
        line(p.x, p.y + this.height / 2, p.x,
            yOrigin + (this.t > 0) * this.getAmp() * waveSize * 1.1);
    }

    /**
     * Draws the key.
     */
    drawKey() {
        // Colors
        let c = this.flat ? 0 : 1;
        stroke(255 * c);
        strokeWeight(3 - 1 * c);
        fill(255 * (1 - c));

        // Position
        let x = toScreenX(this.x);
        let y = toScreenY(this.y);

        // Render key
        // rect(x - this.width * 0.5, y, this.width, this.height);
        image(this.img, x - this.width * 0.5, y, this.width, this.height);

        // Render letter
        let tSize = waveSize / 3;
        fill(255 * c);
        strokeWeight(1 - c);
        textSize(tSize);
        text(this.letter, x, y + this.height * 0.85 - tSize / 2);

        // Render frequency
        fill(255);
        stroke(0)
        strokeWeight(5)
        text(this.x.toFixed(2), x, yOrigin - waveSize / 2);
    }

    /**
     * Returns true if (x,y) is inside the key bounds, false otherwise.
     * @param {Number} x Coordinate x (Screen coordinate system)
     * @param {Number} y Coordinate y (Screen coordinate system)
     */
    selected(x, y) {
        // Position
        let p = toScreen(this.x, this.y);

        return (x - p.x + this.width * 0.5 - 3) * (x - p.x - this.width * 0.5 + 3) < 0
            && (y - p.y - 3) * (y - p.y - this.height + 3) < 0;
    }

    /**
     * Plays the key.
     */
    play() {
        this.t = this.DURATION;
    }

    /**
     * Returns true if the key is currently played, false otherwise.
     */
    played() {
        return this.t > 0;
    }

    /**
     * Returns the fading state as a number between 0 and 1.
     */
    getFade() {
        return (1 - this.t / this.DURATION);
    }

    /**
     * Returns the visual amplitude of the note
     * according to the current fade state.
     */
    getAmp() {
        return 2 * Math.sin(PI * this.getFade()) / TWO_PI
    }

    /**
     * Makes the note fade.
     */
    fade() {
        this.t--;
    }

}