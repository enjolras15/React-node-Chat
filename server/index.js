const express = require("express");
const portNumber = 3001;
const app = express(); 
const server = require("http").createServer(app); 

const cors = require("cors");
app.use(cors());



const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {                     
        origin: "*",
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {

    socket.user = 0;

    socket.on('login', () => {

        io.emit("id", socket.user);
        socket.user++;

    })

    socket.on('chat',  (msg, user)=> {
        console.log(msg+""+user);
        io.emit('chat', msg,user);
    });

    socket.on("disconnect", () => { 
        console.log("user disconnected");
    });
});


server.listen(portNumber);
console.log(`Web server is on. PortNumber is ${portNumber}.`);