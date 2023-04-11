const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const { parse } = require("node-html-parser");
const { minify } = require("html-minifier-terser");
const { rimrafSync } = require("rimraf");

const pagesPath = path.resolve(__dirname, "./src/pages");
const distPath = path.resolve(__dirname, "dist");
const publicPath = path.relative(__dirname, "public");
const indexPath = path.resolve(publicPath, "index.ejs");

function init() {
  // delete dist
  rimrafSync(distPath);
  // write
  copyDir(pagesPath, distPath);
  copyDir(publicPath, distPath);
  // generate index.html
  const projectNames = fs.readdirSync(pagesPath);
  const projectsInfo = projectNames.map((p) => {
    const root = parse(
      fs.readFileSync(path.join(pagesPath, p, "index.html")).toString("utf-8")
    );
    return {
      path: p,
      title: root.querySelector("title").textContent,
    };
  });

  ejs.renderFile(indexPath, { projectsInfo }, {}, (err, str) => {
    minify(str, {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
    }).then((s) => {
      fs.writeFileSync(path.join(distPath, "index.html"), s);
    });
  });
}

// utils
function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    const basename = path.basename(src);
    if (basename === "index.ejs" || basename.startsWith(".")) return;
    fs.copyFileSync(src, dest);
  }
}
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

init();
