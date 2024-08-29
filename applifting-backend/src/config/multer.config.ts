import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: path.resolve(__dirname, '../../uploads'),
    filename: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const filename = `${uuidv4()}${fileExtension}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file limit
  },
};
