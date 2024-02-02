import axios from 'axios';
import express from 'express';

const app = express();
const port = 3000;
const fullPath = 'C:/Users/peter.saan/Desktop/hajusrakendused/';

axios.get('http://localhost:3000/lecsvvinkavonkamamama')
    .then(res => {
        let entireData = [];
        entireData.push(res.data);

        entireData.filter(a => {
            if(a == "") {
                a.splice(1, 1);
            }
        });

        console.log(entireData);
    });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/lecsvvinkavonkamamama', (req, res) => {
    res.sendFile(`${fullPath}andmed/LE.csv`);
});

app.listen(port, () => {
  console.log(`App working on port http://localhost:${port}`);
});