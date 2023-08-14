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

app.use(morgan('common'));
app.use(express.static('public'))

// Read data
async function fetchData(req, res, next) {
    try {
        const employeeRef = db.collection('employees');
        const response = await employeeRef.get();
        const responseData = []
        response.forEach((employee) => {
            responseData.push({...employee.data(), id:employee.id});
        })
        console.log(responseData);
        req.body.employees = responseData;
        next();
    } catch (error) {
        console.log(error.message);
        next();
    }
}

app.get('/employees', fetchData, (req, res) => {
    res.render('index', {employees: req.body.employees, title:'Home'});
})

app.post('/employees', async (req, res) => {
    console.log('adding employee');
    try {
        const employee = {
            fullName: req.body.fullName,
            idNumber: req.body.idNumber,
            email: req.body.email,
            position: req.body.position,
            phoneNumber: req.body.phoneNumber,
            picture: "No picture",
        }
        const response = await db.collection('employees').add(employee);
        // res.send(response)
        res.redirect('/employees')
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// Delete the post
app.delete('/employees/:id', async(req, res) => {
    console.log('trying to delete employee');
    try {
        const response = await db.collection('employees').doc(req.params.id).delete();
        console.log('Delete successful');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

app.get('/about', (req, res) => {
    res.render('about', {title:'About'});
})

app.get('/add', (req, res) => {
    res.render('add', {title:'Add'});
})

// Read data
async function fetchEmployee(req, res, next) {
    try {
        const response = await db.collection('employees').doc(req.params.id).get();
        const employee = {...response.data(), id: response.id}
        console.log(response);
        req.body.employee = employee;
        next();
    } catch (error) {
        console.log(error.message);
        next();
    }
}

app.get('/edit/:id',fetchEmployee, (req, res) => {
    // res.send(req.body.employee);
    res.render('add', {title:'Edit', employee: req.body.employee});
})

app.get('/edit', (req, res) => {
    res.render('add', {title:'Edit', employee: req.body.employee});
})



app.use((req, res) => {
    res.status(200).render('404', {title:'Not Found'});
})