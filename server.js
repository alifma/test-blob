const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

const app = express();

app.use(serveStatic(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
