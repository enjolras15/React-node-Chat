import React, { useState,useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

let myId = -1;

function App() {


    const [data, setData] = useState([]);
    const [inputValue, setValue] = useState("");

    const socket = io("http://localhost:3001");
    // サーバに接続できた場合のイベント処理を定義する

    useEffect(() => {

        socket.on("connect", () => {
        if (myId === -1) {
            socket.emit('login');
        }
    });

        socket.on("id", (id) => {
        if (myId === -1) {
            myId = id;
            socket.emit('regist');
        }
    });

    socket.on("history", (history) => {

        if (history && data.length===0) {
            const parsedHistory = JSON.parse(history);

            setData(parsedHistory);
        }

    });
        return () => {

            socket.off("connect");
            socket.off("id");
            socket.off("history");

        };
    }, []);


    socket.on('chat', (msg, user) => {
        const newMessage = {
            msg: msg,
            sender: user
        }

        setData([...data, newMessage]);
    });

    const SendMessage = () => {

        socket.emit('chat', inputValue,myId);

        setValue("");

    };

    const GenerateChatHistory = () => {

        let chat = [];

        data.forEach((item,index) => {
           // const messageContent = (item.sender === myId) ? "あなた: " + item.msg : "ユーザー" + item.sender + ": " + item.msg;

            chat.push(<p key={index}>{
                (item.sender === myId) ? "あなた: " + item.msg : (item.sender === "") ? item.msg : "ユーザー" + item.sender + ": " + item.msg            

            }</p>);

        });

        return chat;
    };

    const InputText = (event) => {

        setValue(event.target.value);

    }


    return (
        <div>

            <input value={inputValue} onChange={(event)=>InputText(event) }></input><button onClick={()=>SendMessage() }>Send</button>
   
            <div className="log">{GenerateChatHistory()}</div>



        </div>
    );
}

export default App;