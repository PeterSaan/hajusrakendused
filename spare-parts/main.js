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

// URL example: https://localhost:3000/spare-parts/name/BMW raamat
app.get('/spare-parts/name/:name', (req, res) => {
    const nameSearch = req.params.name;
    const filteredParts = listOfParts.filter(part => part.name.trim().includes(nameSearch));

    res.send(JSON.stringify(filteredParts));
});

// URL example: https://localhost:3000/spare-parts/sn/99999999987
app.get('/spare-parts/sn/:sn', (req, res) => {
    const snSearch = req.params.sn;
    const filteredParts = listOfParts.filter(part => part.serialNumber.trim().includes(snSearch));

    res.send(JSON.stringify(filteredParts));
});

app.get('/spare-parts/page/:page', (req, res) => {
    let whichPage = req.params.page;
    let sliceStart = (whichPage - 1) * itemsPerPage;
    let sliceEnd = whichPage * itemsPerPage;
    
    res.send(listOfParts.slice(sliceStart, sliceEnd));
});

app.get('/spare-parts/sort/:category', (req, res) => {
    let category = req.params.category;
    let sortedParts;

    if (category === 'name') {
        sortedParts = listOfParts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (category === 'sn') {
        sortedParts = listOfParts.sort((a, b) => a.serialNumber.localeCompare(b.serialNumber));
    } else if (category === 'price') {
        sortedParts = listOfParts.sort((a, b) => a.price - b.price);
    } else if(category === '-name') {
        sortedParts = listOfParts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (category === '-sn') {
        sortedParts = listOfParts.sort((a, b) => b.serialNumber.localeCompare(a.serialNumber));
    } else if (category === '-price') {
        sortedParts = listOfParts.sort((a, b) => b.price - a.price);
    } else {
        res.send('Invalid category');
    }

    res.send(JSON.stringify(sortedParts.slice(19000, 19100)));
})

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});