import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import * as esbuild from "esbuild";

const srcDir = path.join(__dirname, "../src");

let previousResult: esbuild.BuildResult | null = null;
const rebuild = (): Promise<esbuild.BuildResult> =>
  (
    previousResult?.rebuild?.() ??
    esbuild.build({
      entryPoints: [path.join(srcDir, "index.ts")],
      write: false,
      outfile: "/dist/bundle.js",
      incremental: true,
      bundle: true,
      format: "iife",
    })
  )
    .then((r) => (previousResult = r))
    .catch((err) => {
      previousResult = null;
      return err;
    });

export const dev = async () => {
  const server = http.createServer(async (req, res) => {
    try {
      let { pathname } = new URL(req.url!, "http://a");

      if (pathname! === "/") {
        const filePath = path.resolve(__dirname, "../src/index.html");
        res.end(fs.readFileSync(filePath));
      } else {
        const { outputFiles } = await rebuild();

        const file = outputFiles!.find((f) => f.path === pathname);

        if (!file) throw new Error("404");

        res.end(file.text);
      }
    } catch (error: any) {
      if (error.code === "ENOENT" || error.message === "404")
        res.writeHead(404);
      else res.writeHead(500);
      res.end(error.message);
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => console.log(`http://localhost:3000`));
};
