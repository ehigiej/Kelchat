require("dotenv").config()
const express = require("express")
const app = express()
const http = require('http')
const socketio = require("socket.io")
const multer = require('multer')
const path = require("path")
const {userJoin, userLeave, getCurrentUser, getRoomUsers} = require('./handler/userfilter')
const messageFilter = require('./handler/messagefilter')

//Multer Middleware
const storage = multer.diskStorage({
    destination: function( req, file, cb) {
        cb(null, "./public/uploads")
    },
    filename: function ( req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

//Middleware
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('./public'))

const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = socketio(server)
const kelbot = "Kel Bot"

io.on("connection", socket => {
    socket.on("joinRoom", ({username, room, imageSrc}) => {
        const user = userJoin(socket.id, username, room, imageSrc)
        socket.join(user.room)

        socket.emit("message", messageFilter(kelbot, "Welcome to Kelchat", "kelbot.png"))
        //broadcast when user connects
        //emits to everybody except new user
        socket.broadcast.to(user.room).emit("message", messageFilter(kelbot, `${username} Joined the chat`, "kelbot.png"))

        //Send Users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //Handle Messages from the User
    socket.on("chatMessage", (msg) => {
        //Find User
        const user = getCurrentUser(socket.id)
        if(user) {
            socket.emit("userMessage", messageFilter(user.username, msg, user.imageSrc))
            socket.broadcast.to(user.room).emit("message", messageFilter(user.username, msg, user.imageSrc))
        } else {
            socket.emit("error", "error")
        }
    })

    //Handle When A User disconnect
    socket.on('disconnect', ()=> {
        const user = userLeave(socket.id)

        if(user) {
            io.to(user.room).emit("message", messageFilter(kelbot, `${user.username} left the chat`, "kelbot.png"))
            
            //Send Users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            })  
        } 
    })
})

app.post("/upload", upload.single("image-file"), (req, res) => {
    //Upload Image File To Server
    const filename = req.file.originalname
    res.send(filename)
})

server.listen(port)