const express = require('express');
const app = express();
const path = require('path');
const renderPage = require('./renderer').renderPage

// Static Files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/img', express.static(path.join(__dirname, '../public/img')));
app.use('/fonts', express.static(path.join(__dirname, '../public/img')));

app.set('view engine', 'ejs');


// Routes
app.use('/', async (_,res) => {
    res.send(await renderPage('index'));
});
app.use('/about', async (_,res) => {
    res.send(await renderPage('about'));
});
app.use('/portfolio', async (_,res) => {
    res.send(await renderPage('portfolio'));
});
app.use('/contact', async (_,res) => {
    res.send(await renderPage('contact'));
});
app.use('/imprint', async (_,res) => {
    res.send(await renderPage('imprint'));
});

const port = 3000;
app.listen(port, function () {
  console.log('node app running on port ' + port);
});