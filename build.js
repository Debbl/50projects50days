const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

const pagesPath = path.resolve(__dirname, "./src/pages");
const distPath = path.resolve(__dirname, "dist");
const indexPath = path.resolve(__dirname, "index.ejs");

function init() {
  // write
  copyDir(pagesPath, distPath);
  // generate index.html
  const projectNames = fs.readdirSync(pagesPath);
  ejs.renderFile(indexPath, { names: projectNames }, {}, (err, str) => {
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
