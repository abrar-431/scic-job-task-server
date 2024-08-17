const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.get('/', async (req, res) => {
    res.send('Mega Buyz Server running');
})

app.listen(port, () => {
    console.log('Mega Buyz running on port,', port);
})