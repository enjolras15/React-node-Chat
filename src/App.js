import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client';



function App() {


    const [data, setData] = useState([]);
    const [inputValue, setValue] = useState("");
    const [myId, setId] = useState(0);

    const socket = io("http://localhost:3001");
    // サーバに接続できた場合のイベント処理を定義する
    socket.on("connect", () => {
        socket.emit('login');

    });
    socket.on("id", (id) => {

        setId(id);
        console.log(myId);
    });



    socket.on('chat', (msg,user) => {
        const newMessage = {
            msg: msg,
            sender: 0
        }

        setData([...data, newMessage]);
    });

    const SendMessage = () => {

        socket.emit('chat', inputValue,0);

        setValue("");

    };

    const GenerateChatHistory = () => {

        let chat = [];

        data.forEach((item,index) => {

            chat.push(<p key={index}>{item.msg}</p>);

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