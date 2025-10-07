import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [
    vitePreprocess(),
    /** @type {any} */ (mdsvex)({
      extensions: [".md"],
      smartypants: false,
      highlight: async (code, lang) => {
        const { createHighlighter } = await import("shiki");
        const hl = await createHighlighter({
          themes: ["github-dark"],
          langs: [
            "javascript",
            "typescript",
            "svelte",
            "bash",
            "json",
            "markdown",
            "html",
            "css",
          ],
        });
        return hl.codeToHtml(code, { lang, theme: "github-dark" });
      },
    }),
  ],

  kit: {
    adapter: adapter(),
  },
  compilerOptions: {
    runes: true,
  },
};

export default config;
