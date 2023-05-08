import express, { Request, Response } from 'express';
import multer from 'multer';
import { saveFile, deleteFile } from './config/s3'; 

import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

routes.post('/upload', upload.single('image'), async (request: Request, response: Response) => {
    const { file } = request;

    if(file) await saveFile(file.filename);

    return response.status(201).send();
});

routes.delete('/delete/:filename', async (request: Request, response: Response) => {
    const { filename } = request.params;

    await deleteFile(filename);
    
    return response.status(204).send();
});

export { routes };