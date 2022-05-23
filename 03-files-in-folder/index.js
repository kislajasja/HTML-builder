const fsPromises = require('fs/promises');
const path = require('path');

const folder = path.join(__dirname, 'secret-folder');

const getFilesData = async () => {
  const files = await fsPromises.readdir(folder, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const filePath = `${folder}/${file.name}`;
      const extname = path.extname(filePath);
      const name = file.name.replace(extname, '');
      const { size } = await fsPromises.stat(filePath);

      console.log(`${name}-${extname.slice(1)}-${size}b`);
    }
  });
};

getFilesData();
