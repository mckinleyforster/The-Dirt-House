const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
var path = require('path')
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Housing'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.use('/css', express.static('public/stylesheets'));
app.use('/scripts', express.static('public/javascripts'));


app.set('view engine', 'ejs')
app.use(express.static('public'))
// app.use(express.static('views'))
app.use(express.static('files'))
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('rappers').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('home.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.get('/home.ejs', function(req, res) {
    res.render('home');
});

app.get('/buildingOverview.ejs', function(req, res) {
    res.render('buildingOverview');
});

app.get('/loads.ejs', function(req, res) {
    res.render('loads');
});

app.get('/design.ejs', function(req, res) {
    res.render('design');
});

app.get('/about.ejs', function(req, res) {
    res.render('about');
});

app.get('/references.ejs', function(req, res) {
    res.render('references');
});

app.get('/forum.ejs', function(req, res) {
    res.render('forum');
});

app.post('/addRapper', (request, response) => {
    db.collection('rappers').insertOne({stageName: request.body.stageName,
    birthName: request.body.birthName, likes: 0})
    .then(result => {
        console.log('Rapper Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    db.collection('rappers').updateOne({stageName: request.body.stageNameS, birthName: request.body.birthNameS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteRapper', (request, response) => {
    db.collection('rappers').deleteOne({stageName: request.body.stageNameS})
    .then(result => {
        console.log('Rapper Deleted')
        response.json('Rapper Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})