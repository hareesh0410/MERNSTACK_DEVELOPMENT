const express  = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const app = express();

// connect Database

connectDB();

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('API Running'));

//define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`server started on port  ${PORT}`));

