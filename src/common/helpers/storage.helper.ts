import { diskStorage } from 'multer';
import fs from 'fs';
import path from 'path';
import { makeId } from './string.helper';

export const logoStorage = diskStorage({
  destination(req, file, callback) {
    const logoPath = path.join(__dirname, '../../public/logo');
    if (!fs.existsSync(logoPath)) {
      fs.mkdirSync(logoPath, { recursive: true });
    }
    callback(null, logoPath);
  },
  filename(req, file, callback) {
    const uniqueName = makeId(10);
    callback(null, uniqueName + '.' + file.originalname?.replace(/^.*\./, ''));
  },
});
