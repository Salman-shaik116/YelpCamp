const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));








// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// A simple route


app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});
app.get('/services', (req, res) => {
    res.render('services', { title: 'Services' });
});
app.get('/portfolio', (req, res) => {
    res.render('portfolio', { title: 'Portfolio' });
});
//  Start the server


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

//  Export the app  

module.exports = app;