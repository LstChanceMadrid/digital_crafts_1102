
const express = require('express');
const app = express();
const port = 3000;
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sess = {
    secret: 'cat',
    resave: false,
    saveUninitialized: false
  };
const router = express.Router();

let items = [];

let appleItems = [
    {
        name : 'Apple Watch',
        manufacturer : 'Apple',
        price : 5,
        image : 'https://www.apple.com//v/home/dy/images/heroes/apple-watch-series-4/apple_watch_series_4_4aeff_mediumtall.jpg'
    },
    {
        name : 'Mac mini',
        manufacturer : 'Apple',
        price : 10,
        image : 'https://www.apple.com/v/home/dy/images/promos/mac-mini/mac_mini__c1035c715c_medium.jpg'
    },
    {
        name : 'AirPods',
        manufacturer : 'Apple',
        price : 15,
        image : 'https://www.apple.com/v/home/dy/images/promos/airpods/airpods_ad44c_medium.jpg'
    }
];

let googleItems = [
    {
        name : 'Google Daydream View',
        manufacturer : 'Google',
        price : 5,
        image : 'https://lh3.googleusercontent.com/NfnNAzvOvDJchJ4aVfmdCiyOlqJyQfayzj4sQOqjNMQHV9NMBiChaLSF-IgH3nAtJncA4wwv68WUcqpBqRc5=rw-v1-w975'
    },
    {
        name : 'Google Home Mini',
        manufacturer : 'Google',
        price : 10,
        image : 'https://lh3.googleusercontent.com/SZjLgSsQxNH9Yyr1r5SWs31ksI2Zgn7Lr5BNwAlk7_1s5OaqzFOVyyBaoZqmcambg3iP4fIhdzEULKaeaFDC=rw-v1-w750'
    },
    {
        name : 'Pixel Slate Keyboard',
        manufacturer : 'Google',
        price : 15,
        image : 'https://lh3.googleusercontent.com/aky4BgrOG9XniEyT2jQW_OxHf__BvHiVvTY-YnRmTx3991UTUT_ICuf9VWZtUk8es2T4aryl_GsRmCMUAtI=rw-w900'
    }
];

let samsungItems = [
    {
        name : 'Galaxy Note9',
        manufacturer : 'Samsung',
        price : 5,
        image : 'https://s7d2.scene7.com/is/image/SamsungUS/001-MidnightBlack-92618?$product-card-small-jpg$'
    },
    {
        name : 'Galaxy Home',
        manufacturer : 'Samsung',
        price : 10,
        image : 'https://s7d2.scene7.com/is/image/SamsungUS/03-SurroundYourself-Mobile?$cm-g-fb-full-bleed-img-mobile-jpg$'
    },
    {
        name : 'The Frame',
        manufacturer : 'Samsung',
        price : 15,
        image : 'https://s7d2.scene7.com/is/image/SamsungUS/MB-FRAME-Highlight-9d-062618?$flagship-lineup-png$'
    }
];

let users = [
    {username: 'steve', password: 'password'},
    {username: 'bob', password: 'password'}
];

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', './views');

app.use('/css', express.static('css'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sess));
app.use('/', router);

// Original website page
app.get('/', (req, res) => {

    res.render('index', {googleItems : googleItems, appleItems : appleItems, samsungItems : samsungItems})
});

// Register/Login page
app.get('/credentials', (req, res) => { 
    res.render('credentials');
});






// makes sure a user is logged in before every page
const authenticateUser = (req, res, next) => {
    console.log('Authorized User');

    if (req.session.username) {
        next();
    } else {
        res.redirect('credentials');
    }
};

app.all('/user/*', authenticateUser, (req, res, next) => {
    next();
});

app.post('/register', (req, res) => {

    let username = req.body.registerUsername;
    let password = req.body.registerPassword;

    let user = {
        username: username,
        password: password
    };

    if (username != '' && password != '') {
        users.push(user);
        res.redirect('/user/home');
    } else {
        res.redirect('/credentials');
    }
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let user = users.find(user => {
        return user.username === username && user.password === password;
    });

    if (user != null) {
        
        if(req.session) {
            req.session.username = username;
            res.redirect('/user/home');
        }
    } else {
        res.redirect('/credentials');
    }
});

app.get('/user/home', (req, res) => {
    let username = req.session.username;

    res.render('home', {username : username});
})










app.get('/user/apple', (req, res) => {
    let username = req.session.username;

    res.render('apple', {username : username, appleItems : appleItems});
})

app.get('/user/google', (req, res) => {
    let username = req.session.username;

    res.render('google', {username : username, googleItems : googleItems});
})

app.get('/user/samsung', (req, res) => {
    let username = req.session.username;

    res.render('samsung', {username : username, samsungItems : samsungItems});
})












app.post('/user/add-item', (req, res) => {
    console.log(Object.keys(appleItems))
    let name = req.body.name;
    let manufacturer = req.body.manufacturer;
    let price = req.body.price;
    let image = req.body.image;

    console.log(items)

    let item = {
        name : name,
        manufacturer : manufacturer,
        price : price,
        image : image
    };

    items.push(item);

    res.redirect('/user/shopping-cart');
});















app.get('/user/shopping-cart', (req, res) => { 
    let username = req.session.username;
    

    res.render('shopping-cart', {username: username, items : items});
});





app.post('/user/remove-item', (req, res) => {
    let name = req.body.itemName;
    
    items = items.filter(item => {
        return item.name != name;
    });

    res.redirect('shopping-cart');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))