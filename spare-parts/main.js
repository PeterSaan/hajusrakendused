import express from 'express';
import { createReadStream } from 'node:fs';
import csv from 'csv-parser';

const app = express();
const port = 3000;
const readStream = createReadStream('../andmed/LE.txt');
let arr = [];

readStream.pipe(csv({ separator: '\t'}))
    .on('data', (data) => arr.push(data))
    .on('end', () => console.log(arr));

readStream.on('error', (err) => {
    console.log(`Error: ${err}`);
});

app.get('/', (req, res) => {
  
});

app.listen(port, () => {
  console.log(`App working on port http://localhost:${port}`);
});