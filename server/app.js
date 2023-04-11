const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const rankedGame = require('./rankedGame/rankedGame');
app.use('/api', require('./routes'));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});