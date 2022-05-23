const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = async (src, dst) => {
  const srcPath = path.join(__dirname, src);
  const dstPath = path.join(__dirname, dst);

  await fsPromises.mkdir(dstPath, { recursive: true });

  const files = await fsPromises.readdir(srcPath);
  const dstFiles = await fsPromises.readdir(dstPath);

  await dstFiles.map((file) => fsPromises.unlink(`${dstPath}/${file}`));

  files.forEach((file) => {
    fsPromises.copyFile(path.join(srcPath, file), path.join(dstPath, file));
  });
};

copyDir('files', 'files-copy');
