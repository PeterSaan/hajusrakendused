import express from 'express';
import { createReadStream } from 'node:fs';
import csv from 'csv-parser';

const app = express();
const port = 3000;
const readStream = createReadStream('../andmed/LE.txt');
let listOfParts = [];
let currentPage = 1;
const itemsPerPage = 30;
let idSearch;
let nameSearch;

app.use(express.json({ strict: false }));

readStream.pipe(csv({ separator: '\t'}))
    .on('data', (data) => listOfParts.push(data))
    .on('end', () => console.log("Parsing done"));

readStream.on('error', (err) => {
    console.log(`Error: ${err}`);
});

app.get('/spare-parts/:name', (req, res) => {
    nameSearch = req.params.name;
    idSearch = req.params.id;

    // if (nameSearch) {
    //     res.write(listOfParts.filter(part => part.name.includes(nameSearch)));
    // } else if (idSearch) {
    //     res.write(listOfParts.filter(part => part.serialNumber.includes(idSearch)));
    // } else if (nameSearch && idSearch) {
    //     res.write(listOfParts.filter(part => part.name.includes(nameSearch) && part.serialNumber.includes(idSearch)));
    // } else {
    //     See pole päris õige, aga siit saad idee
    //     res.write(listOfParts.slice(startPage, itemsPerPage));
    // }
    
    res.write(listOfParts.filter(part => part.name.includes(nameSearch)))

    console.log(nameSearch);
    console.log(idSearch);

    res.end();
});

app.get('/result', (req, res) => {

});

app.get('/spare-parts', (req, res) => {
    res.send(listOfParts.slice(0, 10));
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});