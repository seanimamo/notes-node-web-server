const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
var app = express();

//this tells hbs where to look to find our partial template files such as the header and footer
hbs.registerPartials(__dirname + '/views/partials');

//this sets our view engine to whatever we want, we use hbs in this project(handlebars)
app.set('view engine','hbs');

//this is a method to create helper functions that can be universally called within hbs files
hbs.registerHelper('getCurrentYear', () =>{
    return new Date().getFullYear();
});
hbs.registerHelper('capitalizeString', (text) =>{
    return text.toUpperCase();
});


// example of us creating our own custom middleware, note that app.use()
// only takes one arguement which is a function. the 'next' variable included
// in our arrow function arguement is important because it tells express when we are done using our middleware 
// function and that we can move out our next piece of middleware, if there is any at all.
// This middle function we created uses the built in file io 'fs' to log data about all requests being made to the server.log file
app.use((req,res,next)=>{
    var currentDate = new Date().toString();
    var log = `${currentDate}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('Server.log', log + '\n', (err) =>{
        if(err){console.log("Unable to append to server.log");}
    });
    next();
});

// this is a middleware function we have created to intercept all routes and 
// render the maintenanche.hbs file instead  wahtever the route originally was supposed to do.
// We do not use next() here since we dont want it to move onto the next piece of middleware
// notice that we only redirect to ma'maintenance.hbs' and stay there if our const variable maintenanceMode is set equal to true
const maintenanceMode = false;
app.use((req,res,next)=>{
    if(maintenanceMode == true){
        res.render('maintenance.hbs');
    } else{
        next();
    }
});

//**NOTE  we define static filepaths AFTER creating middleware to ensure our middleware applies to the filepaths.
// app.use can be used to define static file directories in our express nodejs application
// express.static() takes the absolute filepath (so if its a local web server, its the full harddrive path)
// Note that '__dirname' is the built in variable created by nodejs that includes the path to our project directory.
// all we have to do is concatenate /public to specify where to go once in our project folder.
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) =>{
    //example of just sending some simple html as the response to this route
    //res.send('<h1>The Forge company providing next generation web applications and websites. </h1>');
    
    //an example showing we can return JSON.
    // res.send({
    //   name:'Sean',
    //   likes : [
    //       'coding',
    //       'sweg',
    //       'food'
    //   ]
    // })


    res.render('home.hbs',{
        pageTitle: 'Home Page',
        welcomeMessage: "Welcome to The Forge"
    });
});



app.get('/about', (req,res) =>{
    //example of just sending some simple html as the response to this route
    //res.send('<h1>The Forge company providing next generation web applications and websites. </h1>');
    
    //example of sending a handlebars html page we created and sending in an object with some data.
    res.render('about.hbs',{
        pageTitle: 'About page',
        welcomeMessage: 'Some Text here'
    });
});

app.get('/bad', (req,res) =>{
    res.send({
      errorMessage : 'Error handling this request'
    })
    
});

//this binds the application to a port on our machine.
//this also takes another optional arguement in the form of a function where we can do whatever we want.
app.listen(3000, () =>{
    console.log(`Server is up and running on port 3000`);
});

