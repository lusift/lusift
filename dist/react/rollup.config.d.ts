export default config;
declare namespace config {
    const input: string;
    namespace output {
        const file: string;
        const name: string;
        const format: string;
        const sourcemap: boolean;
    }
    const plugins: import("rollup").Plugin[];
}
