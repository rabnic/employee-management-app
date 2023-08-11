const express = require('express')
const app = express()

app.use(logger);

app.get('/', (req, res) => {
    res.send('Welcome to HomePage')
});

app.get('/users', auth,(req, res) => {
    res.send('Welcome to Users')
});

function logger(req, res, next ) {
    console.log('Loggging');
    next()
}

function auth(req, res, next) {
    console.log(req.originalUrl);
    if (req.query.admin === 'true') {
        next()
    } else {
        res.send('No Authentication')
    }
}

app.listen(3000)