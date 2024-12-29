const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const {connectDB} = require("./db");

connectDB();
dotenv.config();

const app = express();
const port = 3001;

const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', userRoutes);
// app.use('/api/files', postRoutes);
app.use('/api/posts', postRoutes); 

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});