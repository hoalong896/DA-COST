"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Store } from "lucide-react";

export default function CustomerQuestionsPage() {
  // Danh sách câu hỏi & trả lời (giả lập)
  const [questions, setQuestions] = useState([
    { id: 1, user: "Tôi", question: "Sản phẩm này có bảo hành không?", answer: "Có, bảo hành 12 tháng." },
    { id: 2, user: "Người khác", question: "Phí ship là bao nhiêu?", answer: "Ship toàn quốc 30k." },
    { id: 3, user: "Người khác", question: "Có đủ size không?", answer: null },
  ]);

  const [newQuestion, setNewQuestion] = useState("");

  // Gửi câu hỏi mới
  const handleAsk = () => {
    if (!newQuestion.trim()) return;
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        user: "Tôi",
        question: newQuestion,
        answer: null,
      },
    ]);
    setNewQuestion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-3 border mb-8"
      >
        <Store size={28} className="text-yellow-700" />
        <h1 className="text-2xl font-bold text-yellow-700">Hỏi đáp với Người bán</h1>
      </motion.div>

      {/* Form đặt câu hỏi */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="font-bold text-yellow-700 mb-4">✍️ Đặt câu hỏi cho Người bán</h2>
        <div className="flex">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 border rounded-xl px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleAsk}
            className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
          >
            Gửi
          </button>
        </div>
      </div>

      {/* Danh sách Q&A */}
      <div className="space-y-6">
        {questions.map((q) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <MessageCircle className="text-yellow-600" size={20} />
              <p className="font-semibold text-gray-800">{q.user} hỏi:</p>
            </div>
            <p className="ml-8 text-gray-700">{q.question}</p>

            {q.answer ? (
              <div className="mt-3 ml-8 border-l-4 border-green-500 pl-4 text-gray-800">
                <p><b>Người bán trả lời:</b> {q.answer}</p>
              </div>
            ) : (
              <p className="mt-3 ml-8 text-gray-500 italic">⏳ Người bán chưa trả lời...</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
