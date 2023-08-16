const express = require('express')
// const morgan = require('morgan')
const fs = require('fs')
const multer = require('multer')
const path = require('path');

const upload = multer({ dest: 'uploads/' }).single('picture');

const admin = require('firebase-admin')
const credentials = require('./key.json')

const dir = __dirname
const app = express();

app.use(express.static(path.join(dir, 'public')));
app.set('view engine', 'ejs');
app.set('views');

// Initialize admin
admin.initializeApp({
    credential: admin.credential.cert(credentials),
    storageBucket: 'job-site-35d8d.appspot.com'
})

const db = admin.firestore();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Render add employee page with form
app.get('/add', (req, res) => {
    res.render('add', { title: 'Add' });
})

// Update employee 
app.post('/employees/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { fullName, idNumber, email, position, phoneNumber } = req.body;
        await db.collection('employees').doc(employeeId).update({ fullName, idNumber, email, position, phoneNumber });
        res.redirect(`/employees/${employeeId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Get employee details and render
app.get('/employees/:id', async (req, res) => {
    const employeeId = req.params.id;
    console.log(employeeId);
    console.log(req.params);
    const employeeSnapshot = await db.collection('employees').doc(employeeId).get();
    const employee = { ...employeeSnapshot.data(), id: employeeSnapshot.id }
    console.log(employee);
    // res.send(employee);
    res.render('details', { employee });
})

// Get all employees and return them
app.get('/employees', async (req, res) => {
    try {
        const employeeRef = db.collection('employees');
        const response = await employeeRef.get();
        const employees = []
        response.forEach((employee) => {
            employees.push({ ...employee.data(), id: employee.id });
        })
        res.render('index', { employees: employees, title: 'Home' });
    } catch (error) {
        console.log(error.message);
    }
})
// Add a new employee
app.post('/employees', upload, async (req, res) => {
    console.log('adding employee');
    try {
        const employee = {
            fullName: req.body.fullName,
            idNumber: req.body.idNumber,
            email: req.body.email,
            position: req.body.position,
            phoneNumber: req.body.phoneNumber,
        }
        const file = req.file;
        const bucket = admin.storage().bucket();
        console.log('file: ', file);
        if (file) {
            const fileName = `${file.filename}`;
            const storageRef = admin.storage().bucket();
            const uploadedFile = await storageRef.upload(file.path, {
                destination: `images/${fileName}`,
                metadata: {
                    contentType: file.mimetype
                }

            });
 
            const url = await uploadedFile[0].getSignedUrl({
                action: 'read',
                expires: '12-12-2024',
            });
            console.log(url);
            employee.pictureUrl = url[0];

            // Unlink the file from the local storage
            fs.unlinkSync(file.path);

        }
        const response = await db.collection('employees').add(employee);
        // res.send(response)
        res.redirect('/employees')
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})
// Get employee data and populate form
app.get('/edit/:id', async (req, res) => {
    const employeeId = req.params.id;
    console.log(employeeId);
    console.log(req.params);
    const employeeSnapshot = await db.collection('employees').doc(employeeId).get();
    const employee = { ...employeeSnapshot.data(), id: employeeSnapshot.id }
    console.log(employee);
    // res.send(employee);
    res.render('edit', { employee });
})


// Delete an employee
app.delete('/employees/:id', async (req, res) => {
    console.log('trying to delete employee');
    try {
        const response = await db.collection('employees').doc(req.params.id).delete();
        console.log('Delete successful');
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

app.get('/details', (req, res) => {
    res.render('details', { title: 'Details' });
})


// Handle bad requests
app.use((req, res) => {
    res.status(200).render('404', { title: 'Not Found' });
})

app.listen(3000);