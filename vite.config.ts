import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Load .env into process.env so server-side loaders (e.g. workout.tsx) can
// read PB_EMAIL / PB_PASSWORD. Vite only exposes env via import.meta.env to
// client code, so this is required for process.env access during dev/build.
try {
  process.loadEnvFile();
} catch {
  // No .env file present — rely on real environment variables instead.
}

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
});
