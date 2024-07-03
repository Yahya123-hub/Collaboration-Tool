import { useState, useEffect } from "react";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSelector } from 'react-redux';

const socket = io.connect("http://localhost:3001");

const Chatroom = () => {
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      setUsername(user.email);
    }
  }, [user]);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="w-screen h-screen bg-dark text-gray-900 font-sans grid place-items-center">
      {!showChat ? (
        <div className="flex flex-col items-center text-center">
          <h3 className="text-2xl mb-4 text-white">Chat-Room</h3>
          <input
            className="w-52 h-10 mb-2 border-2 border-blue-600 rounded px-2 text-white"
            type="text"
            value={username}
            readOnly
          />
          <input
            className="w-52 h-10 mb-2 border-2 border-blue-600 rounded px-2 text-white"
            type="text"
            placeholder="Room ID"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button
            className="w-56 h-12 mt-2 mb-2 border-none rounded bg-blue-600 text-white cursor-pointer hover:bg-blue-400"
            onClick={joinRoom}
          >
            Join Room
          </button>
          <p className="mt-2 text-white">Check your group invite email for room ID or Set custom ID</p>
        </div>
      ) : (
        <div className="w-75 h-[450px]">
          <div className="h-11 rounded bg-gray-800 relative cursor-pointer">
            <p className="text-white font-bold leading-11 pl-8">Live Chat</p>
          </div>
          <div className="h-[calc(450px-(45px+70px))] border border-gray-800 bg-white relative">
            <ScrollToBottom className="w-full h-full overflow-y-scroll overflow-x-hidden no-scrollbar">
              {messageList.map((messageContent, index) => {
                return (
                  <div
                    key={index}
                    className={`h-auto p-2 flex ${
                      username === messageContent.author ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div>
                      <div
                        className={`w-auto h-auto min-h-10 max-w-[120px] rounded text-white flex items-center mr-1 ml-1 p-1 overflow-wrap break-words ${
                          username === messageContent.author
                            ? "bg-green-600"
                            : "bg-blue-600"
                        }`}
                      >
                        <p>{messageContent.message}</p>
                      </div>
                      <div className="flex text-xs">
                        <p className={`mr-2 ${username === messageContent.author ? "ml-2" : "mr-2"}`}>
                          {messageContent.time}
                        </p>
                        <p className="font-bold">{messageContent.author}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ScrollToBottom>
          </div>
          <div className="h-10 border border-gray-800 border-t-0 flex">
            <input
              className="h-full flex-[85%] border-0 px-2 font-sans border-r border-dotted border-gray-600 outline-none text-white"
              type="text"
              value={currentMessage}
              placeholder="Message"
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <button
              className="border-0 grid place-items-center cursor-pointer flex-[15%] h-full bg-transparent outline-none text-2xl text-gray-400 hover:text-green-600"
              onClick={sendMessage}
            >
              &#9658;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatroom;
