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

const getAllTours = (req, res) => {
  res.status(200).json({
    // JSend specs
    status: 'Sucess',
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated Tour Here...'
    }
  });
};

const deleteTour = (req, res) => {
  console.log(req);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};
// GET Requests
app.get('/api/v1/tours', getAllTours);

// use ? for optional parameters: /:x?
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours:id', updateTour);
app.delete('/api/v1/tours:id?', deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
