const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const CSS_EXT = '.css';
const folder = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

const getBundle = async () => {
  const ws = fs.createWriteStream(bundleFile, { flags: 'a' });
  const files = await fsPromises.readdir(folder, { withFileTypes: true });

  await fsPromises.truncate(bundleFile);

  files.forEach(async (file) => {
    if (file.isFile()) {
      const filePath = `${folder}/${file.name}`;
      const extname = path.extname(filePath);

      if (extname === CSS_EXT) {
        ws.write((await fsPromises.readFile(filePath)) + '\n');
      }
    }
  });
};

getBundle();
