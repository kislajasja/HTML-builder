const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const CSS_EXT = '.css';
const assetsPath = path.join(__dirname, 'assets');
const stylePath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');
const tmplFile = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const htmlFilePath = path.join(distPath, 'index.html');
const distAssetsPath = path.join(distPath, 'assets');

const copyDir = async (source, dest) => {
  await fsPromises.rm(dest, { force: true, recursive: true });
  await fsPromises.mkdir(dest, { recursive: true });

  const files = await fsPromises.readdir(source, { withFileTypes: true });

  files.forEach((item) => {
    const sourcePath = path.join(source, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      copyDir(sourcePath, destPath);
    } else {
      fsPromises.copyFile(sourcePath, destPath);
    }
  });
};

const createCssBundle = async (source, dest) => {
  const ws = fs.createWriteStream(path.join(dest, 'style.css'), { flags: 'a' });
  const files = await fsPromises.readdir(source, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const filePath = `${source}/${file.name}`;
      const extname = path.extname(filePath);

      if (extname === CSS_EXT) {
        ws.write((await fsPromises.readFile(filePath)) + '\n');
      }
    }
  });
};

const createHtml = async (tmplFilePath, source, dest) => {
  const rs = fs.createReadStream(tmplFilePath, 'utf-8');
  const ws = fs.createWriteStream(dest);
  let html = '';

  rs.on('data', (chunk) => (html += chunk));

  rs.on('end', async () => {
    const matches = [...html.matchAll(/{{(.*)}}/g)];

    for (let [tag, name] of matches) {
      const filePath = path.join(source, `${name}.html`);
      const content = await fsPromises.readFile(filePath);

      html = html.replace(tag, content);
    }

    ws.write(html);
  });
};

const buildProject = async () => {
  await fsPromises.rm(distPath, { force: true, recursive: true });
  await fsPromises.mkdir(distPath, { recursive: true });

  await copyDir(assetsPath, distAssetsPath);
  await createCssBundle(stylePath, distPath);
  await createHtml(tmplFile, componentsPath, htmlFilePath);
};

buildProject();
