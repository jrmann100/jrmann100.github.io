/**
 * @file Operates a set of spinning reels with randomized faces using spring physics.
 * @author Jordan Mann
 */

import { sauce, word } from './math.js';

// checkme: consider making this a component proper
/**
 * A single reel in a GodangoMachine,
 * able to control the state of the parent machine as necessary.
 */
export class GodangoReel {
  /**
   * The reel element itself.
   * @readonly
   * @type {HTMLElement}
   */
  reel;

  /**
   * The machine which contains this reel.
   * @readonly
   * @type {GodangoMachine}
   */
  parent;

  /**
   * The type of reel.
   * @type {'controller'|'word'|'sauce'}
   */
  type;

  /**
   * The two faces of the reel.
   * @readonly
   * @type {[HTMLElement, HTMLElement]}
   */
  faces;

  /**
   * The current velocity of the reel.
   * Positive values indicate downward movement.
   * @type {number}
   */
  #velocity = 0;

  get velocity() {
    return this.#velocity;
  }

  set velocity(value) {
    if (this.#velocity === 0 && value !== 0) {
      this.parent.movingReels++;
    } else if (this.#velocity !== 0 && value === 0) {
      this.parent.movingReels--;
    }
    this.#velocity = value;
  }

  /**
   * The text content of the currently visible face.
   * @type {string | null}
   */
  value = null;

  /**
   * Create a new face on this reel.
   * @returns {GodangoReel['faces'][0]} a new face element with content.
   */
  createFace() {
    const face = document.createElement('div');
    face.classList.add('face');
    this.refresh(face);
    return face;
  }

  /**
   * Update the content of a face (ideally when it is out of view).
   * @param {GodangoReel['faces'][0]} face the face to update.
   */
  refresh(face) {
    if (this.type === 'word') {
      face.textContent = word();
    } else if (this.type === 'sauce') {
      face.textContent = sauce();
    } else if (this.type === 'controller') {
      face.textContent = 'SPIN';
    } else {
      throw new Error(`Unknown reel type ${this.type}`);
    }
  }

  /**
   * When a face becomes visible, this reel's content is the content of the visible face.
   * The length of the displayed passphrase is updated accordingly.
   * @param {GodangoReel['faces'][0]} face the face which is now visible.
   */
  isNowVisible(face) {
    this.parent.currentLength -= this.value?.length ?? 0;
    this.value = face.textContent;
    this.parent.currentLength += this.value?.length ?? 0;
  }

  /**
   * Update the reel's faces based on its position.
   */
  render() {
    for (let i = 0; i < this.faces.length; i++) {
      const face = this.faces[i];
      let isFirstFace = i === 0;
      // the position of the second face is offset by 0.5
      // occasionally the position will be negative; then we should add 1, mod, then abs.
      const p = Math.abs((this.position + 1 + (isFirstFace ? 0.5 : 0)) % 1);
      face.style.transform = `translateY(${
        // go from all the way above the reel to all the way below it
        GodangoMachine.between(p, -100, 0, 100) - Number(!isFirstFace) * 100
      }%) rotateX(${GodangoMachine.between(p, GodangoMachine.constants.MAX_TILT, -GodangoMachine.constants.MAX_TILT)}deg)`;
      // when a face is entering, its bottom edge should be at the top;
      // when it is exiting, its top edge should be at the bottom.
      face.style.transformOrigin = `${GodangoMachine.between(p, 100, 0)}% 50%`;
      face.style.opacity = `${GodangoMachine.between(p, 0, 1, 0)}`;
    }
  }

  /**
   * The current position of the reel, between 0 and 1.
   * The faces swap positions such that there is always at least one face visible,
   * and another face entering from the top.
   *
   * | Position | First Face | Second Face |
   * |----------|------------|-------------|
   * | 0        | Center     | Above       |
   * | 0.49     | Below      | Entering    |
   * | 0.5      | Top        | Center      |
   * | 0.99     | Entering   | Below       |
   */
  #position = 0;

  get position() {
    return this.#position;
  }

  set position(newPosition) {
    if (this.type !== 'controller') {
      if (this.#position < 0.5 && newPosition >= 0.5) {
        this.refresh(this.faces[0]);
        this.isNowVisible(this.faces[1]);
      }
      if (newPosition > 1) {
        this.refresh(this.faces[1]);
        this.isNowVisible(this.faces[0]);
      }
    }
    this.#position = newPosition % 1;
    this.render();
  }

  /**
   * @param {GodangoMachine} parent the machine which contains this reel.
   * @param {GodangoReel['type']} [type] the type of reel to create.
   */
  constructor(parent, type = 'word') {
    this.parent = parent;
    this.reel = document.createElement(type === 'controller' ? 'button' : 'div');
    this.reel.classList.add('reel');
    this.type = type;
    this.faces = [this.createFace(), this.createFace()];
    this.reel.replaceChildren(...this.faces);
    this.reel.classList.add(type);
    if (type === 'controller') {
      this.parent.machine.insertBefore(this.reel, this.parent.contentWrapper);
    } else {
      this.parent.contentWrapper.appendChild(this.reel);
    }
    this.parent.reels.push(this);
    // force count to update
    this.isNowVisible(this.faces[0]);
  }
}

/**
 * @typedef {object} GodangoConfiguration
 * @property {string} separator the string to place between words.
 * @property {string} sauceSeparator the string to place before the sauce.
 * @property {number} wordCount the number of word reels (not including the controller or sauce reel).
 */

/**
 * A series of spinning reels which snap into place with a spring-like action,
 * constantly randomizing the words displayed on their faces.
 * Designed for the purpose of generating passphrases.
 * Not to be used for gambling.
 */
export default class GodangoMachine {
  /**
   * Container element for the reels.
   * @type {HTMLElement}
   */
  machine;

  /**
   * Container element for the non-controller reels.
   * @type {HTMLElement}
   */
  contentWrapper;

  /**
   * The current configuration of the machine.
   * @type {GodangoConfiguration}
   */
  configuration;

  /**
   * The reels of the machine.
   * @type {GodangoReel[]}
   */
  reels = [];

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
   * The velocity of the length indicator.
   * @type {number}
   */
  lengthVelocity = 0;

  /**
   * The number of reels currently moving.
   * The same as counting nonzero velocities.
   */
  movingReels = 0;

  /**
   * Constants used in the animation of any machine.
   */
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
     * If the reel is moving forward at velocity v,
     * the friction force applied to it is v * FORWARD_FRICTION_FACTOR.
     */
    FORWARD_FRICTION_FACTOR: 0.125,

    /**
     * If the reel is moving backward at velocity v,
     * the friction force applied to it is v * BACKWARD_FRICTION_FORCE.
     * This is stronger than forward friction to prevent prevent reels
     * from jiggling too much as they approach a snap point.
     */
    BACKWARD_FRICTION_FORCE: 0.5,

    /**
     * The instantaneous velocity added to a reel when it is boosted.
     */
    BOOST_VELOCITY: 5,

    /**
     * This describes the "stiffness" of the spring (see Hooke's law).
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
   * Interpolates between two or three stops based on a value between 0 and 1.
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

  // DEBUG_FRAME_RATE = 30;
  // DEBUG_DROPPED_FRAMES = 0;

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

    // if (this.DEBUG_DROPPED_FRAMES < 60 / this.DEBUG_FRAME_RATE - 1) {
    //   this.DEBUG_DROPPED_FRAMES++;
    //   requestAnimationFrame(this.handleAnimationFrame.bind(this));
    //   return;
    // }
    // this.DEBUG_DROPPED_FRAMES = 0;

    // limit the time delta to avoid large jumps;
    // e.g., if the page was momentarily inactive.
    const timeDelta =
      Math.min(timestamp - this.lastFrameTime, GodangoMachine.constants.MAX_FRAME_TIME) / 1000;
    this.lastFrameTime = timestamp;

    // this means timeFactor is 1 if running at 60 FPS, or 2 if running at 30 FPS.
    const timeFactor = timeDelta * 60;

    this.reels.forEach((reel, i) => {
      let totalForce =
        reel.velocity *
        -(reel.velocity > 0
          ? GodangoMachine.constants.FORWARD_FRICTION_FACTOR
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
        const nearestSnap = Math.round(reel.position * 2) / 2;
        // the spring can only engage if the velocity is low enough;
        // otherwise it glides across the peaks.
        if (reel.velocity < GodangoMachine.constants.SPRING_THRESHOLD) {
          totalForce += (nearestSnap - reel.position) * GodangoMachine.constants.SPRING_FACTOR;
        }
      }
      reel.velocity += totalForce * timeFactor;

      if (Math.abs(reel.velocity) < GodangoMachine.constants.MIN_ABS_VELOCITY) {
        reel.velocity = 0;
      }
    });

    for (let i = 0; i < this.clicks.length; i++) {
      // immediately boost the control reel and the first reel.
      if (this.clicks[i][1] === 0) {
        // boosting is technically a force, but it's instantaneous and not applied over time.
        // therefore we don't incorporate it into acceleration and apply it directly to the velocity.
        this.reels[this.clicks[i][1]++].velocity += GodangoMachine.constants.BOOST_VELOCITY;
        this.reels[this.clicks[i][1]++].velocity += GodangoMachine.constants.BOOST_VELOCITY;
        this.clicks[i][0] = timestamp;
      }
      // for every following reel, wait START_OFFSET ms after the last reel was boosted.
      else if (timestamp - this.clicks[i][0] > GodangoMachine.constants.CLICK_START_OFFSET) {
        this.clicks[i][0] = timestamp;
        this.reels[this.clicks[i][1]++].velocity += GodangoMachine.constants.BOOST_VELOCITY;
      }
      // remove this entry if there are no more reels to boost.
      // clicks is a queue and all clicks take the same amount of time to process,
      // so the entry to remove is always the first one.
      if (this.clicks[i][1] >= this.reels.length) {
        this.clicks.shift();
        i--;
      }
    }

    this.reels.forEach((reel) => (reel.position += timeDelta * reel.velocity));

    let lengthForce =
      // friction should be constant here since the effect should be the same
      // regardless of whether the length is increasing or decreasing.
      // backward is a bit stronger than forward so we use that.
      this.lengthVelocity * -GodangoMachine.constants.BACKWARD_FRICTION_FORCE +
      (this.currentLength - this.displayedLength) * GodangoMachine.constants.SPRING_FACTOR * 0.7;

    this.lengthVelocity += lengthForce * timeFactor;

    if (Math.abs(this.lengthVelocity) < GodangoMachine.constants.MIN_ABS_VELOCITY) {
      this.lengthVelocity = 0;
    }

    this.displayedLength += this.lengthVelocity * timeDelta;

    this.lengthBox.textContent = Math.round(this.displayedLength).toString();
    // this.lengthBox.style.transform = `translateY(${this.displayedLength - 30}px)`;

    // if all reels have stopped moving and none are held, pause the animation loop.
    if (
      this.movingReels === 0 &&
      timestamp - this.lastWheelTime >
        this.reels.length * GodangoMachine.constants.WHEEL_END_OFFSET &&
      this.lengthVelocity === 0
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
   * @param {GodangoConfiguration} [configuration] the configuration for the machine.
   */
  constructor(root, configuration = { wordCount: 5, sauceSeparator: '-', separator: '' }) {
    /** @type {HTMLElement | null} */
    const nullableMachine = root.querySelector('.godango-machine');
    if (nullableMachine === null) {
      throw new Error('Machine element not found');
    }
    this.machine = nullableMachine;

    this.contentWrapper = document.createElement('div');
    this.contentWrapper.classList.add('content');
    this.machine.appendChild(this.contentWrapper);

    this.configuration = configuration;

    new GodangoReel(this, 'controller');
    for (let i = 0; i < this.configuration.wordCount; i++) {
      new GodangoReel(this, 'word');
    }
    new GodangoReel(this, 'sauce');

    // <!-- todo: size length-value based on max length -->
    // <button name="copy" type="button">copy (<span class="length-value">(23)</span>)</button>
    const copyButton = this.machine.appendChild(document.createElement('button'));
    Object.assign(copyButton, {
      name: 'copy',
      type: 'button',
      innerHTML: 'copy (<span class="length-value">(23)</span>)'
    });

    /** @type {HTMLInputElement | null} */
    const nullableLengthBox = root.querySelector('.length-value');
    if (nullableLengthBox === null) {
      throw new Error('Length box element not found');
    }
    this.lengthBox = nullableLengthBox;

    // don't animate the initial length
    this.displayedLength = this.currentLength;

    /**
     * The controller reel is the first reel.
     * It has a static label and handles user input.
     */
    const controller = this.reels[0].reel;

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

        this.reels.forEach(
          (reel) => (reel.position = Math.max(reel.position - event.deltaY / 1000, 0))
        );
      }
    );

    // quickly init the reels - should just loop once and then terminate since there is no motion.
    this.resumeAnimation();
  }

  /**
   * Return the words currently being displayed.
   * @returns {(string | null)[]} the word displayed on each word reel.
   */
  getPassphrase() {
    return this.reels
      .slice(1) // skip the controller
      .map((reel) => reel.value);
  }
}
