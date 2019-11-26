const express = require('express');

const app = express();

app.patch('/api/v1/tours:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
