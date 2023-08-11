const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {
    console.log(req.query);
    res.send('List of users')
})
router.post('/', (req, res) => {
    const isValid = false;
    if (isValid) {
        users.push({name: req.body.firstName, email: 'email@example.com'});
        res.redirect(`/users/${users.length - 1}`);
    } else {
        console.log('error', req.body.firstName);
        res.render('users/new', {firstName: req.body.firstName})
    }
    // console.log(req.body.firstName);
    // res.send('Create user')
})
router.get('/new', (req, res) => {
    res.render('users/new', {firstName: "John Doe"});
})
router.get('/update', (req, res) => {
    res.send('User Update Form');
})
router.get('/:id', (req, res) => {
    res.send(`${req.user.name} Logged in with email ${req.user.email}`);
    console.log(`${req.user.name} Logged in with email ${req.user.email}`);
})

const users = [{name:"Nicholas Rabalao", email:"erabalao@gmail.com"},{name:"Siya Kolisi", email:"kolisi@gmail.com"}]

router.param('id', (req, res, next, id) => {
    req.user = users[id];
    next();
})

module.exports = router