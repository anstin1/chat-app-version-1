import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessage] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const roomId  = '1234';

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) =>{
      console.log(event.data);
      setMessage(m => [...m,event.data])
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: roomId
        }
      }))
    }

    return () => {
      wsRef.current?.close();
    }
  }, [])
  return (
  <div className="flex flex-col h-screen bg-black text-white">
    {/* Chat Messages Section */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="flex justify-start">
          <span className="bg-white text-black rounded-2xl px-4 py-2 max-w-[75%] break-words shadow-md">
            {message}
          </span>
        </div>
      ))}
    </div>

    {/* Input Section */}
    <div className="bg-white p-4 flex gap-2 items-center">
      <input
        type="text"
        className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
        placeholder="Type your message..."
        onChange={(e) => setInputMsg(e.target.value)}
        value={inputMsg}
      />
      <button
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow transition duration-200"
        onClick={() => {
          wsRef.current?.send(
            JSON.stringify({
              type: "chat",
              payload: {
                roomId: roomId,
                message: inputMsg,
              },
            })
          );
          setInputMsg('');
        }}
      >
        Send
      </button>
    </div>
  </div>
);
}

export default App
