/**
 * @file Additional types used across modules.
 * @author Jordan Mann
 * @todo include lib.dom.ts types like NodeListOf, EventTarget, ParentNode in jsdoc or whatever
 */

interface EventTarget {
  export layoutAddEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined
  ): void;
}
interface Window {
  layoutSetInterval(handler: TimerHandler, timeout?: number, ...arguments: unknown[]): number;
}

declare function layoutSetInterval(
  handler: TimerHandler,
  timeout?: number,
  ...arguments: unknown[]
): number;

// fixme I think VSCode lib.dom.ts has this too
// https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/236/commits/5113f7bf4a99bbf43c0fae8403602f48701b3878
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
