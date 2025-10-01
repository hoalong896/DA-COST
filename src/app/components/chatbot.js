"use client";
import { useEffect, useState, useRef } from "react";

export default function UsedGoodsFAQBot() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    fetch("/api/chat")
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleClick = async (q) => {
    setMessages(prev => [...prev, { sender: "user", text: q.question }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.id }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
  };

  const handleClose = () => {
    setOpen(false);
    setMessages([]); // reset messages khi đóng chat
  };

  return (
    <>
      {/* Chat Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full shadow-2xl text-white text-3xl flex items-center justify-center transition transform hover:scale-110 hover:shadow-3xl z-50"
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[500px] bg-white shadow-2xl rounded-xl flex flex-col z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between bg-green-500 text-white p-3 font-semibold rounded-t-xl">
            <span>Trợ lý đồ cũ</span>
            <button onClick={handleClose} className="text-xl hover:text-gray-200 transition">✖</button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <span
                  className={`inline-block px-4 py-2 rounded-xl max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-800 shadow-inner"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Câu hỏi */}
          <div className="p-3 border-t bg-gray-100 grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {questions.map(q => (
              <button
                key={q.id}
                onClick={() => handleClick(q)}
                className="w-full text-left bg-white hover:bg-green-100 border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 transition duration-200"
              >
                <span className="text-green-500 text-xl animate-bounce">❓</span>
                <span className="truncate">{q.question}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
