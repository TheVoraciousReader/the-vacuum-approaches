import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";

function normalizeSiteUrl(raw: string | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, "");
}

function seoPlugin(mode: string, env: Record<string, string>): Plugin {
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL ?? env.SITE_URL);
  const title = env.SITE_TITLE ?? "The Vacuum Approaches";
  const description =
    env.SITE_DESCRIPTION ??
    "You are the dog. The vacuum lives here too. Wander a tiny house, pick a verb, and chase an ending — or get eaten.";
  const routes = ["/"];
  if (!siteUrl) console.warn("[seo] SITE_URL empty — skip absolute URLs");

  return {
    name: "seo-meta",
    transformIndexHtml(html) {
      let out = html
        .replaceAll("%SITE_TITLE%", title)
        .replaceAll("%SITE_DESCRIPTION%", description);
      const strip = (flag: "absolute" | "relative") =>
        out.replace(
          new RegExp(`^[ \\t]*<[^>\\n]*data-seo-${flag}[^>\\n]*>[ \\t]*\\r?\\n?`, "gm"),
          "",
        );
      if (siteUrl) {
        out = strip("relative").replaceAll("%SITE_URL%", siteUrl);
      } else {
        out = strip("absolute").replaceAll("%SITE_URL%", "");
      }
      return out.replace(/ data-seo-(?:absolute|relative)/g, "");
    },
    closeBundle() {
      if (mode !== "production") return;
      if (!siteUrl) {
        throw new Error(
          "SITE_URL empty — set VITE_SITE_URL=https://your-host.example (see .env.example)",
        );
      }
      const out = path.resolve("dist");
      fs.writeFileSync(
        path.join(out, "robots.txt"),
        `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      );
      const urls = routes
        .map((r) => `  <url><loc>${siteUrl}${r === "/" ? "/" : r}</loc></url>`)
        .join("\n");
      fs.writeFileSync(
        path.join(out, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [seoPlugin(mode, env)],
    server: {
      // KAPLAY game state breaks under HMR.
      hmr: false,
    },
    build: {
      assetsInlineLimit: 0,
    },
  };
});
