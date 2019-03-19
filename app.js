const express = require('express')
const app = express()
const server = require('http').Server(app)

const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  res.render('index.handlebars')
})

server.listen('3000', function() {
  console.log('Server listening on Port 3000!')
})