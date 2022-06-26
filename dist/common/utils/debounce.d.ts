declare function debounce<T>(fn: (arg: T) => void, ms: number): (arg: T) => void;
export default debounce;
