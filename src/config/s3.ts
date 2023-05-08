// import individual service
import { S3 } from 'aws-sdk';
import path from 'path';
import mime from 'mime';
import fs from 'fs';

import multerConfig from '../config/multer';

const s3: S3 = new S3({
    region: process.env.AWS_DEFAULT_REGION
}); 

export async function saveFile(filename: string){
    const originalPath = path.resolve(multerConfig.directory, filename);

    const contentType = mime.getType(originalPath);

    if(!contentType){
        throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    s3.putObject({
        Bucket: 'nodeaws-s3',
        Key: filename,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
    })
    .promise();

    await fs.promises.unlink(originalPath);
}

export async function deleteFile(filename: string){
    await s3.deleteObject({
        Bucket: 'nodeaws-s3',
        Key: filename
    })
    .promise();
} 


