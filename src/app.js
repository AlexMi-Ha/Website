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

let posts = [];


// Routes
app.get('/', async (_,res) => {
    res.send(await renderPage('index'));
});
app.get('/about', async (_,res) => {
    res.send(await renderPage('about'));
});
app.get('/portfolio', async (_,res) => {
    res.send(await renderPage('portfolio'));
});
app.get('/contact', async (_,res) => {
    res.send(await renderPage('contact'));
});
app.get('/imprint', async (_,res) => {
    res.send(await renderPage('imprint'));
});


app.get('/posts', async (req, res) => {

});

const port = 3000;
app.listen(port, async function () {
    posts = await loadPosts();
    console.log('node app running on port ' + port);
});