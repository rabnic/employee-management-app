const express = require('express')
const app = express();
const morgan = require('morgan')

app.listen(3000);

app.set('view engine', 'ejs');
app.set('views');

const admin = require('firebase-admin')
const credentials = require('./key.json')

// Initialize admin
admin.initializeApp({
    credential: admin.credential.cert(credentials),
})

const db = admin.firestore();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const students = [
    {
        name:'Nicholas',
        surname:'Rabalao',
        age:30,
    },
    {
        name:'Vukona',
        surname:'Mnisi',
        age:31,
    },
    {
        name:'Loy',
        surname:'Nethutshelo',
        age:28,
    },
];

// Middleware 
// app.use((req, res, next) => {
//     console.log(`Hostname: ${req.hostname}`);
//     console.log(`URL: ${req.path}`);
//     console.log(`Method: ${req.method}`);
//     next(); 
// })
app.use(morgan('common'));
app.use(express.static('public'))

// Read data
async function fetchData(req, res, next) {
    try {
        const jobRef = db.collection('jobs');
        const response = await jobRef.get();
        const responseData = []
        response.forEach((job) => {
            responseData.push({...job.data(), id:job.id});
        })
        console.log(responseData);
        req.body.jobs = responseData;
        next();
    } catch (error) {
        console.log(error.message);
        next();
    }
}

app.get('/', fetchData, (req, res) => {
    // res.sendFile('./views/index.html', {root:__dirname});
    res.send(req.body.jobs);
    res.render('index', {jobs: req.body.jobs, title:'Home'});
})

app.get('/about', (req, res) => {
    res.render('about', {title:'About'});
})

app.get('/add', (req, res) => {
    res.render('add', {title:'Add'});
})
app.post('/add', async (req, res) => {
    console.log('creating post');
    try {
        const job = {
            title: req.body.title,
            companyName: req.body.companyName,
            location: req.body.location,
            description: req.body.description,
            time: admin.firestore.Timestamp.now(),
        }
        const response = await db.collection('jobs').add(job);
        res.send(response)
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// Delete the post
app.delete('/delete/:id', async(req, res) => {
    try {
        const response = await db.collection('jobs').doc(req.params.id).delete();
        console.log('Delete successful');
        res.send(response)
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

app.use((req, res) => {
    res.status(200).render('404', {title:'Not Found'});
})