const express = require("express");
const portNumber = 3001;
const app = express(); 
const server = require("http").createServer(app); 

const cors = require("cors");
app.use(cors());

let user = 0;
let history = [];

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {                     
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {

    socket.on('login', () => {
        history.push({ msg: "ユーザー"+user+"が入室しました。", sender: "" });
        const jsonHistory = JSON.stringify(history);

        io.emit("id", user);
        io.emit("history", jsonHistory)
    });

    socket.on('regist', () => {

        user++;

    });

    socket.on('chat',  (msg, user)=> {
        console.log(msg + "" + user);
        history.push({msg:msg,sender:user});
        io.emit('chat', msg,user);
    });

    socket.on("disconnect", () => { 

        console.log("user disconnected");
    });
});


server.listen(portNumber);
console.log(`Web server is on. PortNumber is ${portNumber}.`);