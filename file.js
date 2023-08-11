const fs = require('fs')

setTimeout(() => {

    // reading from file
    fs.readFile('./db.txt', (err,data) => {
        console.log(data.toString())
    })

}, 3000)


// writing to file
fs.appendFile('./db.txt','grapes,5.7,6', (err,data) => {
    console.log('file written')
});

if (!fs.existsSync('./picss')) {
    fs.mkdir('./picss', (error) => {
        if (error) {
            console.log('failed to create directory');
        } else
            console.log('created directory successfully');
    }
    );
} else {
    fs.rmdir('./picss', (error) => {
        if (error) {
            console.log(err)
        }
        console.log('directory deleted')
    });
}

// delete the file
if(fs.existsSync('./db.txt')) {
    fs.unlink('./db.txt', (error) => {
        if (error) {
            console.log(err)
        }
        console.log('file deleted successfully')
    });
}