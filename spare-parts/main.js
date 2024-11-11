import express from 'express';
import { createReadStream } from 'node:fs';
import csv from 'csv-parser';

const app = express();
const port = 3000;
const readStream = createReadStream('../andmed/LE.txt');
let listOfParts = [];
const itemsPerPage = 30;

app.use(express.json());

readStream.pipe(csv({ separator: '\t'}))
    .on('data', (data) => listOfParts.push(data))
    .on('end', () => console.log("Parsing done"));

readStream.on('error', (err) => {
    console.log(`Error: ${err}`);
});

// URL example: http://localhost:3000/name/BMW raamat
app.get('/name/:name', (req, res) => {
    let nameSearch = req.params.name;
    let filteredParts = listOfParts.filter(part => part.name.trim().includes(nameSearch));

    res.send(JSON.stringify(filteredParts));
});

// URL example: http://localhost:3000/sn/99999999987
app.get('/sn/:sn', (req, res) => {
    let snSearch = req.params.sn;
    let filteredParts = listOfParts.filter(part => part.serialNumber.trim().includes(snSearch));

    res.send(JSON.stringify(filteredParts));
});

// URL example: http://localhost:3000/page/20
app.get('/page/:page', (req, res) => {
    let whichPage = req.params.page;
    let sliceStart = (whichPage - 1) * itemsPerPage;
    let sliceEnd = whichPage * itemsPerPage;
    
    res.send(listOfParts.slice(sliceStart, sliceEnd));
});

app.get('/sort/:category', (req, res) => {
    let category = req.params.category;
    let sortedParts;

    if (category.trim() === 'name') {
        sortedParts = listOfParts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (category.trim() === 'price') {
        sortedParts = listOfParts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if(category.trim() === '-name') {
        sortedParts = listOfParts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (category.trim() === '-price') {
        sortedParts = listOfParts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else {
        res.send('Invalid category');
    }

    res.send(JSON.stringify(sortedParts.slice(0, 1000)));
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});