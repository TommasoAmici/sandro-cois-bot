import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/index.ts",
  output: {
    format: "esm",
    dir: "dist",
    preserveModules: false,
    preferConst: true,
    generatedCode: "es2015",
  },
  plugins: [typescript(), nodeResolve()],
};

export default config;
