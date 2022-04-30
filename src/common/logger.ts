const messagePrefix = "Lusift:";

export function log(message: string, ...args: any[]) {
    console.log(`${messagePrefix} ${message}`, ...args);
}

export function warn(message: string, ...args: any[]) {
    console.warn(`${messagePrefix} ${message}`, ...args);
}

export function error(message: string, ...args: any[]) {
    console.error(`${messagePrefix} ${message}`, ...args);
}
