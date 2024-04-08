// vite.config.ts
import { defineConfig } from "file:///C:/project/gelios-fluidd/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/project/gelios-fluidd/node_modules/@vitejs/plugin-vue2/dist/index.mjs";
import { VitePWA } from "file:///C:/project/gelios-fluidd/node_modules/vite-plugin-pwa/dist/index.js";
import Components from "file:///C:/project/gelios-fluidd/node_modules/unplugin-vue-components/dist/vite.js";
import { VuetifyResolver } from "file:///C:/project/gelios-fluidd/node_modules/unplugin-vue-components/dist/resolvers.js";
import path2 from "path";
import content from "file:///C:/project/gelios-fluidd/node_modules/@originjs/vite-plugin-content/dist/mjs/index.js";
import monacoEditorPluginModule from "file:///C:/project/gelios-fluidd/node_modules/vite-plugin-monaco-editor/dist/index.js";
import checker from "file:///C:/project/gelios-fluidd/node_modules/vite-plugin-checker/dist/esm/main.js";

// vite.config.inject-version.ts
import child_process from "child_process";
import fs from "fs";
import path from "path";

// package.json
var version = "0.5.0";

// vite.config.inject-version.ts
var __vite_injected_original_dirname = "C:\\project\\gelios-fluidd";
var writeVersionFile = async () => {
  const versionFile = await fs.promises.open(path.resolve(__vite_injected_original_dirname, "dist/.version"), "w");
  await versionFile.writeFile(`v${version}`);
  await versionFile.close();
};
var writeReleaseInfoFile = async () => {
  const releaseInfoFile = await fs.promises.open(path.resolve(__vite_injected_original_dirname, "dist/release_info.json"), "w");
  await releaseInfoFile.writeFile(JSON.stringify({
    project_name: "fluidd",
    project_owner: "UselessJoy",
    version: `v${version}`
  }));
  await releaseInfoFile.close();
};
var vitePluginInjectVersion = () => {
  return {
    name: "version",
    config: () => {
      const git_hash = child_process.execSync("git rev-parse --short HEAD").toString();
      return {
        define: {
          "import.meta.env.VERSION": JSON.stringify(version),
          "import.meta.env.HASH": JSON.stringify(git_hash)
        }
      };
    },
    writeBundle: () => {
      setImmediate(async () => {
        await writeVersionFile();
        await writeReleaseInfoFile();
      });
    }
  };
};
var vite_config_inject_version_default = vitePluginInjectVersion;

// vite.config.ts
var __vite_injected_original_dirname2 = "C:\\project\\gelios-fluidd";
var isObjectWithDefaultFunction = (module) => module != null && typeof module === "object" && "default" in module && typeof module.default === "function";
var monacoEditorPlugin = isObjectWithDefaultFunction(monacoEditorPluginModule) ? monacoEditorPluginModule.default : monacoEditorPluginModule;
var vite_config_default = defineConfig({
  plugins: [
    VitePWA({
      srcDir: "src",
      filename: "sw.ts",
      strategies: "injectManifest",
      includeAssets: [
        "**/*.svg",
        "**/*.png",
        "**/*.ico",
        "editor.theme.json"
      ],
      injectManifest: {
        globPatterns: [
          "**/*.{js,css,html,ttf,woff,woff2,wasm}"
        ],
        maximumFileSizeToCacheInBytes: 4 * 1024 ** 2
      },
      manifest: {
        name: "fluidd",
        short_name: "fluidd",
        description: "The Klipper web interface for managing your 3d printer",
        theme_color: "#2196F3",
        background_color: "#000000",
        icons: [
          {
            src: "img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "img/icons/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "img/icons/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        shortcuts: [
          {
            name: "Configuration",
            url: "#/configure",
            icons: [
              {
                src: "img/icons/shortcut-configuration-96x96.png",
                sizes: "96x96",
                type: "image/png"
              }
            ]
          },
          {
            name: "Settings",
            url: "#/settings",
            icons: [
              {
                src: "img/icons/shortcut-settings-96x96.png",
                sizes: "96x96",
                type: "image/png"
              }
            ]
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html"
      }
    }),
    vue(),
    vite_config_inject_version_default(),
    content(),
    monacoEditorPlugin({
      languageWorkers: ["editorWorkerService", "json", "css"]
    }),
    checker({
      vueTsc: {
        tsconfigPath: path2.resolve(__vite_injected_original_dirname2, "./tsconfig.app.json")
      }
    }),
    Components({
      dts: true,
      dirs: [
        "src/components/common",
        "src/components/layout",
        "src/components/ui"
      ],
      resolvers: [
        VuetifyResolver()
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      css: { charset: false },
      scss: {
        additionalData: '@import "@/scss/variables";\n'
      },
      sass: {
        additionalData: '@import "@/scss/variables.scss"\n'
      }
    }
  },
  envPrefix: "VUE_",
  resolve: {
    alias: {
      "@": path2.resolve(__vite_injected_original_dirname2, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [
      "./tests/unit/setup.ts"
    ],
    alias: [
      { find: /^vue$/, replacement: "vue/dist/vue.runtime.common.js" }
    ]
  },
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 8080
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS5jb25maWcuaW5qZWN0LXZlcnNpb24udHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxccHJvamVjdFxcXFxnZWxpb3MtZmx1aWRkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxwcm9qZWN0XFxcXGdlbGlvcy1mbHVpZGRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3Byb2plY3QvZ2VsaW9zLWZsdWlkZC92aXRlLmNvbmZpZy50c1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlMidcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgVnVldGlmeVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBjb250ZW50IGZyb20gJ0BvcmlnaW5qcy92aXRlLXBsdWdpbi1jb250ZW50J1xuaW1wb3J0IG1vbmFjb0VkaXRvclBsdWdpbk1vZHVsZSBmcm9tICd2aXRlLXBsdWdpbi1tb25hY28tZWRpdG9yJ1xuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcidcbmltcG9ydCB2ZXJzaW9uIGZyb20gJy4vdml0ZS5jb25maWcuaW5qZWN0LXZlcnNpb24nXG5cbi8vIEZpeCBmb3IgaW5jb3JyZWN0IHR5cGluZ3Mgb24gdml0ZS1wbHVnaW4tbW9uYWNvLWVkaXRvclxuY29uc3QgaXNPYmplY3RXaXRoRGVmYXVsdEZ1bmN0aW9uID0gKG1vZHVsZTogdW5rbm93bik6IG1vZHVsZSBpcyB7IGRlZmF1bHQ6IHR5cGVvZiBtb25hY29FZGl0b3JQbHVnaW5Nb2R1bGUgfSA9PiAoXG4gIG1vZHVsZSAhPSBudWxsICYmXG4gIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmXG4gICdkZWZhdWx0JyBpbiBtb2R1bGUgJiZcbiAgdHlwZW9mIG1vZHVsZS5kZWZhdWx0ID09PSAnZnVuY3Rpb24nXG4pXG5cbmNvbnN0IG1vbmFjb0VkaXRvclBsdWdpbiA9IGlzT2JqZWN0V2l0aERlZmF1bHRGdW5jdGlvbihtb25hY29FZGl0b3JQbHVnaW5Nb2R1bGUpXG4gID8gbW9uYWNvRWRpdG9yUGx1Z2luTW9kdWxlLmRlZmF1bHRcbiAgOiBtb25hY29FZGl0b3JQbHVnaW5Nb2R1bGVcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIFZpdGVQV0Eoe1xuICAgICAgc3JjRGlyOiAnc3JjJyxcbiAgICAgIGZpbGVuYW1lOiAnc3cudHMnLFxuICAgICAgc3RyYXRlZ2llczogJ2luamVjdE1hbmlmZXN0JyxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcbiAgICAgICAgJyoqLyouc3ZnJyxcbiAgICAgICAgJyoqLyoucG5nJyxcbiAgICAgICAgJyoqLyouaWNvJyxcbiAgICAgICAgJ2VkaXRvci50aGVtZS5qc29uJ1xuICAgICAgXSxcbiAgICAgIGluamVjdE1hbmlmZXN0OiB7XG4gICAgICAgIGdsb2JQYXR0ZXJuczogW1xuICAgICAgICAgICcqKi8qLntqcyxjc3MsaHRtbCx0dGYsd29mZix3b2ZmMix3YXNtfSdcbiAgICAgICAgXSxcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDQgKiAxMDI0ICoqIDJcbiAgICAgIH0sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiAnZmx1aWRkJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ2ZsdWlkZCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIEtsaXBwZXIgd2ViIGludGVyZmFjZSBmb3IgbWFuYWdpbmcgeW91ciAzZCBwcmludGVyJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjMjE5NkYzJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ2ltZy9pY29ucy9hbmRyb2lkLWNocm9tZS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ2ltZy9pY29ucy9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ2ltZy9pY29ucy9hbmRyb2lkLWNocm9tZS1tYXNrYWJsZS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnbWFza2FibGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdpbWcvaWNvbnMvYW5kcm9pZC1jaHJvbWUtbWFza2FibGUtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgcHVycG9zZTogJ21hc2thYmxlJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgc2hvcnRjdXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ0NvbmZpZ3VyYXRpb24nLFxuICAgICAgICAgICAgdXJsOiAnIy9jb25maWd1cmUnLFxuICAgICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNyYzogJ2ltZy9pY29ucy9zaG9ydGN1dC1jb25maWd1cmF0aW9uLTk2eDk2LnBuZycsXG4gICAgICAgICAgICAgICAgc2l6ZXM6ICc5Nng5NicsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1NldHRpbmdzJyxcbiAgICAgICAgICAgIHVybDogJyMvc2V0dGluZ3MnLFxuICAgICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNyYzogJ2ltZy9pY29ucy9zaG9ydGN1dC1zZXR0aW5ncy05Nng5Ni5wbmcnLFxuICAgICAgICAgICAgICAgIHNpemVzOiAnOTZ4OTYnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBkZXZPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgICAgICBuYXZpZ2F0ZUZhbGxiYWNrOiAnaW5kZXguaHRtbCdcbiAgICAgIH1cbiAgICB9KSxcbiAgICB2dWUoKSxcbiAgICB2ZXJzaW9uKCksXG4gICAgY29udGVudCgpLFxuICAgIG1vbmFjb0VkaXRvclBsdWdpbih7XG4gICAgICBsYW5ndWFnZVdvcmtlcnM6IFsnZWRpdG9yV29ya2VyU2VydmljZScsICdqc29uJywgJ2NzcyddXG4gICAgfSksXG4gICAgY2hlY2tlcih7XG4gICAgICB2dWVUc2M6IHtcbiAgICAgICAgdHNjb25maWdQYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi90c2NvbmZpZy5hcHAuanNvbicpXG4gICAgICB9XG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkdHM6IHRydWUsXG4gICAgICBkaXJzOiBbXG4gICAgICAgICdzcmMvY29tcG9uZW50cy9jb21tb24nLFxuICAgICAgICAnc3JjL2NvbXBvbmVudHMvbGF5b3V0JyxcbiAgICAgICAgJ3NyYy9jb21wb25lbnRzL3VpJ1xuICAgICAgXSxcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBWdWV0aWZ5UmVzb2x2ZXIoKVxuICAgICAgXVxuICAgIH0pXG4gIF0sXG5cbiAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgY3NzOiB7IGNoYXJzZXQ6IGZhbHNlIH0sXG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQGltcG9ydCBcIkAvc2Nzcy92YXJpYWJsZXNcIjtcXG4nXG4gICAgICB9LFxuICAgICAgc2Fzczoge1xuICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0BpbXBvcnQgXCJAL3Njc3MvdmFyaWFibGVzLnNjc3NcIlxcbidcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZW52UHJlZml4OiAnVlVFXycsXG5cbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXG4gICAgfVxuICB9LFxuXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6IFtcbiAgICAgICcuL3Rlc3RzL3VuaXQvc2V0dXAudHMnXG4gICAgXSxcbiAgICBhbGlhczogW1xuICAgICAgeyBmaW5kOiAvXnZ1ZSQvLCByZXBsYWNlbWVudDogJ3Z1ZS9kaXN0L3Z1ZS5ydW50aW1lLmNvbW1vbi5qcycgfVxuICAgIF1cbiAgfSxcblxuICBiYXNlOiAnLi8nLFxuXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwb3J0OiA4MDgwXG4gIH1cbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXHByb2plY3RcXFxcZ2VsaW9zLWZsdWlkZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccHJvamVjdFxcXFxnZWxpb3MtZmx1aWRkXFxcXHZpdGUuY29uZmlnLmluamVjdC12ZXJzaW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9wcm9qZWN0L2dlbGlvcy1mbHVpZGQvdml0ZS5jb25maWcuaW5qZWN0LXZlcnNpb24udHNcIjtpbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHZlcnNpb24gfSBmcm9tICcuL3BhY2thZ2UuanNvbidcblxuaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJ1xuXG5jb25zdCB3cml0ZVZlcnNpb25GaWxlID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCB2ZXJzaW9uRmlsZSA9IGF3YWl0IGZzLnByb21pc2VzLm9wZW4ocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QvLnZlcnNpb24nKSwgJ3cnKVxuXG4gIGF3YWl0IHZlcnNpb25GaWxlLndyaXRlRmlsZShgdiR7dmVyc2lvbn1gKVxuXG4gIGF3YWl0IHZlcnNpb25GaWxlLmNsb3NlKClcbn1cblxuY29uc3Qgd3JpdGVSZWxlYXNlSW5mb0ZpbGUgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHJlbGVhc2VJbmZvRmlsZSA9IGF3YWl0IGZzLnByb21pc2VzLm9wZW4ocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QvcmVsZWFzZV9pbmZvLmpzb24nKSwgJ3cnKVxuXG4gIGF3YWl0IHJlbGVhc2VJbmZvRmlsZS53cml0ZUZpbGUoSlNPTi5zdHJpbmdpZnkoe1xuICAgIHByb2plY3RfbmFtZTogJ2ZsdWlkZCcsXG4gICAgcHJvamVjdF9vd25lcjogJ1VzZWxlc3NKb3knLFxuICAgIHZlcnNpb246IGB2JHt2ZXJzaW9ufWBcbiAgfSkpXG5cbiAgYXdhaXQgcmVsZWFzZUluZm9GaWxlLmNsb3NlKClcbn1cblxuY29uc3Qgdml0ZVBsdWdpbkluamVjdFZlcnNpb24gPSAoKTogUGx1Z2luID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmVyc2lvbicsXG4gICAgY29uZmlnOiAoKSA9PiB7XG4gICAgICBjb25zdCBnaXRfaGFzaCA9IGNoaWxkX3Byb2Nlc3NcbiAgICAgICAgLmV4ZWNTeW5jKCdnaXQgcmV2LXBhcnNlIC0tc2hvcnQgSEVBRCcpXG4gICAgICAgIC50b1N0cmluZygpXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRlZmluZToge1xuICAgICAgICAgICdpbXBvcnQubWV0YS5lbnYuVkVSU0lPTic6IEpTT04uc3RyaW5naWZ5KHZlcnNpb24pLFxuICAgICAgICAgICdpbXBvcnQubWV0YS5lbnYuSEFTSCc6IEpTT04uc3RyaW5naWZ5KGdpdF9oYXNoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB3cml0ZUJ1bmRsZTogKCkgPT4ge1xuICAgICAgc2V0SW1tZWRpYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgd3JpdGVWZXJzaW9uRmlsZSgpXG4gICAgICAgIGF3YWl0IHdyaXRlUmVsZWFzZUluZm9GaWxlKClcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZpdGVQbHVnaW5JbmplY3RWZXJzaW9uXG4iLCAie1xuICBcIm5hbWVcIjogXCJmbHVpZGRcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC41LjBcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiZmx1aWRkLCBhIGtsaXBwZXIgd2ViIGNsaWVudC5cIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcIkNyYWlnIEJhc3NldHRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidml0ZVwiLFxuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJwcmV2aWV3XCI6IFwidml0ZSBwcmV2aWV3XCIsXG4gICAgXCJzdGFydFwiOiBcInZpdGVcIixcbiAgICBcInNlcnZlXCI6IFwidml0ZVwiLFxuICAgIFwic2VydmU6cHJvZFwiOiBcInZpdGUgcHJldmlldyAtLXBvcnQgNTAwMFwiLFxuICAgIFwic2VydmU6ZG9jc1wiOiBcImNkIC4vZG9jczsgYnVuZGxlIGV4ZWMgamVreWxsIHNlcnZlXCIsXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IC0tZXh0IC50cywuanMsLnZ1ZSAuL3NyY1wiLFxuICAgIFwiYm9vdHN0cmFwXCI6IFwiaHVza3lcIixcbiAgICBcImNvcHk6aG9zdDpjb25maWdcIjogXCJzaHggY3AgLWYgLi9zZXJ2ZXIvY29uZmlnLmpzb24gLi9kaXN0L2NvbmZpZy5qc29uXCIsXG4gICAgXCJkZXBsb3k6aG9zdFwiOiBcIm5weCAtLXllcyAtcCBAMHg0NDQ3L3BvdGF0byBwb3RhdG8gLXMgZGlzdCAtdSAtYiBhcHAuZmx1aWRkLnh5eiAtYSBcXFwiJEFXU19BQ0NFU1NfS0VZX0lEXFxcIiAtdCBcXFwiJEFXU19TRUNSRVRfQUNDRVNTX0tFWVxcXCJcIixcbiAgICBcImRlcGxveTpob3N0OmRldlwiOiBcIm5weCAtLXllcyAtcCBAMHg0NDQ3L3BvdGF0byBwb3RhdG8gLXMgZGlzdCAtdSAtYiBkZXYtYXBwLmZsdWlkZC54eXpcIixcbiAgICBcImkxOG4tZXh0cmFjdFwiOiBcInZ1ZS1pMThuLWV4dHJhY3QgdXNlLWNvbmZpZ1wiLFxuICAgIFwicmVsZWFzZVwiOiBcInN0YW5kYXJkLXZlcnNpb25cIixcbiAgICBcInJlbGVhc2U6bWFqb3JcIjogXCJucG0gcnVuIHJlbGVhc2UgLS0gLS1yZWxlYXNlLWFzIG1ham9yXCIsXG4gICAgXCJyZWxlYXNlOm1pbm9yXCI6IFwibnBtIHJ1biByZWxlYXNlIC0tIC0tcmVsZWFzZS1hcyBtaW5vclwiLFxuICAgIFwicmVsZWFzZTpwYXRjaFwiOiBcIm5wbSBydW4gcmVsZWFzZSAtLSAtLXJlbGVhc2UtYXMgcGF0Y2hcIixcbiAgICBcInJlbGVhc2U6cmNcIjogXCJucG0gcnVuIHJlbGVhc2UgLS0gLS1wcmVyZWxlYXNlIHJjXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OnVuaXRcIixcbiAgICBcInRlc3Q6dW5pdFwiOiBcInZpdGVzdCAtLWVudmlyb25tZW50IGpzZG9tXCIsXG4gICAgXCJ0eXBlLWNoZWNrXCI6IFwidnVlLXRzYyAtLW5vRW1pdCAtcCB0c2NvbmZpZy52aXRlc3QuanNvbiAtLWNvbXBvc2l0ZSBmYWxzZVwiLFxuICAgIFwiY2lyY3VsYXItY2hlY2tcIjogXCJza290dCAtLWRpc3BsYXlNb2RlPWZpbGUtdHJlZSAtLXNob3dDaXJjdWxhckRlcGVuZGVuY2llcyAtLXRzY29uZmlnPS4vdHNjb25maWcuYXBwLmpzb25cIixcbiAgICBcInRoZW1lOmNvbnZlcnRcIjogXCJjZCB0b29sczsgbm9kZSBjb252ZXJ0VGhlbWUuanNcIlxuICB9LFxuICBcIm1haW5cIjogXCJpbmRleC5qc1wiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAY3RybC90aW55Y29sb3JcIjogXCJeNC4wLjNcIixcbiAgICBcIkBmb250c291cmNlL3JhbGV3YXlcIjogXCJeNS4wLjE2XCIsXG4gICAgXCJAZm9udHNvdXJjZS9yb2JvdG9cIjogXCJeNS4wLjhcIixcbiAgICBcIkBpcm9qcy9pcm8tY29yZVwiOiBcIl4xLjIuMVwiLFxuICAgIFwiQGphYW1lcy9pcm9cIjogXCJeNS41LjJcIixcbiAgICBcImF4aW9zXCI6IFwiXjEuNi43XCIsXG4gICAgXCJjb25zb2xhXCI6IFwiXjMuMi4zXCIsXG4gICAgXCJkZWVwbWVyZ2VcIjogXCJeNC4zLjFcIixcbiAgICBcImRvbXB1cmlmeVwiOiBcIl4zLjAuOFwiLFxuICAgIFwiZWNoYXJ0c1wiOiBcIl41LjQuM1wiLFxuICAgIFwiZWNoYXJ0cy1nbFwiOiBcIl4yLjAuOVwiLFxuICAgIFwiaGxzLmpzXCI6IFwiXjEuNS4zXCIsXG4gICAgXCJqd3QtZGVjb2RlXCI6IFwiXjQuMC4wXCIsXG4gICAgXCJsb2Rhc2gtZXNcIjogXCJeNC4xNy4yMVwiLFxuICAgIFwibWFya2VkXCI6IFwiXjEyLjAuMFwiLFxuICAgIFwibWFya2VkLWJhc2UtdXJsXCI6IFwiXjEuMS4zXCIsXG4gICAgXCJtZDVcIjogXCJeMi4zLjBcIixcbiAgICBcIm1vbmFjby1lZGl0b3JcIjogXCJeMC40NS4wXCIsXG4gICAgXCJtb25hY28tZWRpdG9yLXRleHRtYXRlXCI6IFwiXjQuMC4wXCIsXG4gICAgXCJtb25hY28tdGV4dG1hdGVcIjogXCJeMy4wLjFcIixcbiAgICBcIm9uaWdhc21cIjogXCJeMi4yLjVcIixcbiAgICBcInBhbnpvb21cIjogXCJeOS40LjNcIixcbiAgICBcInFyLXNjYW5uZXJcIjogXCJeMS40LjJcIixcbiAgICBcInFyY29kZS52dWVcIjogXCJeMS43LjBcIixcbiAgICBcInNlbXZlclwiOiBcIl43LjUuNFwiLFxuICAgIFwic2hsZXhcIjogXCJeMi4xLjJcIixcbiAgICBcInNvcnRhYmxlanNcIjogXCJeMS4xNS4yXCIsXG4gICAgXCJ1dWlkXCI6IFwiXjkuMC4xXCIsXG4gICAgXCJ2dWVcIjogXCJeMi43LjE2XCIsXG4gICAgXCJ2dWUtY2xhc3MtY29tcG9uZW50XCI6IFwiXjcuMi42XCIsXG4gICAgXCJ2dWUtZWNoYXJ0c1wiOiBcIl42LjYuOFwiLFxuICAgIFwidnVlLWkxOG5cIjogXCJeOC4yOC4yXCIsXG4gICAgXCJ2dWUtaW5saW5lLXN2Z1wiOiBcIl4yLjEuM1wiLFxuICAgIFwidnVlLWpzb24tdmlld2VyXCI6IFwiXjIuMi4yMlwiLFxuICAgIFwidnVlLW1ldGFcIjogXCJeMi40LjBcIixcbiAgICBcInZ1ZS1wcm9wZXJ0eS1kZWNvcmF0b3JcIjogXCJeOS4xLjJcIixcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeMy42LjVcIixcbiAgICBcInZ1ZS12aXJ0dWFsLXNjcm9sbGVyXCI6IFwiXjEuMS4yXCIsXG4gICAgXCJ2dWUyLXRvdWNoLWV2ZW50c1wiOiBcIl4zLjIuM1wiLFxuICAgIFwidnVldGlmeVwiOiBcIl4yLjcuMVwiLFxuICAgIFwidnVldGlmeS1jb25maXJtXCI6IFwiXjIuMC42XCIsXG4gICAgXCJ2dWV4XCI6IFwiXjMuNi4yXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQG1kaS9qc1wiOiBcIl43LjQuNDdcIixcbiAgICBcIkBvcmlnaW5qcy92aXRlLXBsdWdpbi1jb250ZW50XCI6IFwiXjEuMC41XCIsXG4gICAgXCJAdHlwZXMvZG9tcHVyaWZ5XCI6IFwiXjMuMC41XCIsXG4gICAgXCJAdHlwZXMvanNkb21cIjogXCJeMjEuMS42XCIsXG4gICAgXCJAdHlwZXMvbG9kYXNoLWVzXCI6IFwiXjQuMTcuMTJcIixcbiAgICBcIkB0eXBlcy9tZDVcIjogXCJeMi4zLjVcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIwLjExLjEzXCIsXG4gICAgXCJAdHlwZXMvc2VtdmVyXCI6IFwiXjcuNS42XCIsXG4gICAgXCJAdHlwZXMvc29ydGFibGVqc1wiOiBcIl4xLjE1LjdcIixcbiAgICBcIkB0eXBlcy91dWlkXCI6IFwiXjkuMC44XCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl42LjIwLjBcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNi4yMC4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWUyXCI6IFwiXjIuMy4xXCIsXG4gICAgXCJAdnVlL2VzbGludC1jb25maWctc3RhbmRhcmRcIjogXCJeOC4wLjFcIixcbiAgICBcIkB2dWUvZXNsaW50LWNvbmZpZy10eXBlc2NyaXB0XCI6IFwiXjEyLjAuMFwiLFxuICAgIFwiQHZ1ZS90ZXN0LXV0aWxzXCI6IFwiXjEuMy42XCIsXG4gICAgXCJAdnVlL3RzY29uZmlnXCI6IFwifjAuMS4zXCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC41Ni4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjIxLjBcIixcbiAgICBcImh1c2t5XCI6IFwiXjkuMC43XCIsXG4gICAgXCJqc2RvbVwiOiBcIl4yNC4wLjBcIixcbiAgICBcIm1vY2tkYXRlXCI6IFwiXjMuMC41XCIsXG4gICAgXCJtb25hY28tdnNjb2RlLXRleHRtYXRlLXRoZW1lLWNvbnZlcnRlclwiOiBcIl4wLjEuN1wiLFxuICAgIFwicm9sbHVwXCI6IFwiXjQuOS42XCIsXG4gICAgXCJzYXNzXCI6IFwifjEuMzIuMTNcIixcbiAgICBcInNoeFwiOiBcIl4wLjMuNFwiLFxuICAgIFwic2tvdHRcIjogXCJeMC4zMi4xXCIsXG4gICAgXCJzdGFuZGFyZC12ZXJzaW9uXCI6IFwiXjkuNS4wXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMy4zXCIsXG4gICAgXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50c1wiOiBcIl4wLjI2LjBcIixcbiAgICBcInZpdGVcIjogXCJeNS4wLjEyXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1jaGVja2VyXCI6IFwiXjAuNi4zXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1tb25hY28tZWRpdG9yXCI6IFwiXjEuMS4wXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1wd2FcIjogXCJeMC4xNy41XCIsXG4gICAgXCJ2aXRlc3RcIjogXCJeMS4yLjJcIixcbiAgICBcInZ1ZS1kZWJvdW5jZS1kZWNvcmF0b3JcIjogXCJeMS4wLjFcIixcbiAgICBcInZ1ZS1pMThuLWV4dHJhY3RcIjogXCJeMi4wLjdcIixcbiAgICBcInZ1ZS10ZW1wbGF0ZS1jb21waWxlclwiOiBcIl4yLjcuMTZcIixcbiAgICBcInZ1ZS10c2NcIjogXCJeMS44LjI3XCIsXG4gICAgXCJ3b3JrYm94LWJ1aWxkXCI6IFwiXjcuMC4wXCIsXG4gICAgXCJ3b3JrYm94LWNvcmVcIjogXCJeNy4wLjBcIixcbiAgICBcIndvcmtib3gtcm91dGluZ1wiOiBcIl43LjAuMFwiLFxuICAgIFwid29ya2JveC1zdHJhdGVnaWVzXCI6IFwiXjcuMC4wXCIsXG4gICAgXCJ3b3JrYm94LXdpbmRvd1wiOiBcIl43LjAuMFwiXG4gIH0sXG4gIFwiX2lkXCI6IFwiZmx1aWRkQDAuMC4zXCIsXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vVXNlbGVzc0pveS9mbHVpZGQvaXNzdWVzXCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9Vc2VsZXNzSm95L2ZsdWlkZCNyZWFkbWVcIixcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJrbGlwcGVyXCJcbiAgXSxcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwicmVhZG1lXCI6IFwiUkVBRE1FLm1kXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL1VzZWxlc3NKb3kvZmx1aWRkLmdpdFwiXG4gIH0sXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiXjE4IHx8IF4yMFwiXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsdUJBQXVCO0FBQ2hDLE9BQU9BLFdB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T0FBTztBQUFBLGdCQUNQLE1BQU07QUFBQSxjQUNSO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsY0FDTDtBQUFBLGdCQUNFLEtBQUs7QUFBQSxnQkFDTCxPQUFPO0FBQUEsZ0JBQ1AsTUFBTTtBQUFBLGNBQ1I7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixTQUFTO0FBQUEsUUFDVCxNQUFNO0FBQUEsUUFDTixrQkFBa0I7QUFBQSxNQUNwQjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLElBQ0osbUNBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLG1CQUFtQjtBQUFBLE1BQ2pCLGlCQUFpQixDQUFDLHVCQUF1QixRQUFRLEtBQUs7QUFBQSxJQUN4RCxDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixjQUFjQyxNQUFLLFFBQVFDLG1DQUFXLHFCQUFxQjtBQUFBLE1BQzdEO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxLQUFLO0FBQUEsTUFDTCxNQUFNO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixLQUFLLEVBQUUsU0FBUyxNQUFNO0FBQUEsTUFDdEIsTUFBTTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFdBQVc7QUFBQSxFQUVYLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUtELE1BQUssUUFBUUMsbUNBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxFQUFFLE1BQU0sU0FBUyxhQUFhLGlDQUFpQztBQUFBLElBQ2pFO0FBQUEsRUFDRjtBQUFBLEVBRUEsTUFBTTtBQUFBLEVBRU4sUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiXQp9Cg==
