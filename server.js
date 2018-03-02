//handlebarjs.js handles express templates. Andrew says 'Think of handlebars as the core building block that can be used in all sort of environments. '
//hbs package is express.js template engine plugin for Handlebars, Andrew says "hbs is nothing more than an express wrapper for handlebars"

const express = require('express');
const hbs = require('hbs'); 
const fs = require('fs');

var PORT = process.env.PORT || 3000;

hbs.registerPartials(__dirname + '/views/partials'); //adding partials into the app

var app = express();

app.set('view engine', 'hbs'); //This line is optional as long as you provide the .hbs file extension in your call to res.render . Express will use that extension to properly render the handlebars template. All of our res.render  calls have this, so everything works without a view engine set.
/*

The "views" folder is the default location. You can override this using a call to app.set like we use to set the view engine:
app.set('views', './other-folder') or app.set('views', path.join(__dirname, 'views'));
*/

// app.use((req, res, next) => { //this middleware won't let other pages to render
//     res.render('maintain.hbs');
// });

app.use(express.static(__dirname + '/public')); //when you want to register middlewares app.use()

//keep track of how our server is working 
app.use((req, res, next) => { //next()
    var now = new Date().toString(); //toString() makes it human readable
    var log = `${now}: ${req.method} ${req.url}`; //req.method -> GET , req.url -> 
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable')
        }
    });
    next(); //keep the program to continue run
});


hbs.registerHelper('getCurrentYear', () => { //first argument is name of the helper fn, second arg is fn
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1> hello express </h1>');

    // res.send({
    //     name: 'Andrew',
    //     likes: ["biking", "hiking"] //express is smart that {}  => JSON
    //  });

    res.render('home.hbs', { //render let you render any template set up in your view engine
        pageTitle: 'Home Page', //second argument is a {} that sends dynamic data to views/home.hbs
        welcomeMsg: 'Welcome to my first node page',
        // currentYear: new Date().getFullYear() <- because of line 25 removed
    });
});

app.get('/about', (req, res) => {
    // res.send('About page');
    res.render('about.hbs', { 
        pageTitle: "About Page",
        // currentYear: new Date().getFullYear()

    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Not found'
    });
});


app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});