import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Site https://<kullanici>.github.io/lunumi/ altında yayınlanır. Depo adın farklıysa sadece bu satırı değiştir.
const BASE = process.env.VITE_BASE ?? "/lunumi/";

export default defineConfig({
  base: BASE,
  plugins: [react()],
  define: {
    __BUILD_SHA__: JSON.stringify((process.env.GITHUB_SHA ?? "local").slice(0, 7)),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
