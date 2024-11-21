import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileReaderService {
  private folderPath = path.join(process.cwd(), 'static', 'avatars');

  getFileNames(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(this.folderPath, (err, files) => {
        if (err) {
          return reject('Error reading the directory: ' + err);
        }

        const fileNames: string[] = [];
        let processedFiles = 0;

        files.forEach((file) => {
          const filePath = path.join(this.folderPath, file);
          fs.stat(filePath, (err, stats) => {
            processedFiles++;

            if (err) {
              return reject('Error getting file stats: ' + err);
            }

            if (stats.isFile()) {
              fileNames.push(`/static/avatars/` + file);
            }

            if (processedFiles === files.length) {
              resolve(fileNames.sort());
            }
          });
        });

        if (files.length === 0) {
          resolve(fileNames);
        }
      });
    });
  }
}
