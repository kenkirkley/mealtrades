const fs = require('fs');
const express = require('express');

const app = express();

// Middleware: adds body data to the request
app.use(express.json());

// app.get('/', (req, res) => {
//   //res.status(200).send('Hello from server');
//   res.status(200).json({ message: 'Hello from server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post here');
// });

// Read data at top level code

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// GET Requests
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    // JSend specs
    status: 'Sucess',
    results: tours.length,
    data: {
      tours
    }
  });
});

// use ? for optional parameters: /:x?
app.get('/api/v1/tours/:id', (req, res) => {
  // data stored in strings, need to convert
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (tour) {
    res.status(200).json({
      // JSend specs
      status: 'Sucess',
      data: {
        tour
      }
    });
  } else {
    res.status(404).json({ status: '404', message: 'Tour not found' });
  }
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour
        }
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
