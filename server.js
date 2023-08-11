const http = require('http');
const fs = require('fs');

// const server = http.createServer((req, res) => {
//     console.log('Request made');
//     res.setHeader('Content-Type', 'text/html');

//     let path = './views';

//     switch (req.url) {
//         case '/':
//             path += '/index.html';
//             res.statusCode = 200;
//             break;
//         case '/about':
//             path += '/about.html';
//             res.statusCode = 200;
//             break;
//         default:
//             path += '/404.html';
//             res.statusCode = 404;
//             break;
//     }



//     fs.readFile(path, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.end();

//         } else {
//             res.write(data);
//             res.end();

//         }
//     })
// })

// server.listen(3000, 'localhost', () => {
//     console.log('server listening on port 3000');
// });

const express = require('express')
const app = express()
const port = 3000

const userRouter = require('./routes/users')

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

app.use('/users', userRouter)

app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
//   // res.json({name: 'Nicholas', gender: 'male', age: 30})
//   // res.send('Hello World!')
//   res.render('index',{person: {name: 'Nicholas', gender: 'male', age: 30}})
// })

// app.get('/about', (req, res) => {
//   // res.json({name: 'Nicholas', gender: 'male', age: 30})
//   // res.send('Hello World!')
//   res.render('about')
// })

// app.get('*', (req, res) => {
//   // res.json({name: 'Nicholas', gender: 'male', age: 30})
//   // res.send('Hello World!')
//   res.render('404')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})