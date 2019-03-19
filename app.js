const express = require('express')
const app = express()
const server = require('http').Server(app)

const io = require('socket.io')(server)
io.on('connection', (socket) => { // Execute what's in this fxn when new socket (client) connections are formed
  console.log('💗new user connected woo💗')
  require('./sockets/chat.js')(io, socket)
})

const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index.handlebars')
})

server.listen('3000', function() {
  console.log('Server listening on Port 3000!')
})