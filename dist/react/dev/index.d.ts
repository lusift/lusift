export = isEqual;
export = isEqual;
/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
declare function isEqual(value: any, other: any): boolean;
declare namespace isEqual {
    export { unstable_now, unstable_forceFrameRate, unstable_IdlePriority, unstable_ImmediatePriority, unstable_LowPriority, unstable_NormalPriority, unstable_Profiling, unstable_UserBlockingPriority, unstable_cancelCallback, unstable_continueExecution, unstable_getCurrentPriorityLevel, unstable_getFirstCallbackNode, unstable_next, unstable_pauseExecution, Z as unstable_requestPaint, unstable_runWithPriority, unstable_scheduleCallback, unstable_shouldYield, unstable_wrapCallback };
}
declare function unstable_now(): number;
declare function unstable_forceFrameRate(): void;
declare var unstable_IdlePriority: number;
declare var unstable_ImmediatePriority: number;
declare var unstable_LowPriority: number;
declare var unstable_NormalPriority: number;
declare var unstable_Profiling: any;
declare var unstable_UserBlockingPriority: number;
declare function unstable_cancelCallback(a: any): void;
declare function unstable_continueExecution(): void;
declare function unstable_getCurrentPriorityLevel(): number;
declare function unstable_getFirstCallbackNode(): any;
declare function unstable_next(a: any): any;
declare function unstable_pauseExecution(): void;
declare function Z(): void;
declare function unstable_runWithPriority(a: any, b: any): any;
declare function unstable_scheduleCallback(a: any, b: any, c: any): any;
declare function unstable_shouldYield(): any;
declare function unstable_wrapCallback(a: any): (...args: any[]) => any;
