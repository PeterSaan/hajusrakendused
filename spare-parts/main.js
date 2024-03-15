import express from 'express';
import { createReadStream } from 'node:fs';
import csv from 'csv-parser';

const app = express();
const port = 3000;
const readStream = createReadStream('../andmed/LE.txt');
let parts = [];
const startPage = 1;
const itemsPerPage = 30;
let idSearch;
let nameSearch;

readStream.pipe(csv({ separator: '\t'}))
    .on('data', (data) => parts.push(data))
    .on('end', () => console.log("Parsing done"));

readStream.on('error', (err) => {
    console.log(`Error: ${err}`);
});

app.get('/', (req, res) => {
    idSearch = req.query.id;
    nameSearch = req.query.search;
    
    res.send(`
    <form>
        <label for="search">Search by name:</label><br>
        <input type="text" id="search" name="search"><br>
        <label for="id">Serial number:</label><br>
        <input type="text" id="id" name="id"><br><br>
        <button type="submit">Submit</button>
    </form>
    `);

    parts.filter((e) => {
       e.name.trim().toUpperCase();
       e.serialNumber.trim().toUpperCase();
       
    });
});

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});