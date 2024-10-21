const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:5000', 'https://13.127.13.10:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

module.exports = cors(corsOptions);
