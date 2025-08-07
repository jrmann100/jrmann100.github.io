/**
 * @file Operates a set of spinning reels with randomized faces using spring physics.
 * @author Jordan Mann
 */

import { sauce, word } from './math.js';

export default class GodangoMachine {
  /**
   * Container element for the reels.
   * @type {HTMLElement}
   */
  machine;

  /**
   * The reels of the machine.
   * @type {HTMLElement[]}
   */
  reels;

  /**
   * Displays the length of the current passphrase.
   * @type {HTMLInputElement}
   */
  lengthBox;

  /**
   * The length being currently displayed.
   */
  displayedLength = 0; // TODO: calculate initial value based on the initial words

  /**
   * The sum of the lengths of all words currently displayed on the reels.
   */
  currentLength = 0;

  /**
   * The words currently displayed on the reels.
   * @type {(string | null)[]}
   */
  words = [];

  /**
   * Update a word currently being displayed on a reel,
   * and any other UI state that depends on it.
   * @param {number} index the index of the reel to update.
   * @param {*} word the new word to display.
   */
  setWord(index, word) {
    this.currentLength -= this.words[index]?.length ?? 0;
    this.words[index] = word;
    this.currentLength += word.length;
  }

  constantLength = 0;

  /**
   * TODO: description. actually, methods should have required descriptions.
   * @param {number} length
   */
  setConstantLength(length) {
    this.currentLength -= this.constantLength;
    this.constantLength = length;
    this.currentLength += this.constantLength;
    this.resumeAnimation();
  }

  /**
   * The faces of the machine, grouped in pairs by reel.
   * @type {[HTMLElement, HTMLElement][]}
   */
  faces;

  /**
   * The total number of reels, including the controller.
   */
  get reelCount() {
    return this.faces.length;
  }

  /**
   * The velocity of each reel.
   * @type {number[]}
   */
  velocities;

  /**
   * The velocity of the length indicator.
   * @type {number}
   */
  lengthVelocity = 0;

  /**
   * The position of each reel, between 0 and 1.
   * The faces swap positions such that there is always at least one face visible,
   * and another face entering from the top.
   *
   * | Position | First Face | Second Face |
   * |----------|------------|-------------|
   * | 0        | Center     | Above       |
   * | 0.49     | Below      | Entering    |
   * | 0.5      | Top        | Center      |
   * | 0.99     | Entering   | Below       |
   * @type {number[]}
   */
  positions;

  /**
   * The number of reels currently moving.
   * The same as counting nonzero velocities.
   */
  movingReels = 0;

  static constants = Object.freeze({
    NEVER: -Infinity,
    /**
     * Delay between boosting each reel after a click.
     */
    CLICK_START_OFFSET: 50,

    /**
     * Delay between re-engaging the spring on each reel after manual scrolling.
     */
    WHEEL_END_OFFSET: 50,

    /**
     * TODO
     */
    FORWARD_FRICTION_FORCE: 0.1,

    /**
     * TODO
     */
    BACKWARD_FRICTION_FORCE: 0.5,

    /**
     * TODO
     */
    BOOST_AMOUNT: 4,

    /**
     * TODO
     */
    SPRING_FACTOR: 8,

    /**
     * The velocity at which the wheel is moving too fast for the spring to engage.
     * If this is too high, then the spring continues to jump to the next snap point
     * before friction has an opportunity to slow it down; leading to the reel never stopping.
     */
    SPRING_THRESHOLD: 1.3,

    /**
     * Maximum time delta for a single animation frame, in seconds.
     */
    MAX_FRAME_TIME: 250 / 6,

    /**
     * The minimum velocity at which a reel is considered moving.
     */
    MIN_ABS_VELOCITY: 0.01,

    /**
     * The maximum number of degrees each face should be visually rotated when entering or exiting.
     */
    MAX_TILT: 50
  });

  /**
   * The time the last wheel event was triggered, or -Infinity if no wheel event has occurred.
   */
  lastWheelTime = GodangoMachine.constants.NEVER;

  /**
   * The time the last animation frame was processed, or -Infinity if no frames have been processed.
   */
  lastFrameTime = GodangoMachine.constants.NEVER;

  /**
   * Whether the animation loop is currently running.
   */
  animationRunning = false;

  /**
   * Queue of tuples containing the time the last reel was boosted and the index of the next reel to boost.
   * @type {[number, number][]}
   */
  clicks = [];

  /**
   * Calculates a value between two stops based on position.
   * @overload
   * @param {number} position the position value between 0 and 1.
   * @param {number} start the first stop value.
   * @param {number} end the second stop value.
   * @returns {number} the calculated value between the stops.
   */

  /**
   * Calculates a value between three stops based on position.
   * @overload
   * @param {number} position the position value between 0 and 1.
   * @param {number} firstStop the first stop value.
   * @param {number} secondStop the second stop value.
   * @param {number} thirdStop the optional third stop value.
   * @returns {number} the calculated value between the stops.
   */

  /**
   * @param {number} position the position value between 0 and 1.
   * @param {number} firstStop the first stop value.
   * @param {number} secondStop the second stop value.
   * @param {number} [thirdStop] the optional third stop value.
   * @returns {number} the calculated value between the stops.
   */
  static between(position, firstStop, secondStop, thirdStop) {
    if (thirdStop === undefined) {
      return firstStop + (secondStop - firstStop) * position;
    } else if (position < 0.5) {
      return firstStop + (secondStop - firstStop) * (position * 2);
    }
    return secondStop + (thirdStop - secondStop) * ((position - 0.5) * 2);
  }

  /**
   * Add velocity to a reel.
   * Updates {@link movingReels} if the reel transitions between moving and stopped.
   * @param {number} reelIndex the index of the reel to add velocity to.
   * @param {number} delta the amount of velocity to add.
   */
  addVelocity(reelIndex, delta) {
    if (delta === 0) return;

    if (this.velocities[reelIndex] === 0) {
      this.velocities[reelIndex] = delta;
      this.movingReels++;
      return;
    }

    if ((this.velocities[reelIndex] += delta) === 0) {
      this.movingReels--;
    }
  }

  /**
   * Set the velocity of a reel to a specific value.
   * Decrements {@link movingReels} if the reel was previously moving.
   * @param {*} reelIndex
   */
  clearVelocity(reelIndex) {
    if (this.velocities[reelIndex] !== 0) {
      this.velocities[reelIndex] = 0;
      this.movingReels--;
    }
  }

  /**
   * Update the position of a reel face.
   * @param {HTMLElement} face the element to update.
   * @param {number} position the position value between 0 and 1.
   * @param {boolean} [a] whether this is the first or the second face of the reel.
   */
  renderFace(face, position, a = false) {
    // the position of the second face is offset by 0.5
    // occasionally the position will be negative; then we should add 1, mod, then abs.
    const p = Math.abs((position + 1 + (a ? 0.5 : 0)) % 1);
    face.style.transform = `translateY(${
      // go from all the way above the reel to all the way below it
      GodangoMachine.between(p, -100, 0, 100) - Number(!a) * 100
    }%) rotateX(${GodangoMachine.between(p, GodangoMachine.constants.MAX_TILT, -GodangoMachine.constants.MAX_TILT)}deg)`;
    // when a face is entering, its bottom edge should be at the top;
    // when it is exiting, its top edge should be at the bottom.
    face.style.transformOrigin = `${GodangoMachine.between(p, 100, 0)}% 50%`;
    face.style.opacity = `${GodangoMachine.between(p, 0, 1, 0)}`;
  }

  /**
   * Get new content for a reel face - a sauce value if it is the sauce (last) reel;
   * otherwise, a random word.
   * @param {number} i the index of the reel getting new content.
   * @returns {string} the new content for the face.
   */
  getNewFaceContent(i) {
    return i === this.reels.length - 1 ? sauce() : word();
  }

  /**
   * Update the position of a reel.
   * @param {number} i the index of the reel to update.
   * @param {number} newPosition the new position of the reel, between 0 and 1.
   * @param {boolean} [force] whether to force an update of the reel content.
   */
  updatePosition(i, newPosition, force = false) {
    const [a, b] = this.faces[i];
    if (i !== 0) {
      if (force || (this.positions[i] < 0.5 && newPosition >= 0.5)) {
        this.setWord(i - 1, b.textContent);
        // the sauce reel is the last reel
        a.textContent = this.getNewFaceContent(i);
      }
      if (force || newPosition > 1) {
        this.setWord(i - 1, a.textContent);
        // the sauce reel is the last reel
        b.textContent = this.getNewFaceContent(i);
      }
      if (force) {
        this.displayedLength = this.currentLength;
      }
    }
    this.positions[i] = newPosition % 1;
    this.renderFace(a, this.positions[i], true);
    this.renderFace(b, this.positions[i], false);
  }

  // TODO: remove this debug code?
  DEBUG_FRAME_RATE = Infinity;
  DEBUG_DROPPED_FRAMES = 0;
  /**
   * Update the state of the machine until all reels have stabilized.
   * @type {FrameRequestCallback}
   */
  handleAnimationFrame(timestamp) {
    if (!this.animationRunning) return;

    // convenient hack: skip the first frame to determine the frame rate.
    // just make sure to reset timestamp to NEVER once the animation pauses.
    if (this.lastFrameTime === GodangoMachine.constants.NEVER) {
      this.lastFrameTime = timestamp;
      requestAnimationFrame(this.handleAnimationFrame.bind(this));
      return;
    }

    // debug: frame dropper
    if (this.DEBUG_DROPPED_FRAMES < 60 / this.DEBUG_FRAME_RATE - 1) {
      this.DEBUG_DROPPED_FRAMES++;
      requestAnimationFrame(this.handleAnimationFrame.bind(this));
      // console.log(`DEBUG: Dropped frame`);
      return;
    }

    this.DEBUG_DROPPED_FRAMES = 0;

    // limit the time delta to avoid large jumps;
    // e.g., if the page was momentarily inactive.
    const timeDelta =
      Math.min(timestamp - this.lastFrameTime, GodangoMachine.constants.MAX_FRAME_TIME) / 1000;
    this.lastFrameTime = timestamp;

    // this means timeFactor is 1 if running at 60 FPS, or 2 if running at 30 FPS.
    const timeFactor = timeDelta * 60;

    this.faces.forEach((_, i) => {
      let totalForce =
        this.velocities[i] *
        -(this.velocities[i] > 0
          ? GodangoMachine.constants.FORWARD_FRICTION_FORCE
          : GodangoMachine.constants.BACKWARD_FRICTION_FORCE);

      if (
        timestamp - this.lastWheelTime >
        (i === 0 ? 1 : i) * GodangoMachine.constants.WHEEL_END_OFFSET
      ) {
        // manual movement (scrolling) overrides the spring.
        // once there has been END_OFFSET ms of no manual movement,
        // the springs start to engage one at a time every END_OFFSET ms,
        // except for the controller (0th) reel, which engages at the same time as the first reel.
        // round to nearest 0.5
        const nearestSnap = Math.round(this.positions[i] * 2) / 2;
        // the spring can only engage if the velocity is low enough;
        // otherwise it glides across the peaks.
        if (this.velocities[i] < GodangoMachine.constants.SPRING_THRESHOLD && this.positions[i]) {
          // const adjustedSpringFactor = timeFactor < 2 ? GodangoMachine.constants.SPRING_FACTOR : 1;
          totalForce += (nearestSnap - this.positions[i]) * GodangoMachine.constants.SPRING_FACTOR;
        }

        this.addVelocity(i, totalForce * timeFactor);
        // TODO: not stopping fast enough

        if (Math.abs(this.velocities[i]) < GodangoMachine.constants.MIN_ABS_VELOCITY) {
          this.clearVelocity(i);
        }
      }
    });

    for (let i = 0; i < this.clicks.length; i++) {
      // immediately boost the control reel and the first reel.
      if (this.clicks[i][1] === 0) {
        // boosting is technically a force, but it's instantaneous and not applied over time.
        // therefore we don't incorporate it into acceleration and apply it directly to the velocity.
        this.addVelocity(this.clicks[i][1]++, GodangoMachine.constants.BOOST_AMOUNT);
        this.addVelocity(this.clicks[i][1]++, GodangoMachine.constants.BOOST_AMOUNT);
        this.clicks[i][0] = timestamp;
      }
      // for every following reel, wait START_OFFSET ms after the last reel was boosted.
      else if (timestamp - this.clicks[i][0] > GodangoMachine.constants.CLICK_START_OFFSET) {
        this.clicks[i][0] = timestamp;
        this.addVelocity(this.clicks[i][1]++, GodangoMachine.constants.BOOST_AMOUNT);
      }
      // remove this entry if there are no more reels to boost.
      // clicks is a queue and all clicks take the same amount of time to process,
      // so the entry to remove is always the first one.
      if (this.clicks[i][1] >= this.reelCount) {
        this.clicks.shift();
        i--;
      }
    }

    for (let i = 0; i < this.reelCount; i++) {
      this.updatePosition(i, this.positions[i] + timeDelta * this.velocities[i]);
    }

    // // TODO: update to force-based
    // this.lengthVelocity =
    //   // TODO: magic number
    //   this.lengthVelocity *
    //     Math.pow(GodangoMachine.constants.FORWARD_FRICTION_FORCE * 0.5, timeFactor) +
    //   (this.currentLength - this.displayedLength) *
    //     GodangoMachine.constants.SPRING_FACTOR *
    //     timeFactor *
    //     0.5;

    // if (Math.abs(this.lengthVelocity) < GodangoMachine.constants.MIN_ABS_VELOCITY) {
    //   this.lengthVelocity = 0;
    // }

    // this.displayedLength += this.lengthVelocity * timeDelta;

    // this.lengthBox.value = Math.round(this.displayedLength).toString();
    // this.lengthBox.style.transform = `translateY(${this.displayedLength - 30}px)`;

    // if all reels have stopped moving and none are held, pause the animation loop.
    if (
      this.movingReels === 0 &&
      timestamp - this.lastWheelTime > this.reelCount * GodangoMachine.constants.WHEEL_END_OFFSET
      // this.lengthVelocity === 0
    ) {
      this.animationRunning = false;
      this.lastFrameTime = GodangoMachine.constants.NEVER;
    } else {
      requestAnimationFrame(this.handleAnimationFrame.bind(this));
    }
  }

  /**
   * Re-start the animation loop if it was paused.
   */
  resumeAnimation() {
    if (!this.animationRunning) {
      this.animationRunning = true;
      requestAnimationFrame(this.handleAnimationFrame.bind(this));
    }
  }

  /**
   * Construct a new machine.
   * @param {Element} root an element which contains all components of the machine.
   */
  constructor(root) {
    /** @type {HTMLElement | null} */
    const nullableMachine = root.querySelector('.godango-machine');
    if (nullableMachine === null) {
      throw new Error('Machine element not found');
    }
    this.machine = nullableMachine;

    this.reels = Array.from(this.machine.querySelectorAll('.reel'));
    this.faces = this.reels.map((reel) => {
      /**
       * @type {HTMLElement[]}
       */
      const theseFaces = Array.from(reel.querySelectorAll('.face'));
      if (theseFaces.length !== 2) {
        throw new Error('Each reel must have exactly two faces');
      }
      const [a, b] = theseFaces;
      return [a, b];
    });

    /** @type {HTMLInputElement | null} */
    const nullableLengthBox = root.querySelector('input[name=length]');
    if (nullableLengthBox === null) {
      throw new Error('Length box element not found');
    }
    this.lengthBox = nullableLengthBox;

    this.velocities = new Array(this.reelCount).fill(0);
    this.positions = new Array(this.reelCount).fill(0);

    /**
     * The controller reel is the first reel.
     * It has a static label and handles user input.
     */
    const controller = this.reels[0];

    controller.addEventListener('click', () => {
      this.clicks.push([GodangoMachine.constants.NEVER, 0]);
      this.resumeAnimation();
    });

    // TODO: add touch support; and click and drag flicking?
    controller.addEventListener(
      'wheel',
      (
        /** @type {WheelEvent} */
        event
      ) => {
        event.preventDefault();
        if (event.deltaY >= 0) {
          return;
        }
        // safe to call every time; there's an embedded check to prevent multiple RAF calls.
        this.resumeAnimation();
        this.lastWheelTime = performance.now();
        // manually scroll the reels.
        for (let i = 0; i < this.reelCount; i++) {
          this.updatePosition(i, Math.max(this.positions[i] - event.deltaY / 1000, 0));
        }
      }
    );

    for (let i = 1; i < this.reelCount; i++) {
      this.updatePosition(i, this.positions[i], true);
    }

    // quickly init the reels - should just loop once and then terminate since there is no motion.
    this.resumeAnimation();
  }

  getPassphrase() {
    return this.positions
      .slice(1) // skip the controller
      .map((position, i) =>
        position < 0.25 || position > 0.75
          ? this.faces[i + 1][0].textContent
          : this.faces[i + 1][1].textContent
      );
  }
}
