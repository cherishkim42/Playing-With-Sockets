const express = require('express')
const app = express()
const server = require('http').Server(app)

const io = require('socket.io')(server)
//Store online users here
let onlineUsers = {}
io.on('connection', (socket) => { //Execute what's in this fxn when new socket (client) connections are formed
  console.log('💗new user connected woo💗')
  require('./sockets/chat.js')(io, socket, onlineUsers)
})
//Using object instead of array to save our users because this object will act as a DICTIONARY to access each user's ID (unique socket ID that IDs the socket as a unique connected user) by their username

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