const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// array
const images = [];

app.use(cookieParser());
app.use(bodyParser.json());

// Log incoming IP address of request
app.use((req, res, next) => {
    if (req.cookies) {
        console.log('Cookies: ', req.cookies)
        const myCookieAsString = req.cookies["my-cookie"];
        if (myCookieAsString) {
            const myCookieAsObject = JSON.parse(myCookieAsString);
            console.log(myCookieAsObject);
            console.log(myCookieAsObject.value);
        }
    }
    next();
});

// Log any cookies on the request
app.use((req, res, next) => {
    console.log(`Handling request from ${req.ip}...`);
    next();
});

app.get('/set-cookie', (req, res) => {
    const cookieValue = {
        value: req.query.value
    };
    const valueAsJsonString
        = JSON.stringify(cookieValue);
    res.cookie('my-cookie', valueAsJsonString);
    res.json({
        message: 'set the cookie!'
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'hello world!'
    });
});

app.get('/images', (req, res) => {
    res.json({
        images
    });
});

app.post('/images', (req, res) => {
    const data = req.body;
    const url = data.url?.trim();

    if (!url) {
        res.status(400).json({
            message: "you must provide a url"
        });
        return;
    }

    // add to the array
    images.push(url);

    // send back response with updated array
    res.json({
        images
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
