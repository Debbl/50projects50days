const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const { parse } = require("node-html-parser");

const pagesPath = path.resolve(__dirname, "./src/pages");
const distPath = path.resolve(__dirname, "dist");
const indexPath = path.resolve(__dirname, "index.ejs");

function init() {
  // write
  copyDir(pagesPath, distPath);
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
    fs.writeFileSync(path.join(distPath, "index.html"), str);
  });
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
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
