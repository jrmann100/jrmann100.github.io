/**
 * @file Types for currently-nonstandard Battery Status API.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API}
 * {@link https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/236/commits/5113f7bf4a99bbf43c0fae8403602f48701b3878}
 * @author Jordan Mann
 */
/* eslint-disable jsdoc/require-jsdoc */

interface Navigator {
  getBattery(): Promise<BatteryManager>;
}

interface BatteryManager extends BatteryManagerEventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
}

interface BatteryManagerEventTargetEventMap {
  chargingchange: Event;
  chargingtimechange: Event;
  dischargingtimechange: Event;
  levelchange: Event;
}

interface BatteryManagerEventTarget extends EventTarget {
  onchargingchange: (this: BatteryManager, ev: Event) => unknown;
  onlevelchange: (this: BatteryManager, ev: Event) => unknown;
  onchargingtimechange: (this: BatteryManager, ev: Event) => unknown;
  ondischargingtimechange: (this: BatteryManager, ev: Event) => unknown;
  addEventListener<K extends keyof BatteryManagerEventTargetEventMap>(
    type: K,
    listener: (this: BatteryManager, ev: BatteryManagerEventTargetEventMap[K]) => unknown,
    useCapture?: boolean
  ): void;
}
