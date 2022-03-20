const express = require('express');
const path = require('path')
const bookRouter = require('./routes/books');
const app = express();
app.set('views ', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));

app.use(bookRouter)

app.listen(3000)