/**
 * @file Dashboard helper.
 * @author Jordan Mann
 */

// fixme. this is a module, so these can't be global - what if there are multiple dashboards? pass them into setup and update and only declare in main.
// see godango. everything should be wrapped in main.
/** @type {HTMLFieldSetElement | null} */
let clockE;
/** @type {HTMLFieldSetElement | null} */
let dateE;
/** @type {HTMLFieldSetElement | null} */
let batteryE;

/**
 * Provide the correct clock emoji for a given time.
 * @param {Date} date the time.
 * @returns {string} the emoji.
 */
function clockEmoji(date) {
  return String.fromCodePoint(
    (date.getMinutes() < 30 ? 0x1f55a : 0x1f55b) + (date.getHours() % 12 || 12)
  );
}

/**
 * Update the clock UI component.
 */
function updateClock() {
  const now = new Date();
  /**
   * Numeric components of the date/time,
   * so we don't need to parse them one at a time.
   */
  const parts = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
    .formatToParts(now)
    .filter((part) => part.type !== 'literal');
  // .reduce((acc, { type, value }) => ({ ...acc, [type]: value }), {});
  const clockI = clockE?.querySelector('.icon');
  if (clockI instanceof HTMLElement) {
    clockI.innerText = clockEmoji(now);
  }
  const clockV = clockE?.querySelector('.value');
  if (clockV instanceof HTMLElement) {
    clockV.innerText = `${parts[2].value.padStart(2, '0')}${parts[3].value.padStart(2, '0')}`;
  }
  const clockP = clockE?.querySelector('progress');
  if (clockP instanceof HTMLProgressElement) {
    clockP.value = (now.getSeconds() + now.getMilliseconds() / 1000) / 60;
  }
  const dateV = dateE?.querySelector('.value');
  if (dateV instanceof HTMLElement) {
    dateV.innerText = `${parts[0].value.padStart(2, '0')}${parts[1].value.padStart(2, '0')}`;
  }
  const startOfMonth = new Date(now.getFullYear(), now.getMonth());
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1);
  const dateP = dateE?.querySelector('progress');
  if (dateP instanceof HTMLProgressElement) {
    dateP.value =
      (now.getTime() - startOfMonth.getTime()) / (endOfMonth.getTime() - startOfMonth.getTime());
  }
}

/**
 * Set up the time and date widgets.
 */
function setupClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Set up the battery widget.
 */
function setupBattery() {
  if (navigator.getBattery !== undefined) {
    batteryE?.removeAttribute('hidden');
    navigator.getBattery().then((battery) => {
      battery.addEventListener('chargingchange', () => {
        updateChargeInfo();
      });

      /**
       * Show the charging status of the battery.
       */
      function updateChargeInfo() {
        const batteryI = batteryE?.querySelector('.icon');
        if (batteryI instanceof HTMLElement) {
          batteryI.innerText = battery.charging ? '🔌' : battery.level <= 0.1 ? '🪫' : '🔋';
        }
      }

      battery.addEventListener('levelchange', () => {
        updateLevelInfo();
      });

      /**
       * Show the charging percentage of the battery.
       */
      function updateLevelInfo() {
        const batteryV = batteryE?.querySelector('.value');
        if (batteryV instanceof HTMLElement) {
          batteryV.innerText = Math.floor(battery.level * 100)
            .toString()
            .padStart(3, '0');
        }
        const batteryP = batteryE?.querySelector('progress');
        if (batteryP instanceof HTMLProgressElement) {
          batteryP.value = battery.level;
        }
      }

      updateChargeInfo();
      updateLevelInfo();
    });
  }
}
/**
 * Set up all widgets.
 */
export function main() {
  clockE = document.querySelector("fieldset[name='time']");
  dateE = document.querySelector("fieldset[name='date']");
  batteryE = document.querySelector("fieldset[name='battery']");
  setupClock();
  setupBattery();
}
